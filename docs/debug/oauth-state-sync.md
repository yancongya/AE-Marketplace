# OAuth 登录状态同步问题排查文档

## 问题描述

用户通过 GitHub OAuth 成功登录后，无法进入管理员模式。具体表现为：

- GitHub 登录成功，页面显示 "GitHub 登录成功！" 提示
- 控制台日志显示权限检查通过："✅ User has admin access"
- 导航栏显示用户信息（GitHub 图标 + 用户名）
- 但显示 X 图标而不是锁图标 🔒（表示无管理员权限）
- 无法看到"新建文档"、"编辑"等管理员功能

## 环境信息

- **框架**: React 18
- **状态管理**: React Context API (AdminContext)
- **OAuth 流程**: GitHub OAuth 2.0 PKCE
- **认证方式**: localStorage 存储 access token
- **部署环境**: Vercel 生产环境

## 根本原因

### 问题 1：状态管理时序竞争

**问题描述**：
OAuth 回调页面和 AdminProvider 的 useEffect 同时执行，导致状态检查在 token 存储之前完成。

**时间线分析**：
```
时间轴：
─────────────────────────────────────────────
T0: Callback 页面 useEffect 启动
    └─> 调用 handleCallback() [异步操作]
        └─> fetch 获取 access token [网络请求]
        └─> localStorage.setItem('github_access_token', token)

T0: AdminProvider useEffect 启动（与 Callback 同时）
    └─> 调用 checkGitHubAuth() [同步操作]
        └─> githubAuth.isAuthenticated()
            └─> localStorage.getItem('github_access_token')
            └─> 返回 false（token 尚未存储）
    └─> setIsAdmin(false)

T1: handleCallback 完成
    └─> token 已存储到 localStorage
    └─> 但 AdminProvider 已经完成检查
    └─> 不会重新检查 → isAdmin 保持 false
```

**控制台日志证据**：
```javascript
Callback: Starting OAuth callback handling
Callback: Calling handleCallback
handleCallback: Starting callback handling
handleCallback: Calling GitHub API via proxy
Checking GitHub authentication...        // ← AdminProvider 检查
Authentication status: false            // ← token 未存储
User not authenticated                  // ← 检查完成
handleCallback: Response status: 200    // ← 回调请求完成
handleCallback: Storing access token    // ← 存储 token
handleCallback: Access token stored successfully  // ← 存储完成
// ← 此处没有重新检查！
```

### 问题 2：尝试使用 storage 事件失败

**尝试方案**：
监听 `localStorage` 的 `storage` 事件，在 token 存储时触发重新检查。

```typescript
useEffect(() => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'github_access_token' && e.newValue) {
      checkGitHubAuth(); // 重新检查
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

**失败原因**：
- `storage` 事件**只在跨标签页触发**
- Callback 页面和 AdminProvider 在**同一个标签页**
- 同标签页的 localStorage 变化不会触发 storage 事件

**MDN 文档说明**：
> The storage event of the Window interface fires when a storage area (localStorage or sessionStorage) has been modified in the context of another document.

**关键**：**"another document"** - 只有在其他标签页修改时才触发。

## 解决方案

### 最终方案：自定义事件（Custom Event）

使用浏览器原生 CustomEvent API，在同一标签页内实现组件间通信。

#### 1. 触发事件（Callback 页面）

**文件**: `src/lib/github-auth.ts`

```typescript
async handleCallback(params: URLSearchParams): Promise<string> {
  // ... OAuth 逻辑 ...

  // 存储 access token
  localStorage.setItem('github_access_token', data.access_token);
  console.log('handleCallback: Access token stored successfully');
  
  // 触发自定义事件（同标签页通信）
  console.log('handleCallback: Dispatching github_auth_success event');
  const authEvent = new CustomEvent('github_auth_success', {
    detail: { accessToken: data.access_token }
  });
  console.log('handleCallback: Event created, dispatching...');
  window.dispatchEvent(authEvent);
  console.log('handleCallback: Event dispatched successfully');
  
  // ... 清理逻辑 ...
  
  return data.access_token;
}
```

#### 2. 监听事件（AdminProvider）

**文件**: `src/contexts/AdminContext.tsx`

```typescript
export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [githubAuth] = useState(() => new GitHubAuth());
  const [githubAPI, setGithubAPI] = useState<GitHubAPI | null>(null);
  
  // 初始认证检查
  useEffect(() => {
    checkGitHubAuth();
  }, []);
  
  // 监听自定义事件（处理 OAuth 回调后的状态更新）
  useEffect(() => {
    const handleAuthSuccess = (event: Event) => {
      console.log('Received github_auth_success event (raw)', event);
      const customEvent = event as CustomEvent<{ accessToken: string }>;
      console.log('Received github_auth_success event:', customEvent.detail);
      
      // 延迟检查，确保状态稳定
      setTimeout(() => {
        console.log('Re-checking authentication after auth success event');
        checkGitHubAuth();
      }, 100);
    };
    
    console.log('Setting up github_auth_success event listener');
    window.addEventListener('github_auth_success', handleAuthSuccess);
    
    return () => {
      console.log('Cleaning up github_auth_success event listener');
      window.removeEventListener('github_auth_success', handleAuthSuccess);
    };
  }, []); // 只设置一次监听器
  
  const checkGitHubAuth = async () => {
    console.log('Checking GitHub authentication...');
    const isAuthenticated = githubAuth.isAuthenticated();
    console.log('Authentication status:', isAuthenticated);
    
    if (isAuthenticated) {
      try {
        const userInfo = await githubAuth.getUserInfo();
        console.log('GitHub user info:', { login: userInfo.login, id: userInfo.id });
        setUser(userInfo);
        
        console.log('Starting permission diagnosis...');
        const diagnosis = await githubAuth.diagnosePermissions(GITHUB_REPO_OWNER, GITHUB_REPO_NAME);
        console.log('Permission diagnosis result:', diagnosis);
        
        if (diagnosis.hasAccess) {
          console.log('✅ User has admin access, setting isAdmin to true');
          setIsAdmin(true);
          const token = githubAuth.getAccessToken();
          if (token) {
            setGithubAPI(new GitHubAPI(token, GITHUB_REPO_OWNER, GITHUB_REPO_NAME));
            console.log('✅ GitHub API initialized successfully');
          }
        } else {
          console.warn('❌ User does not have admin access');
          console.warn('Reason:', diagnosis.reason);
          toast.error(`没有管理员权限: ${diagnosis.reason}`);
        }
      } catch (error) {
        console.error('GitHub auth check failed:', error);
        toast.error('GitHub 认证检查失败');
      }
    } else {
      console.log('User not authenticated');
    }
  };
  
  // ... 其他代码 ...
}
```

### 为什么选择自定义事件？

#### 优点

1. **同标签页通信** - 适用于同一标签页内的组件通信
2. **即时触发** - 不需要等待其他标签页操作
3. **轻量级** - 使用浏览器原生 API，无需额外依赖
4. **可传递数据** - 通过 `detail` 参数传递复杂对象
5. **类型安全** - TypeScript 支持良好

#### 对比其他方案

| 方案 | 同标签页 | 跨标签页 | 实现复杂度 | 性能 |
|------|---------|---------|-----------|------|
| Custom Event | ✅ | ❌ | 低 | 高 |
| storage 事件 | ❌ | ✅ | 低 | 高 |
| Context API | ✅ | ❌ | 中 | 中 |
| Redux/Zustand | ✅ | ✅ | 高 | 中 |
| EventBus | ✅ | ✅ | 高 | 中 |

## 验证方法

### 1. 检查控制台日志

登录后，应该看到以下日志序列：

```javascript
// 第一部分：OAuth 回调
Callback: Starting OAuth callback handling
Callback: URL params received: {hasCode: true, hasState: true, hasError: false}
Callback: Calling handleCallback
handleCallback: Starting callback handling
handleCallback: Parameters: {code: 'd42e571b23...', state: 'u2mte89o68...'}
handleCallback: State verification: {provided: 'u2mte89o68...', stored: 'u2mte89o68...', match: true}
handleCallback: Calling GitHub API via proxy

// 第二部分：AdminProvider 初始检查
Checking GitHub authentication...
Authentication status: false  // ← 第一次检查（token 未存储）
User not authenticated
Setting up github_auth_success event listener  // ← 监听器设置

// 第三部分：OAuth 响应和事件触发
handleCallback: Response status: 200
handleCallback: GitHub response: {hasError: false, error: null, hasAccessToken: true}
handleCallback: Storing access token to localStorage
handleCallback: Access token stored successfully
handleCallback: Dispatching github_auth_success event
handleCallback: Event created, dispatching...
handleCallback: Event dispatched successfully

// 第四部分：事件接收和重新检查
Received github_auth_success event (raw) CustomEvent {...}
Received github_auth_success event: {accessToken: "gho_0NI3Vh..."}
Re-checking authentication after auth success event
Checking GitHub authentication...
Authentication status: true  // ← 重新检查（token 已存储）
GitHub user info: {login: "yancongya", id: 67275209}
Starting permission diagnosis...
Permission diagnosis result: {authenticated: true, user: {...}, repoExists: true, permissions: {...}, hasAccess: true, ...}
✅ User has admin access, setting isAdmin to true  // ← 成功！
✅ GitHub API initialized successfully

// 第五部分：导航
Callback: Access token received: gho_0NI3Vh...
Callback: Navigating to home
```

### 2. 检查 UI 状态

登录成功后，应该看到：

- ✅ 导航栏显示：GitHub 图标 + 用户名 + 🔒 锁图标
- ✅ 在任意标签页，可以看到"新建文档"卡片（带 + 图标）
- ✅ 点击任意文档，右上角显示"编辑"按钮

### 3. 检查 localStorage

在浏览器控制台运行：

```javascript
localStorage.getItem('github_access_token')
// 应该返回: "gho_xxx..." (access token 字符串)
```

## 常见问题

### Q: 为什么要延迟 100ms？

A: 确保 token 存储操作完成后再检查。虽然 localStorage 是同步的，但添加小延迟可以提高可靠性。

### Q: 如果事件监听器设置失败会怎样？

A: 事件监听器使用 `useEffect` 设置，会在组件挂载时立即执行。如果设置失败，可以在控制台看到 "Setting up github_auth_success event listener" 日志。

### Q: 需要清理事件监听器吗？

A: 是的，在 `useEffect` 的 cleanup 函数中移除监听器，避免内存泄漏。

### Q: 可以在多个地方触发同一个事件吗？

A: 可以，但建议只在一个地方触发（handleCallback），避免重复触发。

### Q: 如果 token 存储失败会怎样？

A: 事件仍然会触发，但 `checkGitHubAuth()` 会返回 false，不会设置管理员权限。

## 调试技巧

### 1. 添加更多日志

在关键位置添加 `console.log`，跟踪执行流程：

```typescript
console.log('Step 1: Starting OAuth flow');
console.log('Step 2: Token stored');
console.log('Step 3: Event dispatched');
console.log('Step 4: Event received');
console.log('Step 5: Re-checking auth');
```

### 2. 使用 Chrome DevTools

- **Sources 标签**：设置断点，调试执行流程
- **Console 标签**：查看日志输出
- **Application 标签**：检查 localStorage 内容

### 3. 模拟事件触发

在控制台手动触发事件，测试监听器：

```javascript
const authEvent = new CustomEvent('github_auth_success', {
  detail: { accessToken: 'test-token' }
});
window.dispatchEvent(authEvent);
```

### 4. 检查事件监听器数量

```javascript
// 查看所有事件监听器
window.getEventListeners(window);
```

## 相关文件

- `src/lib/github-auth.ts` - GitHub OAuth 认证逻辑
- `src/contexts/AdminContext.tsx` - 管理员状态管理
- `src/pages/Callback.tsx` - OAuth 回调页面
- `src/components/Navbar.tsx` - 导航栏（显示管理员状态）

## 参考资料

- [CustomEvent API](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent)
- [storage 事件限制](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)
- [React useEffect 依赖](https://react.dev/reference/react/useEffect)
- [Event Loop 机制](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)

## 历史记录

### 2026-03-18
- 首次发现 OAuth 状态同步问题
- 尝试使用 storage 事件（失败）
- 实现自定义事件方案（成功）
- 部署到生产环境并验证

---

**修复日期**: 2026-03-18  
**修复版本**: commit 2c56078  
**影响范围**: GitHub OAuth 登录流程