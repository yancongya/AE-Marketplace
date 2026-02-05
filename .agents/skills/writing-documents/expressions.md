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

## 质量检查

- [ ] 顶部有可复制代码块
- [ ] 包含使用场景
- [ ] 包含原理分析
- [ ] 图片使用相对路径 `./assets/`
- [ ] 已更新 `expressions/_manifest.json`