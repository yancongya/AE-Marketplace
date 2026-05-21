---
name: writing
description: Use when creating documentation for AE scripts, plugins, expressions, presets, or extensions
---

# AE 文档生成规范

基于 Diátaxis 框架，AE 文档主要采用 **How-to Guide**（操作指南）和 **Reference**（参数参考）两种类型。

## 工作流程

用户提供项目后，按以下流程生成文档：

```
1. 读取项目 README.md（主要信息来源）
2. 如需要，读取其他相关文档（docs/、更新日志.md 等）
3. 扫描 assets/public 等目录，识别图片素材
4. 复制图片到文档对应的 assets/{{slug}}/ 目录
5. 根据分析结果生成文档
6. 引用图片素材
```

## 信息来源

### 主要来源

- `README.md` - 项目说明、功能特性、使用方法

### 辅助来源

- `更新日志.md` / `CHANGELOG.md` - 版本历史
- `docs/` - 详细文档
- `LICENSE` - 许可证信息

### 图片素材

扫描以下目录，复制到文档对应的 assets 目录：

| 源目录 | 说明 |
|--------|------|
| `assets/` | 素材目录 |
| `public/` | 公共资源 |
| `images/` | 图片目录 |
| `screenshots/` | 截图目录 |
| `logo/` | Logo 目录 |

**复制目标：** `public/content/{{类型}}/assets/{{slug}}/`

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

🌐 [产品官网](url) | 📦 [GitHub](url)

## 功能特性

- 特性 1：具体描述
- 特性 2：具体描述
- 特性 3：具体描述

## 使用方法

### 安装/导入

简要说明如何安装或导入到 AE。

**安装方法规范：**

- kkbar 安装：在 kkbar 中**调用**脚本（不是搜索）
- 手动安装：复制到脚本目录，重启软件

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

## 支持作者（可选）

如果这个脚本对你有帮助，欢迎请作者喝杯咖啡 ☕️

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="./assets/{{slug}}/微信.jpg" width="200" alt="微信收款码"><br>
        <b>微信</b>
      </td>
      <td align="center">
        <img src="./assets/{{slug}}/支付宝.jpg" width="200" alt="支付宝收款码"><br>
        <b>支付宝</b>
      </td>
    </tr>
  </table>
</div>
```

## 资源规范

### 图片资源

**存放位置：** `public/content/{{类型}}/assets/{{slug}}/`

| 类型 | 目录示例 |
|------|----------|
| 脚本 | `public/content/scripts/assets/auto-tinify/` |
| 表达式 | `public/content/expressions/assets/expression-name/` |
| 预设 | `public/content/presets/assets/preset-name/` |
| 扩展 | `public/content/extensions/assets/extension-name/` |

**整理原则：**

- 每个文档的图片存放在独立的子目录中
- 目录名称与文档 slug 保持一致
- 避免将图片直接放在 assets 根目录下

**引用方式：**

```markdown
<!-- 本地图片：相对路径（统一宽度 600px） -->
<img src="./assets/{{slug}}/filename.png" width="600" alt="描述">

<!-- 网络图片：HTTPS 地址 -->
<img src="https://example.com/image.png" width="600" alt="描述">

<!-- 封面图片：frontmatter 中指定 -->
coverImage: /content/scripts/assets/{{slug}}/cover.png
```

**图片宽度规范：**

| 图片类型 | 宽度 |
|----------|------|
| 界面截图 | 600px |
| GIF 动图 | 600px |
| 收款码 | 200px |
| 封面图 | 自适应 |

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
