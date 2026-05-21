---
name: writing
description: Use when creating documentation for AE scripts, plugins, expressions, presets, or extensions
---

# AE 文档生成规范

基于 Diátaxis 框架，AE 文档主要采用 **How-to Guide**（操作指南）和 **Reference**（参数参考）两种类型。

## 核心原则

1. **简洁**：用最少的话说清楚
2. **准确**：代码、参数、步骤必须正确
3. **用户导向**：围绕用户目标组织内容
4. **一致**：同类文档保持统一风格

## 文档结构

```markdown
---
title: {{标题}}
author: {{作者}}
tags: [{{标签}}]
description: {{一句话说明用途}}
updatedAt: {{日期}}
isFavorite: {{true/false}}
coverImage: {{封面图片路径}}
---

## 简介

2-3 句话说明：这是什么、解决什么问题、适用场景。

## 功能特性

- 特性 1：具体描述
- 特性 2：具体描述
- 特性 3：具体描述

## 使用方法

### 安装/导入

简要说明如何安装或导入到 AE。

### 基本使用

1. 步骤一（具体操作）
2. 步骤二（具体操作）
3. 步骤三（具体操作）

### 进阶用法（可选）

如有进阶功能，在此说明。

## 参数说明

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| 参数名 | 类型 | 默认值 | 描述作用 |

## 效果展示

截图、GIF 或视频链接（如有）。

## 常见问题（可选）

### Q: 问题描述？

A: 解答。

## 下载

[下载链接](url)

## 更新日志（可选）

- v1.0：初始版本
```

## 资源规范

### 图片资源

**存放位置：** `public/content/{{类型}}/assets/`

| 类型 | 目录 |
|------|------|
| 脚本 | `public/content/scripts/assets/` |
| 表达式 | `public/content/expressions/assets/` |
| 预设 | `public/content/presets/assets/` |
| 扩展 | `public/content/extensions/assets/` |

**引用方式：**

```markdown
<!-- 本地图片：相对路径 -->
![描述](./assets/filename.png)

<!-- 网络图片：HTTPS 地址 -->
![描述](https://example.com/image.png)

<!-- 封面图片：frontmatter 中指定 -->
coverImage: /content/scripts/assets/cover.png
```

### 下载链接

**必须是网络地址（HTTPS）：**

```markdown
<!-- ✅ 正确 -->
[下载](https://github.com/user/repo/releases/download/v1.0/file.zip)
[网盘下载](https://www.123865.com/s/xxx?pwd=xxx)

<!-- ❌ 错误 -->
[下载](./file.zip)
[下载](C:/Users/xxx/file.zip)
```

## Markdown 格式

### 标题层级

- `#` 仅用于文档标题
- `##` 用于主要章节
- `###` 用于子章节

### 列表

```markdown
<!-- 无序列表：用于特性、要点 -->
- 特性一
- 特性二

<!-- 有序列表：用于步骤 -->
1. 第一步
2. 第二步
```

### 表格

用于参数说明、对比、配置项：

```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 值1 | 值2 | 值3 |
```

### 代码块

```markdown
<!-- 行内代码：命令、变量名、文件名 -->
使用 `npm install` 安装

<!-- 代码块：多行代码 -->
​```javascript
const x = 1;
​```
```

### 引用块

用于提示、警告：

```markdown
> 💡 **提示**：这是提示信息

> ⚠️ **注意**：这是警告信息
```

## 写作要求

- **简介**：2-3 句话，不要废话
- **功能特性**：3-5 条，每条一句话说清楚
- **使用方法**：步骤具体可执行，不要"点击按钮"这种废话，要说"点击「导出」按钮"
- **参数说明**：表格形式，类型和默认值准确
- **常见问题**：只列真正常见的问题
- **图片**：本地用 `./assets/`，网络用 HTTPS
- **链接**：必须是网络地址

## 保存位置

- 脚本：`public/content/scripts/{{slug}}.md`
- 表达式：`public/content/expressions/{{slug}}.md`
- 预设：`public/content/presets/{{slug}}.md`
- 扩展：`public/content/extensions/{{slug}}.md`
