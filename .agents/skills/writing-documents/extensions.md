# 扩展文档编写

## 核心要素

### 1. 下载链接（必须）

使用网络地址，包含文件信息。

```markdown
🔗 [下载扩展](https://github.com/.../extension.zip)

**文件信息：**
- 文件大小：2.5 MB
- 版本：v1.0.0
- 兼容性：AE CC 2020+
```

### 2. 效果预览（推荐）

展示扩展界面和功能。

```markdown
![主界面](./assets/main-ui.png)
```

### 3. 使用场景（推荐）

列举 3-5 个典型应用场景。

### 4. 系统要求（推荐）

操作系统、After Effects 版本、内存等。

### 5. 安装教程（推荐）

自动安装和手动安装方法。

### 6. 使用教程（推荐）

打开、基本使用、高级功能步骤。

## 示例文档

参考：`examples/extension-example.md` 或 `public/content/extensions/extension-dev-guide.md`

## 质量检查

- [ ] 顶部有下载链接（网络地址）
- [ ] 包含文件信息
- [ ] 包含效果预览
- [ ] 包含系统要求
- [ ] 图片使用相对路径 `./assets/`
- [ ] 已更新 `extensions/_manifest.json`