# 脚本文档编写

## 核心要素

### 1. 下载链接（必须）

使用网络地址，包含文件信息。

```markdown
🔗 [下载脚本](https://github.com/.../script.jsx)

**文件信息：**
- 文件大小：1.2 MB
- 版本：v1.0.0
- 兼容性：AE CC 2019+
```

### 2. 使用场景（推荐）

列举 3-5 个典型应用场景。

### 3. 功能特性（推荐）

列出主要功能和快捷键。

### 4. 原理分析（可选）

解释脚本架构和关键函数。

### 5. 使用教程（推荐）

安装、运行、配置步骤。

### 6. 常见问题（可选）

FAQ 部分。

## 示例文档

参考：`examples/script-example.md` 或 `public/content/scripts/script-complete-guide.md`

## 重要注意事项

### 1. 相关文档链接

**格式：** 不包含 `.md` 后缀
```markdown
✅ [形状变换](./shape-morpher)
✅ [脚本指南](./ae-script-guide)
❌ [形状变换](./shape-morpher.md)  # 会导致路由错误
```

**只引用实际存在的文档：**
- 检查 `public/content/scripts/_manifest.json` 获取可用文档列表
- 当前可用：`shape-morpher.md`, `ae-script-guide.md`, `script-complete-guide.md`

### 2. 图片引用

**只引用实际存在的图片：**
```markdown
✅ ![界面](./assets/main-ui.png)  # 图片文件存在
❌ ![演示](./assets/demo.gif)     # 文件不存在，不要添加
```

**如果没有实际图片：**
- 使用文字描述代替
- 或等待实际图片生成后再添加

## 质量检查

- [ ] 顶部有下载链接（网络地址）
- [ ] 包含文件信息
- [ ] 包含使用场景
- [ ] 包含功能特性
- [ ] 图片使用相对路径 `./assets/`（如果存在）
- [ ] 相关文档链接不包含 `.md` 后缀
- [ ] 相关文档链接指向实际存在的文档
- [ ] 已更新 `scripts/_manifest.json`