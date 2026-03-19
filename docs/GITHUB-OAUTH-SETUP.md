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

### 问题 7：删除功能返回 404 错误

**症状**：
- 右键点击卡片上的红点（删除按钮）
- 确认删除后，控制台显示：`DELETE https://aemarketplace.vercel.app/api/admin/delete 404 (Not Found)`
- 删除操作失败

**原因**：
Vercel Serverless Functions 需要明确设置 CORS 头才能让前端正常调用。所有 API 文件都缺少 CORS 头设置。

**解决方案**：
在所有 Vercel API 文件中添加 CORS 头支持：

```typescript
// api/admin/delete.ts, create.ts, update.ts, rename.ts, github-callback.ts
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,OPTIONS'); // 根据实际方法调整
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 原有的 API 逻辑...
}
```

**需要修改的文件**：
1. `api/admin/delete.ts` - DELETE 方法
2. `api/admin/create.ts` - POST 方法
3. `api/admin/update.ts` - PUT 方法
4. `api/admin/rename.ts` - POST 方法
5. `api/github-callback.ts` - POST 方法

**验证方法**：
1. 右键点击卡片上的红点
2. 点击"确认删除"
3. 应该显示"删除成功"提示，并刷新页面

### 问题 8：删除后提示"文件已不存在"

**症状**：
- 第一次删除成功
- 页面刷新后，已删除的文件仍然显示
- 再次点击删除，提示"文件已不存在，请稍后刷新页面"

**原因**：
前端使用了缓存机制，即使删除成功并刷新页面，数据可能还是从缓存中读取。删除 API 虽然更新了 manifest，但前端缓存未清除。

**解决方案**：

1. **添加缓存清除功能**：
```typescript
// src/lib/content.ts
export function clearContentCache(): void {
  cachedContent = null;
  loadingPromise = null;
}
```

2. **在删除成功后清除缓存**：
```typescript
// src/components/TabCard.tsx
import { clearContentCache } from '@/lib/content';

const handleDelete = async () => {
  // ... 删除逻辑 ...

  if (result.success) {
    toast.success('删除成功');
    setIsDeleteDialogOpen(false);
    // 清除缓存
    clearContentCache();
    // 刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
};
```

**验证方法**：
1. 删除文件后应该立即刷新列表
2. 不会看到"文件已不存在"的提示

### 问题 9：新创建的文档不显示

**症状**：
- 新建文档并提交成功
- 刷新页面后看不到新创建的文档

**原因**：
1. manifest 文件未正确更新
2. API 更新 manifest 时没有提供 SHA 值
3. 前端缓存未清除

**解决方案**：

1. **修复 API 的 manifest 更新逻辑**：
```typescript
// api/admin/create.ts
// 获取现有的 manifest
let manifestSha: string | undefined = undefined;
try {
  const { data: manifestData } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: manifestPath,
  });
  manifest = JSON.parse(manifestContent);
  manifestSha = (manifestData as any).sha; // ← 关键：获取 SHA 值
} catch (error: any) {
  if (error.status !== 404) throw error;
}

// 提交更新的 manifest
if (manifestSha) {
  // 文件已存在，需要提供 SHA
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: manifestPath,
    content: Buffer.from(JSON.stringify(manifest, null, 2)).toString('base64'),
    sha: manifestSha, // ← 必须提供 SHA
  });
} else {
  // 文件不存在，创建新文件
  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: manifestPath,
    content: Buffer.from(JSON.stringify(manifest, null, 2)).toString('base64'),
  });
}
```

2. **需要修复的 API 文件**：
   - `api/admin/create.ts` - 创建文件时更新 manifest
   - `api/admin/update.ts` - 更新文件时（如果需要）
   - `api/admin/delete.ts` - 删除文件时更新 manifest
   - `api/admin/rename.ts` - 重命名文件时更新 manifest

**验证方法**：
1. 创建新文档
2. 刷新页面
3. 新文档应该立即显示

### 问题 10：Repository 名称配置错误

**症状**：
- 登录成功
- 权限检查失败
- 控制台显示：`Repository not found` 或 `权限诊断失败`

**原因**：
代码中配置的仓库名称与实际仓库名称不匹配。

**历史问题**：
- 原仓库名称：`AE----`（错误的名称）
- 实际仓库名称：`AE-Marketplace`（正确的名称）

**解决方案**：
检查并更新以下文件中的仓库名称：

```typescript
// src/contexts/AdminContext.tsx
const GITHUB_REPO_OWNER = 'yancongya';
const GITHUB_REPO_NAME = 'AE-Marketplace'; // ← 确保名称正确
```

**验证方法**：
1. 登录 GitHub
2. 控制台应显示：`✅ User has admin access`
3. 导航栏显示 🔒 锁图标

### 问题 11：权限检查逻辑错误

**症状**：
- 明明有仓库权限，但权限检查失败
- 控制台显示：`❌ User does not have admin access`

**原因**：
代码检查了 GitHub API 不存在的权限类型（如 `write`）。

**正确的 GitHub API 权限**：
GitHub API 的仓库权限只包括：
- `admin` - 完全控制
- `push` - 可推送
- `pull` - 可拉取
- `triage` - 可管理问题和 PR
- `maintain` - 可维护

**不存在**：
- `write` - ❌ 不存在
- `read` - ❌ 不存在

**解决方案**：
修改权限检查逻辑：

```typescript
// src/contexts/AdminContext.tsx
const permissions = repoData.permissions;
const hasAdminAccess = permissions.admin || permissions.push; // ← 只检查存在的权限
```

**验证方法**：
1. 登录 GitHub
2. 控制台应显示：`Permission diagnosis result: {..., permissions: {admin: true, ...}, ...}`
3. 权限检查通过，进入管理员模式

### 问题 12：Vercel 环境变量命名限制

**症状**：
- 在 Vercel 中设置环境变量时出错
- 错误信息：`Only lowercase letters, digits, dashes, and underscores are allowed`

**原因**：
Vercel 环境变量名称只允许：
- 小写字母（a-z）
- 数字（0-9）
- 连字符（-）
- 下划线（_）

**不允许**：
- 大写字母
- 特殊字符

**解决方案**：
使用小写的环境变量名称：

```typescript
// ❌ 错误（包含大写字母）
VITE_GITHUB_CLIENT_SECRET

// ✅ 正确（全部小写）
github_client_secret
```

**前端代码适配**：
```typescript
// src/lib/github-auth.ts
// 从环境变量获取 client_secret（支持两种格式）
const client_secret = process.env.GITHUB_CLIENT_SECRET || process.env.VITE_GITHUB_CLIENT_SECRET;
```

**验证方法**：
1. 在 Vercel 中设置环境变量
2. 名称全部使用小写
3. 成功保存

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

## 最近更新记录

### 2026-03-19

**新增问题和解决方案**：

1. **问题 7：删除功能返回 404 错误**
   - 添加 CORS 头支持到所有 Vercel API
   - 支持预检请求（OPTIONS）
   - 提交：b787974

2. **问题 8：删除后提示"文件已不存在"**
   - 添加缓存清除功能 `clearContentCache()`
   - 删除成功后自动清除缓存
   - 提交：359c8d4

3. **问题 9：新创建的文档不显示**
   - 修复所有 API 的 manifest 更新逻辑
   - 正确处理 SHA 值
   - 提交：862e343, 467a14f

4. **问题 10：Repository 名称配置错误**
   - 从 `AE----` 改为 `AE-Marketplace`
   - 更新所有配置文件

5. **问题 11：权限检查逻辑错误**
   - 修正 GitHub API 权限检查
   - 只检查 `admin` 和 `push` 权限

6. **问题 12：Vercel 环境变量命名限制**
   - 环境变量名称必须全部小写
   - 适配前端代码支持两种格式

**功能改进**：

- 右键删除功能（TabCard 红点）
- 删除确认对话框
- 删除成功后自动刷新
- 错误处理优化

**已提交记录**：
- `a223f2f` - fix: 添加新创建的文档到 manifest
- `467a14f` - fix: 修复所有 API 的 manifest 更新逻辑，正确处理 SHA 值
- `862e343` - fix: 清理 manifest 中的无效文件，修复 SHA 值处理
- `359c8d4` - fix: 改进删除功能，添加缓存清除机制
- `659a3d6` - fix: 改进删除错误处理，文件不存在时也视为删除成功
- `b787974` - fix: 为所有 Vercel API 添加 CORS 头支持

---

**最后更新**: 2026-03-19
**维护者**: AE Marketplace Team