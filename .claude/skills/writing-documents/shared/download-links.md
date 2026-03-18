# 下载链接规范

## 核心规则

### 格式

**必须使用网络地址：**

```markdown
🔗 [下载文件](https://example.com/file.ext)
```

### 推荐格式

**GitHub Releases：**

```markdown
🔗 [下载脚本](https://github.com/用户名/仓库/releases/download/v1.0.0/file.jsx)
```

**默认参考地址（用户替换）：**

```markdown
🔗 [下载脚本](https://github.com/yancongya/AE----/releases/download/v1.0.0/script-name.jsx)
🔗 [下载预设](https://github.com/yancongya/AE----/releases/download/v1.0.0/preset-name.ffx)
🔗 [下载扩展](https://github.com/yancongya/AE----/releases/download/v1.0.0/extension-name.zip)
```

### 文件信息（可选）

```markdown
🔗 [下载脚本](https://example.com/script.jsx)

**文件信息：**
- 文件大小：1.2 MB
- 版本：v1.0.0
- 兼容性：AE CC 2019+
```

## 常见错误

| 错误 | 修正 |
|------|------|
| 使用本地路径 | 使用网络地址 |
| 链接无法访问 | 检查 URL 和文件位置 |
| 版本不匹配 | 更新为正确的版本号 |