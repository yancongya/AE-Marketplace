# 表达式文档编写

## 核心要素

### 1. 可复制代码块（必须）

放在文章顶部，添加 `// 点击复制` 注释。

```javascript
// 点击复制
expression_code_here
```

### 2. 使用场景（推荐）

列举 3-5 个典型应用场景。

### 3. 原理分析（推荐）

解释表达式的工作机制和关键参数。

### 4. 媒体内容（可选）

文档支持插入视频、网页和图片来展示表达式效果。

#### 4.1 视频插入方式

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

#### 4.2 图片插入方式

**方式 1：使用标准 Markdown 语法（推荐）**

```markdown
![表达式效果](./assets/preview.png)
![对比图](./assets/comparison.png)
```

**方式 2：使用 HTML img 标签**

```markdown
<img src="./assets/screenshot.png" alt="效果预览" width="100%" />
```

#### 4.3 媒体内容使用建议

- **视频**：优先使用 YouTube 或 Bilibili 链接展示表达式效果
- **图片**：优先使用标准 Markdown 语法，图片会自动懒加载
- **对比展示**：可以并排使用多个图片或视频来对比不同效果

### 5. 示例（可选）

提供使用示例和效果展示。

## 示例文档

参考：`examples/expression-example.md` 或 `public/content/expressions/auto-keyframe.md`

## 重要注意事项

### 1. 相关文档链接

**格式：** 不包含 `.md` 后缀
```markdown
✅ [自动关键帧](./auto-keyframe)
✅ [高级指南](./advanced-guide)
❌ [自动关键帧](./auto-keyframe.md)  # 会导致路由错误
```

**只引用实际存在的文档：**
- 检查 `public/content/expressions/_manifest.json` 获取可用文档列表
- 当前可用：`auto-keyframe.md`, `advanced-guide.md`, `looping-wiggle.md`

### 2. 图片引用

**只引用实际存在的图片：**
```markdown
✅ ![效果](./assets/preview.png)  # 图片文件存在
❌ ![效果](./assets/demo.gif)     # 文件不存在，不要添加
```

**如果没有实际图片：**
- 使用文字描述代替
- 或等待实际图片生成后再添加

### 3. 媒体内容注意事项

- **视频大小**：建议单个视频不超过 10MB
- **懒加载**：图片会自动懒加载，优化性能
- **响应式**：所有媒体内容都会自动适应容器宽度

## 质量检查

- [ ] 顶部有可复制代码块
- [ ] 包含使用场景
- [ ] 包含原理分析
- [ ] 图片使用相对路径 `./assets/`（如果存在）
- [ ] 相关文档链接不包含 `.md` 后缀
- [ ] 相关文档链接指向实际存在的文档
- [ ] 已更新 `expressions/_manifest.json`
- [ ] 媒体链接使用合适的格式（视频链接/HTML 标签）