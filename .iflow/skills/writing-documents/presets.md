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

### 3. 媒体内容（可选）

文档支持插入视频和图片来展示预设效果。

#### 3.1 视频插入方式

**方式 1：直接粘贴视频链接（推荐）**

```markdown
## 效果演示

https://www.youtube.com/watch?v=dQw4w9WgXcQ

https://www.bilibili.com/video/BV1xx411c7mD
```

**支持的格式：**
- ✅ YouTube 视频链接（自动识别并渲染为播放器）
- ✅ Bilibili 视频链接（自动识别并渲染为播放器）
- ✅ 直接视频文件（`.mp4`, `.webm`, `.ogg`, `.mov`, `.avi`）

**方式 2：使用 Markdown 链接语法**

```markdown
[观看演示视频](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
```

**方式 3：使用 HTML 标签**

```markdown
<video src="https://www.w3schools.com/html/mov_bbb.mp4" controls width="100%"></video>
```

#### 3.2 图片插入方式

**方式 1：使用标准 Markdown 语法（推荐）**

```markdown
![主要效果](./assets/main-effect.png)
![对比图](./assets/comparison.png)
```

**方式 2：使用 HTML img 标签**

```markdown
<img src="./assets/screenshot.png" alt="效果预览" width="100%" />
```

#### 3.3 媒体内容使用建议

- **视频**：优先使用 YouTube 或 Bilibili 链接展示预设动态效果
- **图片**：优先使用标准 Markdown 语法，图片会自动懒加载
- **对比展示**：可以并排使用多个图片或视频来对比不同参数效果

### 4. 使用场景（推荐）

列举 3-5 个典型应用场景。

### 5. 原理分析（可选）

简单说明预设如何工作。

### 6. 参数说明（推荐）

主要参数和调整建议。

### 7. 使用教程（推荐）

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

### 3. 媒体内容注意事项

- **视频大小**：建议单个视频不超过 10MB
- **懒加载**：图片会自动懒加载，优化性能
- **响应式**：所有媒体内容都会自动适应容器宽度

## 质量检查

- [ ] 顶部有下载链接（网络地址）
- [ ] 包含文件信息
- [ ] 包含效果预览
- [ ] 包含使用场景
- [ ] 图片使用相对路径 `./assets/`（如果存在）
- [ ] 相关文档链接不包含 `.md` 后缀
- [ ] 相关文档链接指向实际存在的文档
- [ ] 已更新 `presets/_manifest.json`
- [ ] 媒体链接使用合适的格式（视频链接/HTML 标签）
- [ ] 视频文件大小控制在合理范围内