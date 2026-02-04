# Markdown Frontmatter 解析问题排查文档

## 问题描述

在开发环境下，`TabContent` 组件无法正确显示 frontmatter 中的元数据（title、iconEmoji、author 等），导致卡片列表显示为 0。

## 根本原因

### 1. Frontmatter 解析逻辑错误

原代码中的 `parseFrontmatter` 函数存在逻辑缺陷：

```typescript
// 错误代码
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  if (trimmed === '---') {
    if (frontmatterEnd === -1) {
      frontmatterEnd = i;  // 问题：第0行的 "---" 被错误地设为结束符
    } else {
      contentStart = i + 1;
      break;
    }
  }
}
```

**问题分析**：
- YAML frontmatter 标准格式为：
  ```yaml
  ---
  title: xxx
  author: xxx
  ---
  ```
- 第一行 `---` 是**开始符**，第二行开始才是实际的 frontmatter 内容
- 原代码把第一行的 `---` 同时当作开始和结束，导致 frontmatter 解析失败

### 2. 错误的行匹配逻辑

日志显示的问题：
```
Line 0 is "---": true
Found frontmatter end at line: 0  // 错误：应该在第12行
Found content start at line: 11
```

## 解决方案

### 修正后的解析逻辑

```typescript
function parseFrontmatter(text: string): { frontmatter: Record<string, any>; content: string } {
  const lines = text.split(/\r?\n/);
  
  let openingDelim = -1;  // 开始符位置
  let closingDelim = -1;  // 结束符位置
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '---') {
      if (openingDelim === -1) {
        openingDelim = i;  // 第一次遇到 "---"，设为开始符
      } else if (closingDelim === -1) {
        closingDelim = i;  // 第二次遇到 "---"，设为结束符
        break;
      }
    }
  }

  // 使用正确的边界提取内容
  const frontmatterStr = lines.slice(openingDelim + 1, closingDelim).join('\n');
  const content = lines.slice(closingDelim + 1).join('\n');
}
```

### 关键修改点

1. **区分开始符和结束符**：
   - `openingDelim`: 第一个 `---` 的位置（第0行）
   - `closingDelim`: 第二个 `---` 的位置（第12行）

2. **正确提取内容**：
   - `frontmatter`: `lines[openingDelim + 1, closingDelim)` 即第1-11行
   - `content`: `lines[closingDelim + 1, end)` 即第13行之后

## 调试方法

### 1. 添加详细日志

```typescript
console.log('Lines count:', lines.length);
console.log('First 5 lines:', lines.slice(0, 5));
console.log('Line 0 is "---":', lines[0] === '---');

// 逐行检查
for (let i = 0; i < lines.length; i++) {
  const trimmed = lines[i].trim();
  console.log(`Line ${i}:`, JSON.stringify(trimmed));
}
```

### 2. 检查 fetch 返回内容

开发环境下 fetch 可能因路径或编码问题返回不完整内容：
```typescript
console.log('Raw text first 100 chars:', JSON.stringify(text.substring(0, 100)));
console.log('Total length:', text.length);
```

## 注意事项

### 1. Frontmatter 格式标准

YAML frontmatter 必须满足：
- 以 `---` 开始（第一行）
- 以 `---` 结束（单独一行）
- 中间为键值对：`key: value`

```yaml
---
title: Auto-Keyframe
iconEmoji: 🎯
author: motion-cafe
command: import auto_keyframe
description: xxx
---

# 这里是正文内容
```

### 2. 行尾符兼容

Windows 使用 `\r\n`，Linux/Mac 使用 `\n`，正则需兼容：
```typescript
const lines = text.split(/\r?\n/);  // 使用 \r? 兼容两种换行符
```

### 3. fetch 路径问题

生产环境路径前缀：
```typescript
const basePath = import.meta.env.DEV ? '' : '.';
```

### 4. 缓存机制

```typescript
let cachedContent: ContentData | null = null;
let loadingPromise: Promise<ContentData> | null = null;

export async function loadContent(): Promise<ContentData> {
  if (cachedContent) return cachedContent;
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = loadFromFetch().then(data => {
    cachedContent = data;
    return data;
  });
  
  return loadingPromise;
}
```

## 相关文件

- `src/lib/content.ts` - Frontmatter 解析核心逻辑
- `public/content/` - Markdown 文件目录
- `src/components/ExpressionsTab.tsx` - 使用示例
- `src/components/TabContent.tsx` - 详情展示组件

## 调试建议

1. **优先检查 fetch 返回**：确保文件可访问，内容完整
2. **逐行打印日志**：快速定位行匹配问题
3. **验证 JSON 输出**：确认解析后的数据结构正确
4. **测试边界情况**：空文件、只有 frontmatter、没有 frontmatter 等情况
