---
name: generate-documents
description: Generate AE scripts documentation from GitHub repositories, web pages, or existing content with automatic resource crawling
---

# 文档生成技能（增强版）

## 触发条件

当用户需要从外部来源生成文档时使用此技能：
- 从 GitHub 仓库生成文档
- 从网页链接生成文档
- 从项目文件夹扫描生成文档
- 从现有文档转换

---

## 工作流程

```
输入类型选择 → 内容爬取 → 图片资源下载 → 智能整理 → 生成草稿 → 质量检查 → 保存文档
```

---

## 第 1 步：选择输入类型

**系统询问**："你要从什么类型的内容生成文档？"

```typescript
ask_user_question({
  questions: [{
    question: "选择输入类型",
    header: "输入类型",
    options: [
      {
        label: "GitHub 仓库",
        description: "从 GitHub 仓库自动爬取 README、图片、release 等"
      },
      {
        label: "网页链接",
        description: "从网页抓取内容生成文档"
      },
      {
        label: "项目文件夹",
        description: "扫描本地项目结构生成文档"
      },
      {
        label: "本地文档",
        description: "合并或转换现有文档"
      }
    ],
    multiSelect: false
  }]
})
```

---

## 第 2 步：内容爬取

### 类型 A：GitHub 仓库（重点功能）

**系统询问**："请输入 GitHub 仓库地址"

```typescript
ask_user_question({
  questions: [{
    question: "请输入 GitHub 仓库地址（如 https://github.com/yancongya/auto_tinify）",
    header: "GitHub 地址",
    multiSelect: false
  }]
})
```

**系统执行 - 爬取策略：**

#### 1. 提取仓库信息
```typescript
// 从 URL 提取 owner 和 repo
const url = "https://github.com/yancongya/auto_tinify";
const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
// owner: yancongya, repo: auto_tinify
```

#### 2. 爬取 README 内容
```typescript
// 方法 A: 使用 GitHub API（推荐）
const apiUrl = "https://api.github.com/repos/yancongya/auto_tinify/readme";
// 返回 base64 编码的内容，需要解码

// 方法 B: 使用 web_fetch 抓取原始内容
const rawUrl = "https://raw.githubusercontent.com/yancongya/auto_tinify/main/README.md";
```

#### 3. 爬取项目信息
```typescript
// 获取仓库信息
const repoInfoUrl = "https://api.github.com/repos/yancongya/auto_tinify";
// 返回: { name, description, owner, stargazers_count, forks_count, ... }

// 获取最新 Release
const releaseUrl = "https://api.github.com/repos/yancongya/auto_tinify/releases/latest";
// 返回: { tag_name, assets, body, ... }
```

#### 4. 爬取目录结构
```typescript
// 获取仓库内容列表
const contentsUrl = "https://api.github.com/repos/yancongya/auto_tinify/contents";
// 返回文件树，帮助识别项目类型
```

**提取的关键信息：**
| 字段 | 来源 | 用途 |
|------|------|------|
| title | repo.name 或 README 第一行 | 文档标题 |
| author | repo.owner.login | 作者 |
| description | repo.description | 简短描述 |
| tags | 项目类型关键词 | 标签 |
| updatedAt | repo.updated_at | 更新时间 |
| version | release.tag_name | 版本号 |
| stars | repo.stargazers_count | 热度指标 |

#### 5. 下载链接生成
```typescript
// GitHub 下载链接格式
const downloadUrl = "https://github.com/{owner}/{repo}/releases/download/{tag}/{filename}";
const archiveUrl = "https://github.com/{owner}/{repo}/archive/refs/heads/main.zip";
```

---

### 类型 B：网页链接

**系统询问**："请输入网页链接"

```typescript
ask_user_question({
  questions: [{
    question: "请输入网页链接",
    header: "网页链接",
    multiSelect: false
  }]
})
```

**系统执行：**
- 使用 `web_fetch` 抓取内容
- 提取标题、作者、正文内容
- 尝试提取 OG 标签（og:title, og:description, og:image）
- 识别内容类型（博客、产品页面、文档等）

---

### 类型 C：项目文件夹

**系统询问**："请输入项目文件夹路径"

```typescript
ask_user_question({
  questions: [{
    question: "请输入项目文件夹路径",
    header: "项目路径",
    multiSelect: false
  }]
})
```

**系统执行：**
- 扫描项目结构
- 读取 README.md、package.json 等
- 识别项目类型
- 查找图片资源

---

### 类型 D：本地文档

**系统询问**："请输入文档路径（多个用换行分隔）"

```typescript
ask_user_question({
  questions: [{
    question: "请输入文档路径",
    header: "文档路径",
    multiSelect: false
  }]
})
```

---

## 第 3 步：图片资源下载（关键功能）

**系统询问**："检测到以下图片资源，是否下载到本地？"

```typescript
// 自动检测 README 中的图片
const imagePatterns = [
  /!\[.*?\]\((.*?)\)/g,           // Markdown 图片
  /<img.*?src=["'](.*?)["']/g,     // HTML img 标签
  /!\[.*?\]\[(\w+)\]/g             // 参考式图片
];
```

**系统显示检测到的图片：**
```
发现以下图片：
- https://raw.githubusercontent.com/.../cover.png
- https://raw.githubusercontent.com/.../main.jpg
- https://raw.githubusercontent.com/.../logo.png
```

**下载流程：**

```typescript
// 1. 下载图片到临时目录
const tempDir = "temp/downloads/{repo}/assets/";

// 2. 重命名为唯一名称（添加 slug 前缀）
// cover.png -> auto-tinify-cover.png
// main.jpg -> auto-tinify-main.jpg

// 3. 复制到正确位置
// public/content/scripts/assets/
```

**图片处理规则：**
| 原文件名 | 新文件名 | 用途 |
|----------|----------|------|
| cover.* | {slug}-cover.{ext} | 封面图片 |
| logo.* | {slug}-logo.{ext} | 标志 |
| main.* | {slug}-main.{ext} | 主界面截图 |
| screenshot.* | {slug}-screenshot.{ext} | 截图 |
| 其他 | {slug}-{原名}.{ext} | 其他图片 |

**⚠️ 重要提醒：**
- 封面图片下载后路径格式：`/content/scripts/assets/{slug}-cover.{ext}`
- 文档内图片路径：`./assets/{slug}-xxx.{ext}`
- 需要更新文档中的图片引用路径

---

## 第 4 步：智能整理

**系统询问**："已提取内容，需要哪些智能整理？"

```typescript
ask_user_question({
  questions: [{
    question: "需要哪些智能整理功能？",
    header: "智能整理",
    options: [
      { label: "自动生成标题", description: "根据内容自动生成文档标题" },
      { label: "提取标签", description: "从内容中提取相关标签" },
      { label: "生成描述", description: "自动生成简短描述" },
      { label: "识别类型", description: "自动识别文档类型" },
      { label: "保留源信息", description: "保留 GitHub/网页原始链接和作者" }
    ],
    multiSelect: true
  }]
})
```

---

## 第 5 步：生成草稿

**系统执行 - 元数据生成：**

```yaml
---
title: {自动生成或用户提供}
author: {GitHub owner / 网页作者 / 用户输入}
tags: [自动提取的标签]
description: {自动生成的描述}
updatedAt: {当前日期}
isFavorite: {可选}
coverImage: {下载的封面图片路径}
/originalUrl: {原始 GitHub/网页链接}  # 自定义字段保留源地址
---
```

**⚠️ 重要 - 封面图片路径格式：**
```yaml
# ✅ 正确 - 使用 /content 开头
coverImage: /content/scripts/assets/auto-tinify-cover.png

# ❌ 错误 - 会导致图片无法显示
coverImage: ./assets/cover.png
coverImage: assets/cover.png
```

**文档内容结构：**

```markdown
## 介绍

[从 README 提取的简介]

## 产品官网

🌐 [原始仓库]({GitHub URL}) | 📦 [下载安装]({Release URL})

## 下载

### 安装方法

[从 README 提取的安装说明]

## 功能特性

[从 README 提取的功能列表]

## 界面展示

![主界面](./assets/{slug}-main.jpg)

## ... [其他内容]
```

---

## 第 6 步：质量检查

**系统询问**："需要运行规范检查吗？"

```typescript
ask_user_question({
  questions: [{
    question: "需要哪些规范检查？",
    header: "规范检查",
    options: [
      { label: "元数据完整", description: "检查所有必需字段" },
      { label: "封面图片路径", description: "确认使用 /content/ 格式" },
      { label: "下载链接有效", description: "检查 GitHub release 链接" },
      { label: "图片引用正确", description: "确认文档内图片路径正确" },
      { label: "源信息保留", description: "确认原始链接已保留" },
      { label: "清单更新", description: "确认 manifest.json 已更新" }
    ],
    multiSelect: true
  }]
})
```

---

## 第 7 步：保存确认

**系统显示：**
```
文件名：{slug}.md
保存位置：public/content/{类型}/
封面图片：/content/{类型}/assets/{slug}-cover.png
原始链接：{GitHub URL}
```

```typescript
ask_user_question({
  questions: [{
    question: "确认保存文档？",
    header: "保存确认",
    options: [
      { label: "确认保存", description: "保存文档并更新清单" },
      { label: "返回修改", description: "返回修改文档" },
      { label: "取消", description: "取消保存" }
    ],
    multiSelect: false
  }]
})
```

---

## GitHub 爬取详细流程

### 完整流程示例

```
用户输入：https://github.com/yancongya/auto_tinify

1. 提取信息
   - owner: yancongya
   - repo: auto_tinify
   - slug: auto-tinify

2. 爬取 README
   - URL: https://api.github.com/repos/yancongya/auto_tinify/readme
   - 解码 base64 内容

3. 爬取项目信息
   - URL: https://api.github.com/repos/yancongya/auto_tinify
   - 获取: description, stars, updated_at

4. 获取最新 Release
   - URL: https://api.github.com/repos/yancongya/auto_tinify/releases/latest
   - 获取: tag_name, assets[].browser_download_url

5. 检测图片
   - 扫描 README 中的图片链接
   - 识别: cover.png, main.jpg, logpanel.jpg

6. 下载图片
   - cover.png -> temp/downloads/auto_tinify/assets/auto-tinify-cover.png
   - 复制到 public/content/scripts/assets/auto-tinify-cover.png

7. 生成元数据
   - title: "Auto_Tinify"
   - author: "yancongya"
   - tags: ["图片压缩", "AE脚本", "工具", "Tinify"]
   - description: "主打简单快捷的 After Effects 图片压缩工具"
   - coverImage: "/content/scripts/assets/auto-tinify-cover.png"
   - originalUrl: "https://github.com/yancongya/auto_tinify"

8. 生成文档
   - 保存到 public/content/scripts/auto-tinify.md

9. 更新清单
   - 添加到 _manifest.json
```

---

## 源信息保留规则

### GitHub 仓库
```yaml
originalUrl: https://github.com/yancongya/auto_tinify
repository: yancongya/auto_tinify
version: v2.0.4
stars: 100
```

### 网页链接
```yaml
originalUrl: https://example.com/article
source: example.com
```

### 文档内引用
```markdown
## 产品官网

🌐 [原始仓库](https://github.com/yancongya/auto_tinify)
```

---

## 快速模式

**如果用户选择快速模式：**

```typescript
ask_user_question({
  questions: [{
    question: "提供 GitHub 仓库地址，其他使用默认值",
    header: "快速生成",
    multiSelect: false
  }]
})
```

**执行：**
1. 自动爬取 GitHub 仓库
2. 自动下载图片资源
3. 自动生成元数据
4. 使用默认文档结构
5. 直接保存

---

## 示例对话

### 示例 1：从 GitHub 仓库生成

**用户**：从 GitHub 生成文档

**系统**：请输入 GitHub 仓库地址

**用户**：`https://github.com/yancongya/auto_tinify`

**系统**：正在爬取 GitHub 仓库...
- ✅ 获取 README.md 成功
- ✅ 获取项目信息成功（Auto_Tinify）
- ✅ 获取最新 Release（v2.0.4）
- ✅ 检测到 4 张图片（cover.png, main.jpg, logpanel.jpg, 微信.jpg）

**系统**：检测到以下图片，是否下载？
- cover.png → auto-tinify-cover.png
- main.jpg → auto-tinify-main.jpg
- logpanel.jpg → auto-tinify-logpanel.jpg
- 微信.jpg → auto-tinify-wechat.jpg

**用户**：下载所有图片

**系统**：正在下载图片...
- ✅ 下载完成

**系统**：已提取内容，需要哪些智能整理？
- 自动生成标题
- 提取标签
- 生成描述
- 保留源信息

**用户**：全部选择

**系统**：正在生成草稿...
✅ 封面图片路径: /content/scripts/assets/auto-tinify-cover.png

**系统**：草稿已生成，需要调整吗？

**用户**：直接保存

**系统**：需要规范检查吗？

**用户**：全部检查

**系统**：
- ✅ 元数据完整
- ✅ 封面图片路径正确（/content/ 格式）
- ✅ 下载链接有效
- ✅ 图片引用正确
- ✅ 源信息已保留
- ✅ manifest.json 已更新

**系统**：确认保存？
- 文件名：auto-tinify.md
- 位置：public/content/scripts/
- 原始链接：https://github.com/yancongya/auto_tinify

**用户**：确认保存

**系统**：✅ 文档已保存！

---

## 注意事项

### GitHub API 限制
- 未认证请求：60 次/小时
- 建议使用 token（可选）
- 需要处理 rate limit

### 图片下载
- 仅下载 GitHub 托管的图片
- 自动重命名避免冲突
- 支持 PNG、JPG、GIF、WebP

### 路径格式
- 封面元数据：`/content/{类型}/assets/{slug}-cover.{ext}`
- 文档内图片：`./assets/{slug}-xxx.{ext}`

### 源信息保留
- 必须保留 originalUrl 字段
- 文档中必须包含原始链接

---

## 版本信息

**v2.0 (2026-03-23)**：
- 新增 GitHub 仓库自动爬取功能
- 新增图片资源自动下载和重命名
- 新增封面图片路径格式规范
- 新增源信息保留（originalUrl）
- 增强质量检查
- 与 writing-documents skill 完美配合

**v1.0 (2026-03-19)**：
- 初始版本
- 支持网页、项目文件夹、本地文档
