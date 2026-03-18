# 预设文档编写

## 核心要素

### 1. 下载链接（必须）

使用网络地址，包含文件信息。

```markdown
🔗 [下载预设](https://github.com/.../preset.ffx)

**文件信息：**
- 文件大小：150 KB
- 版本：v1.0.0
- 兼容性：AE CC 2018+
```

### 2. 效果预览（推荐）

展示预设的实际效果。

```markdown
![主要效果](./assets/main-effect.png)
```

### 3. 使用场景（推荐）

列举 3-5 个典型应用场景。

### 4. 原理分析（可选）

简单说明预设如何工作。

### 5. 参数说明（推荐）

主要参数和调整建议。

### 6. 使用教程（推荐）

安装、应用、调整步骤。

## 示例文档

参考：`examples/preset-example.md` 或 `public/content/presets/animation.md`

## 重要注意事项

### 1. 相关文档链接

**格式：** 不包含 `.md` 后缀
```markdown
✅ [动画预设](./animation)
✅ [高级预设](./advanced-presets)
❌ [动画预设](./animation.md)  # 会导致路由错误
```

**只引用实际存在的文档：**
- 检查 `public/content/presets/_manifest.json` 获取可用文档列表
- 当前可用：`animation.md`, `advanced-presets.md`

### 2. 图片引用

**只引用实际存在的图片：**
```markdown
✅ ![效果](./assets/preview.png)  # 图片文件存在
❌ ![演示](./assets/demo.gif)     # 文件不存在，不要添加
```

**如果没有实际图片：**
- 使用文字描述代替
- 或等待实际图片生成后再添加

## 质量检查

- [ ] 顶部有下载链接（网络地址）
- [ ] 包含文件信息
- [ ] 包含效果预览
- [ ] 包含使用场景
- [ ] 图片使用相对路径 `./assets/`（如果存在）
- [ ] 相关文档链接不包含 `.md` 后缀
- [ ] 相关文档链接指向实际存在的文档
- [ ] 已更新 `presets/_manifest.json`