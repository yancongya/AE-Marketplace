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

### 4. 示例（可选）

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

## 质量检查

- [ ] 顶部有可复制代码块
- [ ] 包含使用场景
- [ ] 包含原理分析
- [ ] 图片使用相对路径 `./assets/`（如果存在）
- [ ] 相关文档链接不包含 `.md` 后缀
- [ ] 相关文档链接指向实际存在的文档
- [ ] 已更新 `expressions/_manifest.json`