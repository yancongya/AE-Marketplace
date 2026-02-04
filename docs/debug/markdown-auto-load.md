# Markdown 文件自动加载与渲染问题排查

## 问题描述

在 `public/content` 目录下新增了 markdown 文件（如 `ae-script-guide.md`），但前端页面无法显示新添加的文章，只能看到原有的单个文件。

---

## Mermaid 图表渲染问题

### 问题现象

部分 Mermaid 图表（流程图、甘特图、饼图等）无法正常渲染，显示源代码或报错。

### 原因分析

1. **组件渲染顺序问题**
   - react-markdown 将 fenced code block 渲染为 `<pre><code class="language-mermaid">...</code></pre>`
   - 需要在 `pre` 组件中捕获子元素，检测 `className` 是否包含 `mermaid`

2. **Mermaid API 兼容性问题**
   - Mermaid 11 使用 `mermaid.render(id, code)` 返回 Promise
   - 需要确保组件挂载后才执行渲染
   - 需要处理组件卸载后的状态更新（防止内存泄漏）

3. **特殊字符转义问题**
   - markdown 中的特殊字符可能被 HTML 转义
   - 需要在渲染前对代码进行 trim 处理

### 解决方案

#### 1. 检测 Mermaid 代码块

```typescript
pre: ({ children }) => {
  const childrenArray = Array.isArray(children) ? children : [children];
  const codeChild = childrenArray.find((c: React.ReactElement) => 
    c?.type === 'code' || (c?.props?.children && typeof c.props.children === 'string')
  );
  const codeElement = codeChild?.props?.children;
  const className = codeChild?.props?.className || '';
  const isMermaid = className.includes('mermaid');
  
  if (isMermaid && typeof codeElement === 'string') {
    return <MermaidDiagram code={codeElement.trim()} />;
  }
  
  return <CodeBlock>{children}</CodeBlock>;
},
```

#### 2. 稳定的 Mermaid 渲染组件

```typescript
function MermaidDiagram({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [id] = useState(() => `mermaid-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    let isMounted = true; // 防止组件卸载后更新状态

    const renderDiagram = async () => {
      try {
        const trimmedCode = code.trim();
        if (!trimmedCode) return;
        
        const { svg: svgContent } = await mermaid.render(id, trimmedCode);
        if (isMounted) {
          setSvg(svgContent);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError('渲染失败: ' + (err instanceof Error ? err.message : String(err)));
        }
      }
    };

    renderDiagram();

    return () => { isMounted = false; };
  }, [code, id]);

  if (error) {
    return (
      <div className="mermaid-error">
        <pre className="text-red-400">{error}</pre>
        <pre className="text-muted-foreground">{code}</pre>
      </div>
    );
  }

  return (
    <div ref={containerRef}>
      {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : '加载中...'}
    </div>
  );
}
```

#### 3. 代码块复制功能

```typescript
function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  
  // ... 检测 Mermaid 代码 ...

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group">
      <button onClick={handleCopy} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre>{children}</pre>
    </div>
  );
}
```

---

## 目录 (TOC) 功能

### 元数据格式

目录数据作为 frontmatter 的一部分，通过 `toc` 字段定义：

```yaml
---
title: AE脚本开发完全指南
iconEmoji: 📚
author: 烟囱鸭
tags: [教程, 高级]
category: getting-started
description: 完整的AE脚本开发教程
updatedAt: 2026-02-05
toc:
  - id: 基础概念
    text: 基础概念
    level: 2
  - id: 流程图示例
    text: 流程图示例
    level: 2
  - id: 时序图示例
    text: 时序图示例
    level: 2
  - id: 代码示例
    text: 代码示例
    level: 2
---
```

### toc 字段结构

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 锚点ID，用于跳转定位 |
| `text` | string | 显示的标题文字 |
| `level` | number | 标题级别 (1=一级, 2=二级, 3=三级) |

### 目录组件特性

- **右侧固定显示** - 使用 `sticky` 定位，大屏幕时显示在右侧
- **点击跳转** - 点击目录项平滑滚动到对应标题
- **层级缩进** - 根据 `level` 自动缩进显示层级
- **自动隐藏** - 小屏幕自动隐藏，仅大屏幕显示

---

## 图表放大功能

Mermaid 图表支持点击放大查看：

```typescript
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button className="opacity-0 group-hover:opacity-100">
      <Expand className="w-4 h-4" />
    </button>
  </Dialog.Trigger>
  <Dialog.Content className="max-w-5xl max-h-[90vh]">
    {/* 放大后的图表 */}
  </Dialog.Content>
</Dialog.Root>
```

---

## 自动加载解决方案

### 1. 创建目录清单文件

在每个内容目录下创建 `_manifest.json` 文件：

```json
// public/content/scripts/_manifest.json
["shape-morpher.md", "ae-script-guide.md"]
```

### 2. 修改加载逻辑

```typescript
async function loadMarkdownFiles(basePath: string) {
  const manifestUrl = `${basePath}/_manifest.json`;
  const response = await fetch(manifestUrl);
  const files: string[] = await response.json();

  const results = [];
  for (const filename of files) {
    const res = await fetch(`${basePath}/${filename}`);
    if (res.ok) {
      const text = await res.text();
      const { frontmatter, content } = parseFrontmatter(text);
      results.push({ frontmatter, content, slug: filename.replace('.md', '') });
    }
  }
  return results;
}
```

### 3. 遍历加载所有文件

```typescript
scriptsFiles.forEach(({ frontmatter, content, slug }) => {
  data.scripts.push({
    slug,
    title: frontmatter.title || slug,
    toc: frontmatter.toc,  // 提取目录数据
    // ... 其他字段
  });
});
```

---

## 新增文件步骤

1. 在对应目录下创建 markdown 文件
2. 在 `_manifest.json` 中添加文件名
3. 定义 frontmatter 元数据（包括 toc）
4. 重启开发服务器

---

## 文件结构

```
public/content/
├── expressions/
│   ├── _manifest.json
│   └── auto-keyframe.md
├── scripts/
│   ├── _manifest.json
│   ├── shape-morpher.md
│   └── ae-script-guide.md
├── presets/
│   ├── _manifest.json
│   └── animation.md
└── extensions/
    ├── _manifest.json
    └── what-is-scripts.md
```

---

## 注意事项

### 通用
- `_manifest.json` 必须使用 JSON 格式，文件名数组
- markdown 文件名即为 slug，会用于路由（如 `/scripts/ae-script-guide`）
- frontmatter 中的 `title` 字段会覆盖文件名作为显示标题
- 更新 `content.ts` 后需要重启开发服务器

### Mermaid 图表
- Mermaid 代码必须使用正确的语法
- 部分复杂图表（如 gantt、pie）在 Mermaid 11 中可能有兼容性问题
- 渲染失败时会显示错误信息和原始代码，便于排查
- 确保每个图表有唯一的 ID（使用随机生成）
- 右上角有放大按钮，点击可全屏查看

### 代码块
- 代码块自动添加复制按钮
- 复制成功后会显示 ✓ 图标，2秒后恢复
- 支持所有语言的代码高亮（通过 highlight.js）
- 顶部显示语言标识

### 目录 (TOC)
- toc 必须在 frontmatter 中手动定义
- id 必须与正文中标题的 slugify 结果一致
- level 控制缩进层级（1=无缩进，2=左缩进，3=更左缩进）
- 仅在大屏幕（xl:）右侧显示

### 安装依赖

```bash
npm install react-markdown rehype-highlight remark-gfm mermaid
npm install @types/mermaid -D
```

### 当前支持的 MD 格式

| 类型 | 示例 |
|------|------|
| 标题 | `#`, `##`, `###` |
| 列表 | `- `, `1. ` |
| 代码块 | ````javascript<br>code<br>```` |
| Mermaid | ````mermaid<br>graph TD<br>A-->B<br>```` |
| 表格 | `\| col1 \| col2 \|` |
| 链接 | `[text](url)` |
| 引用 | `> quote` |
| 任务列表 | `- [ ] task` |
| 粗体/斜体 | `**bold**`, `*italic*` |
