# GitHub OAuth 应用创建指南

本文档指导如何为 AE Marketplace 创建和配置 GitHub OAuth 应用。

## 📋 目录

- [创建 GitHub OAuth App](#创建-github-oauth-app)
- [配置 Vercel 环境变量](#配置-vercel-环境变量)
- [常见问题](#常见问题)
- [注意事项](#注意事项)

## 创建 GitHub OAuth App

### 步骤 1：访问开发者设置

1. 访问：https://github.com/settings/developers
2. 确保在 **"OAuth Apps"** 标签页（不是 "GitHub Apps"）

### 步骤 2：创建新应用

1. 点击 **"New OAuth App"** 按钮
2. 填写以下信息：

```
Application name: AE Marketplace Admin
Homepage URL: https://aemarketplace.vercel.app
Application description: OAuth登录用于AE脚本市场
Authorization callback URL: https://aemarketplace.vercel.app/callback
```

**重要说明**：
- `Homepage URL` 必须是完整的 URL（包括 `https://`）
- `Authorization callback URL` 必须准确匹配应用的回调路径
- 不要包含末尾的斜杠 `/`

### 步骤 3：获取凭证

创建成功后，页面会显示：

```
Client ID
Ov23limbHCCVDlk5GWnv
```

**复制并保存 Client ID**，后续配置时需要使用。

### 步骤 4：生成 Client Secret

在应用页面找到 "Client secrets" 部分：

1. 点击 **"Generate a new client secret"**
2. 输入描述（可选）
3. 点击 **"Generate secret"**
4. **立即复制并保存**（此 Secret 只显示一次！）

⚠️ **重要**：Client Secret 只显示一次，丢失后需要重新生成。

## 配置 Vercel 环境变量

### 步骤 1：访问 Vercel 项目设置

1. 访问：https://vercel.com/yancongya/ae-marketplace/settings/environment-variables
2. 点击 **"Add New"** 添加环境变量

### 步骤 2：添加 Client ID

创建第一个环境变量：

```
Name: VITE_GITHUB_CLIENT_ID
Value: Ov23limbHCCVDlk5GWnv  // 你的 Client ID
Environment: Production, Preview, Development
```

**关键点**：
- 名称必须是 `VITE_GITHUB_CLIENT_ID`（Vite 标准前缀）
- Value 填入你从 GitHub 复制的 Client ID
- 选择所有环境以确保开发和生产环境都能使用

### 步骤 3：添加 Client Secret

创建第二个环境变量：

```
Name: GITHUB_CLIENT_SECRET
Value: [你的 Client Secret]
Environment: Production, Preview, Development
```

**关键点**：
- 名称是 `GITHUB_CLIENT_SECRET`（没有 `VITE_` 前缀，因为这是服务器端使用）
- Value 填入你生成的 Client Secret
- ⚠️ **安全警告**：Client Secret 是敏感信息，不要泄露！

### 步骤 4：保存并重新部署

1. 点击 **"Save"** 保存环境变量
2. Vercel 会提示你重新部署
3. 点击 **"Redeploy to Production"**
4. 等待部署完成（通常 1-2 分钟）

## 常见问题

### 问题 1：OAuth App vs GitHub App

**症状**：创建的应用 Client ID 以 `Iv` 或 `Ov` 开头，或者页面显示 "GitHub Marketplace" 选项。

**原因**：误创建了 GitHub App 而不是 OAuth App。

**解决方案**：
1. 删除错误的应用
2. 确保在 https://github.com/settings/developers 页面（注意是 `developers` 不是 `apps`）
3. 点击 "OAuth Apps" 标签
4. 重新创建应用

### 问题 2：incorrect_client_credentials 错误

**症状**：GitHub 返回 `incorrect_client_credentials` 错误。

**可能原因**：
1. Client ID 或 Client Secret 不正确
2. 环境变量没有正确设置
3. 代码没有重新部署

**解决方案**：
1. 确认 Client ID 和 Client Secret 正确
2. 检查 Vercel 环境变量是否正确配置
3. 确保已经重新部署
4. 查看控制台日志中的 `client_id` 值

### 问题 3：redirect_uri_mismatch 错误

**症状**：GitHub 返回 `redirect_uri_mismatch` 错误。

**原因**：回调 URL 配置不正确。

**解决方案**：
1. 确认 GitHub OAuth App 中的回调 URL 是：`https://aemarketplace.vercel.app/callback`
2. 不要包含末尾的斜杠
3. 确保协议是 `https` 不是 `http`

### 问题 4：环境变量不生效

**症状**：前端仍然使用默认的 Client ID。

**原因**：
1. 环境变量名称不正确
2. 没有重新部署
3. Vite 的 envPrefix 配置问题

**解决方案**：
1. 确保环境变量名称是 `VITE_GITHUB_CLIENT_ID`（注意大写）
2. 重新部署项目
3. 检查 `vite.config.ts` 中的 `envPrefix` 配置

### 问题 5：OAuth 登录成功但无法进入管理员模式

**症状**：
- GitHub 登录成功，控制台显示 "GitHub 登录成功！"
- 权限检查通过："✅ User has admin access"
- 但导航栏显示 X 图标而不是锁图标 🔒
- 无法看到新建、编辑等管理员功能

**原因**：
OAuth 回调页面和 AdminProvider 的状态检查存在时序竞争问题：

```
时间线：
T0: Callback 页面 useEffect 启动 → 调用 handleCallback()（异步）
T0: AdminProvider useEffect 启动 → 调用 checkGitHubAuth()
T0: checkGitHubAuth 调用 isAuthenticated() → 返回 false（token 未存储）
T1: handleCallback 完成 → 存储 token 到 localStorage
T1: AdminProvider 已经完成检查 → 不会重新检查 → isAdmin 保持 false
```

**解决方案**：
使用自定义事件确保 Callback 页面和 AdminProvider 在同一标签页内同步状态：

1. **在 `src/lib/github-auth.ts` 中触发事件**：
```typescript
// 存储 access token
localStorage.setItem('github_access_token', data.access_token);

// 触发自定义事件（同标签页通信）
const authEvent = new CustomEvent('github_auth_success', {
  detail: { accessToken: data.access_token }
});
window.dispatchEvent(authEvent);
```

2. **在 `src/contexts/AdminContext.tsx` 中监听事件**：
```typescript
useEffect(() => {
  const handleAuthSuccess = (event: Event) => {
    const customEvent = event as CustomEvent<{ accessToken: string }>;
    setTimeout(() => {
      checkGitHubAuth(); // 重新检查认证状态
    }, 100);
  };
  
  window.addEventListener('github_auth_success', handleAuthSuccess);
  return () => {
    window.removeEventListener('github_auth_success', handleAuthSuccess);
  };
}, []);
```

**为什么不用 storage 事件？**
- `storage` 事件只在跨标签页触发
- Callback 页面和 AdminProvider 在同一标签页
- 自定义事件可以在同一标签页内触发

**验证方法**：
查看控制台日志，应该看到：
```
handleCallback: Event created, dispatching...
handleCallback: Event dispatched successfully
Received github_auth_success event (raw)
Received github_auth_success event: { accessToken: "gho_xxx..." }
Re-checking authentication after auth success event
Authentication status: true  // ← 这次应该是 true
✅ User has admin access, setting isAdmin to true
```

### 问题 6：生产环境管理员功能不可见

**症状**：
- 本地开发环境（`npm run dev`）可以看到管理员功能（新建、编辑按钮）
- 生产环境（Vercel 部署后）登录成功但看不到管理员功能
- 即使 `isAdmin` 为 true，界面也不显示管理员控制

**原因**：
代码中有 `import.meta.env.DEV` 限制，导致管理员功能只在开发环境显示：

```typescript
// TabList.tsx - 新建文档卡片
{import.meta.env.DEV && isAdmin && (
  <div>新建文档</div>
)}

// TabContent.tsx - 编辑按钮
{import.meta.env.DEV && isAdmin && (
  <button>编辑</button>
)}
```

**解决方案**：
移除 `import.meta.env.DEV` 限制，只保留 `isAdmin` 权限检查：

```typescript
// 修改前
{import.meta.env.DEV && isAdmin && ( ... )}

// 修改后
{isAdmin && ( ... )}
```

**需要修改的文件**：
1. `src/components/TabList.tsx` - 新建文档卡片
2. `src/components/TabContent.tsx` - 编辑/保存/取消按钮

**安全保证**：
- 仍然保留 `isAdmin` 权限检查
- 只有通过 GitHub 验证且有仓库权限的用户才能使用
- Token 存储在 localStorage，登录后才会设置 `isAdmin = true`

**验证方法**：
1. 登录 GitHub 后，导航栏应显示 🔒 锁图标
2. 在任意标签页，可以看到"新建文档"卡片（带 + 图标）
3. 点击任意文档，右上角应显示"编辑"按钮

## 注意事项

### 安全相关

1. **保护 Client Secret**
   - Client Secret 是敏感信息，不要提交到代码仓库
   - 只在环境变量中配置
   - 定期轮换（重新生成）

2. **HTTPS 必需**
   - OAuth 回调必须使用 HTTPS
   - 本地开发可以使用 `http://localhost`
   - 生产环境必须是 HTTPS

3. **权限范围**
   - 只请求必要的权限
   - 本项目使用：`public_repo user:email`
   - 不要过度请求权限

### 配置相关

4. **环境变量命名**
   - 前端变量使用 `VITE_` 前缀
   - 服务器端变量不需要前缀
   - 避免使用特殊字符

5. **回调 URL**
   - 必须完全匹配
   - 不要包含末尾斜杠
   - 使用正确的协议（http/https）

6. **部署流程**
   - 修改代码后必须重新部署
   - 环境变量修改后必须重新部署
   - 确认部署成功后再测试

### OAuth 流程相关

7. **PKCE 流程**
   - 本项目使用 PKCE 流程（更安全）
   - 不需要在前端暴露 Client Secret
   - 通过 serverless function 作为代理

8. **状态管理**
   - Access Token 存储在 localStorage
   - 登出时清除 Token
   - Token 有效期通常为 8 小时

### 调试相关

9. **查看日志**
   - 前端错误：浏览器控制台
   - 服务器错误：Vercel 日志
   - GitHub 错误：OAuth 错误页面

10. **测试流程**
    - 本地开发：使用 `.env` 文件
    - 生产环境：使用 Vercel 环境变量
    - 每次修改后都要完整测试

## 验证清单

在配置完成后，使用以下清单验证：

- [ ] 创建的是 OAuth App（不是 GitHub App）
- [ ] Homepage URL 正确：`https://aemarketplace.vercel.app`
- [ ] Authorization callback URL 正确：`https://aemarketplace.vercel.app/callback`
- [ ] 复制了 Client ID
- [ ] 生成了 Client Secret
- [ ] Vercel 环境变量 `VITE_GITHUB_CLIENT_ID` 已设置
- [ ] Vercel 环境变量 `GITHUB_CLIENT_SECRET` 已设置
- [ ] 重新部署了项目
- [ ] 点击 GitHub 按钮能跳转到授权页面
- [ ] 授权后能成功登录
- [ ] 导航栏显示用户信息

## 参考资源

- [GitHub OAuth Apps 文档](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [GitHub OAuth 流程说明](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel 环境变量](https://vercel.com/docs/projects/environment-variables)

## 故障排查

如果遇到问题，按以下顺序排查：

1. **检查浏览器控制台**
   - 查看前端错误信息
   - 确认请求的 URL 和参数

2. **检查 Vercel 日志**
   - 查看服务器端日志
   - 确认环境变量是否正确传递

3. **检查 GitHub OAuth App 配置**
   - 确认应用类型正确
   - 确认回调 URL 正确

4. **重新生成 Client Secret**
   - 如果怀疑 Secret 泄露或错误
   - 重新生成并更新 Vercel

5. **重新创建 OAuth App**
   - 如果配置完全错误
   - 从头开始重新创建

## 支持

如果遇到无法解决的问题：

1. 查看项目 GitHub Issues
2. 查看 Vercel 部署日志
3. 检查 GitHub OAuth App 设置
4. 联系项目维护者

---

**最后更新**: 2026-03-18
**维护者**: AE Marketplace Team