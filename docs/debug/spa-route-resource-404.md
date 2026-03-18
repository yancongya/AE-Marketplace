# SPA 路由下静态资源 404 错误排查文档

## 问题描述

在访问子路由页面（如 `/scripts/`、`/expressions/` 等）时，浏览器控制台报错：

```
GET http://localhost:4173/scripts/assets/index-jZABbbTM.js net::ERR_ABORTED 404 (Not Found)
```

页面无法正常加载，显示空白或错误信息。

## 环境信息

- **框架**: React 18 + React Router
- **构建工具**: Vite 5
- **部署方式**: 生产环境构建 + 预览服务器
- **应用类型**: SPA (单页应用)

## 根本原因

### 1. Vite 配置使用相对路径

原配置：
```typescript
// vite.config.ts
export default defineConfig({
  base: './',  // ❌ 相对路径
  // ...
});
```

### 2. 相对路径解析机制

当 `base` 设置为相对路径 `'./'` 时，生成的 HTML 中的资源引用也是相对的：

```html
<!-- 构建后的 dist/index.html -->
<script type="module" crossorigin src="./assets/index-jZABbbTM.js"></script>
```

浏览器解析相对路径时，会基于当前 URL 的路径：

| 访问路径 | 实际请求的资源路径 |
|---------|------------------|
| `/` | `/assets/index-jZABbbTM.js` ✅ |
| `/scripts/` | `/scripts/assets/index-jZABbbTM.js` ❌ |
| `/expressions/` | `/expressions/assets/index-jZABbbTM.js` ❌ |

### 3. SPA 路由特性

- SPA 使用前端路由，所有路由都指向同一个 `index.html`
- 资源文件实际只存在于 `/assets/` 目录
- 相对路径会导致浏览器从错误的路径加载资源

## 解决方案

### 修改 Vite 配置为绝对路径

```typescript
// vite.config.ts
export default defineConfig({
  base: '/',  // ✅ 绝对路径
  // ...
});
```

### 重新构建项目

```bash
npm run build
```

### 验证修复

构建后的 HTML 资源引用变为绝对路径：

```html
<!-- 构建后的 dist/index.html -->
<script type="module" crossorigin src="/assets/index-jZABbbTM.js"></script>
```

无论访问哪个路由，都会从根路径加载资源。

## 为什么选择绝对路径

### 优点

1. **路由无关性** - 所有路由都从根路径加载资源
2. **避免路径解析错误** - 浏览器不会基于当前 URL 解析相对路径
3. **兼容性更好** - 适用于所有部署环境（子目录部署除外）

### 注意事项

- 如果应用部署在子目录（如 `example.com/app/`），需要调整 `base` 为 `'/app/'`
- 对于静态站点托管（GitHub Pages、Vercel 等），绝对路径是最佳实践

## 替代方案（不推荐）

### 使用 history API fallback

某些服务器支持 SPA fallback，将所有路由都重定向到 `index.html`，但这对静态资源加载问题无效。

### 在每个页面添加 base 标签

```html
<base href="/">
```

但这与 Vite 的 `base` 配置重复，不推荐。

## 调试方法

### 1. 检查生成的 HTML

```bash
cat dist/index.html
```

查看资源引用是相对路径还是绝对路径。

### 2. 检查网络请求

打开浏览器开发者工具 → Network 标签，查看资源请求的完整路径。

### 3. 测试不同路由

依次访问以下路由，确认都能正常加载：
- `/`
- `/scripts/`
- `/scripts/shape-morpher`
- `/expressions/`
- `/presets/`
- `/extensions/`

## 预防措施

### 1. 在项目初期就配置正确的 base

```typescript
// 根据部署环境配置
const base = import.meta.env.DEV ? '/' : '/your-subdirectory/';
```

### 2. 在文档中记录 base 配置

在项目 README 或开发文档中明确说明：
- 开发环境的 base 配置
- 生产环境的 base 配置
- 如何处理子目录部署

### 3. 添加构建验证脚本

```bash
# 检查构建产物中的资源路径
grep -o 'src="[^"]*"' dist/index.html | head -5
```

## 相关配置

### 开发环境

```typescript
// vite.config.ts
export default defineConfig({
  base: '/',
  server: {
    port: 4173,
  },
});
```

### 生产环境

```typescript
// vite.config.ts
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
});
```

### Vercel 配置

```json
// vercel.json
{
  "rewrites": [
    { "source": "/:path*", "destination": "/index.html" }
  ]
}
```

## 常见问题

### Q: 为什么开发环境没有这个问题？

A: 开发环境的 HMR（热模块替换）会自动处理资源路径，而生产环境构建是静态的，依赖 `base` 配置。

### Q: 可以使用相对路径吗？

A: 可以，但只适用于部署在根目录的单页面应用，且不推荐。绝对路径更稳定。

### Q: 如何在子目录部署？

A: 设置 `base: '/your-subdirectory/'` 并确保服务器正确配置。

### Q: 修复后需要重新部署吗？

A: 是的，需要重新构建和部署。

## 相关文件

- `vite.config.ts` - Vite 配置文件
- `dist/index.html` - 构建后的入口文件
- `vercel.json` - Vercel 部署配置

## 参考资料

- [Vite Base Configuration](https://vitejs.dev/config/shared-options.html#base)
- [React Router FAQ](https://reactrouter.com/en/main/start/faq#what-do-i-need-to-do-to-add-react-router-to-my-site)
- [SPA Deployment Best Practices](https://web.dev/articles/modern-starter#spa_routing)

---

**修复日期**: 2026-03-18  
**修复版本**: 1.0.1  
**影响范围**: 所有 SPA 路由页面