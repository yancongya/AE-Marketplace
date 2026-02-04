# TabContent 目录滚动高亮功能问题排查

## 问题描述

在文档页面中实现目录（TOC）功能时，遇到了多个技术问题，本文记录了问题原因和解决方案。

---

## 问题一：点击目录无法定位

### 症状
点击目录项无法滚动到对应标题位置。

### 原因分析
1. **中文标题 slugify 失败** - 原有 `slugify` 函数移除了中文字符，导致中文标题生成的 ID 为空
2. **组件嵌套问题** - ReactMarkdown 渲染的标题没有正确添加 ID

### 解决方案

```typescript
// 修复 slugify 函数，保留中文字符
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '');  // 保留中文
}
```

---

## 问题二：滚动时高亮不准确

### 症状
滚动页面时目录高亮状态不正确，经常跳变或不动。

### 原因分析
1. **每个目录项使用独立的 useInView** - 每个按钮都在观察自己，而非观察文章中的实际标题
2. **IntersectionObserver 配置不当** - `rootMargin` 设置不合理

### 解决方案
使用单个 Observer 观察文章中的真实标题元素：

```typescript
useEffect(() => {
  const callback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveId(entry.target.id);
      }
    });
  };

  const observer = new IntersectionObserver(callback, {
    rootMargin: '-100px 0px -70% 0px',
    threshold: 0
  });

  headings.forEach((heading) => {
    const element = document.getElementById(heading.id);
    if (element) {
      observer.observe(element);
    }
  });

  return () => observer.disconnect();
}, [headings]);
```

---

## 问题三：主题切换后滚动高亮失效

### 症状
在明暗模式之间切换后，滚动时目录不再自动高亮。

### 原因分析
主题切换会导致组件重新渲染，`IntersectionObserver` 被销毁后没有正确重建。

### 解决方案
改用 `scroll` 事件监听器替代 `IntersectionObserver`，基于位置计算当前标题：

```typescript
useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 120;

    for (let i = headings.length - 1; i >= 0; i--) {
      const heading = headings[i];
      const element = document.getElementById(heading.id);
      if (element) {
        const elementTop = element.offsetTop;
        if (scrollPosition >= elementTop) {
          setActiveId(heading.id);
          break;
        }
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, [headings]);
```

### 为什么 scroll 事件更稳定
- 不依赖 Observer 的生命周期
- 基于绝对位置计算，不受 DOM 变化影响
- 主题切换不会影响 offsetTop 属性

---

## 问题四：目录面板与内容面板不对齐

### 症状
目录面板的顶部位置与左侧内容面板不一致。

### 解决方案
调整 sticky 定位的 `top` 值：

```typescript
// 改为与左侧面板相同的顶部间距
<div className="sticky top-6 ...">
```

---

## 问题五：亮色模式下无法滚动定位

### 症状
在亮色模式下，滚动时目录高亮不更新。

### 解决方案
1. 调整 `rootMargin` 值
2. 添加初始化逻辑确保有 activeId

```typescript
useEffect(() => {
  if (headings.length > 0 && !activeId) {
    setActiveId(headings[0].id);
  }
}, [headings, activeId]);
```

---

## 最终实现方案

### 目录组件结构

```
┌─────────────────────────────────────────┐
│  TabContent                             │
│  ┌─────────────────────────────────┐    │
│  │ 文章内容区域                      │    │
│  │ - HeroSection                   │    │
│  │ - Meta 信息 (作者/日期/标签)      │    │
│  │ - Markdown 内容 (h1/h2/h3 标题)  │    │
│  └─────────────────────────────────┘    │
│  ┌─────────────────┐ ┌───────────────┐  │
│  │ 右侧目录面板     │ │ 移动端按钮    │  │
│  │ - Sticky 定位   │ │ - Dialog 弹窗 │  │
│  │ - 滚动高亮      │ │ - 简化列表    │  │
│  └─────────────────┘ └───────────────┘  │
└─────────────────────────────────────────┘
```

### 核心功能

1. **自动提取标题** - 从 Markdown 内容中解析 `#`, `##`, `###` 标题
2. **点击定位** - 使用 `scrollTo` API 平滑滚动，带 100px 偏移
3. **滚动高亮** - 基于 scroll 事件监听，计算当前可见标题
4. **响应式** - 大屏幕右侧固定，小屏幕浮动按钮
5. **状态样式** - 当前激活项粗体，其他项降低透明度

---

## 关键代码

### 提取标题

```typescript
function extractHeadings(content: string): Heading[] {
  const lines = content.split('\n');
  const headings: Heading[] = [];
  let counter = 0;

  lines.forEach((line) => {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugify(text) || `heading-${counter++}`;
      headings.push({ id, text, level });
    }
  });

  return headings;
}
```

### 滚动高亮

```typescript
const handleScroll = () => {
  const scrollPosition = window.scrollY + 120;

  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i];
    const element = document.getElementById(heading.id);
    if (element) {
      const elementTop = element.offsetTop;
      if (scrollPosition >= elementTop) {
        setActiveId(heading.id);
        break;
      }
    }
  }
};
```

### 点击定位

```typescript
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const headerOffset = 100;
    const offsetPosition = element.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    setActiveId(id);
  }
};
```

---

## 依赖安装

```bash
npm install react-intersection-observer
```

（后续改用 scroll 事件后不再需要此依赖）

---

## 注意事项

1. **中文标题** - 必须确保 slugify 保留中文字符
2. **主题切换** - scroll 事件比 IntersectionObserver 更稳定
3. **初始化** - 确保有默认的 activeId 避免空白高亮
4. **防抖** - scroll 事件需要防抖处理避免性能问题
5. **偏移量** - 100px 偏移量确保标题不被导航栏遮挡

---

## 相关文件

- `src/components/TabContent.tsx` - 主组件
- `src/lib/content.ts` - 数据接口定义
- `public/content/scripts/ae-script-guide.md` - 测试文档
