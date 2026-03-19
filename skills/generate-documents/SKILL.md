---
name: generate-documents
description: Generate AE scripts documentation from existing content like multiple documents, project folders, articles, or URLs
---

# 文档生成技能

## 触发条件

当用户需要从已有内容生成文档时使用此技能：
- 从多个文档汇总或合并
- 从项目文件夹扫描生成文档
- 将现有文章转换为标准格式
- 从网页链接抓取内容生成文档

## 工作流程

```
输入类型选择 → 内容提取 → 智能整理 → 生成草稿 → 规范检查 → 交互确认 → 保存文档
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
        label: "多个文档", 
        description: "合并或汇总多个现有文档" 
      },
      { 
        label: "项目文件夹", 
        description: "扫描项目结构生成文档" 
      },
      { 
        label: "一篇文章", 
        description: "将现有文章转换为标准格式" 
      },
      { 
        label: "一个链接", 
        description: "从网页抓取内容生成文档" 
      }
    ],
    multiSelect: false
  }]
})
```

---

## 第 2 步：内容提取

### 类型 A：多个文档

**系统询问**："提供文档路径"

```typescript
ask_user_question({
  questions: [{
    question: "请输入文档路径（多个用换行分隔）",
    header: "文档路径",
    multiSelect: false
  }]
})
```

**系统执行**：
- 读取所有文档
- 提取元数据（title, author, tags, description）
- 分析共同主题
- 识别文档类型

### 类型 B：项目文件夹

**系统询问**："提供项目路径"

```typescript
ask_user_question({
  questions: [{
    question: "请输入项目文件夹路径",
    header: "项目路径",
    multiSelect: false
  }]
})
```

**系统执行**：
- 扫描项目结构
- 读取 README.md（如果存在）
- 读取 package.json（如果存在）
- 提取代码注释
- 识别项目类型（脚本/表达式/预设/扩展）

### 类型 C：一篇文章

**系统询问**："提供文章路径"

```typescript
ask_user_question({
  questions: [{
    question: "请输入文章文件路径",
    header: "文章路径",
    multiSelect: false
  }]
})
```

**系统执行**：
- 读取文章内容
- 提取现有结构
- 识别元数据
- 生成标准格式草稿

### 类型 D：一个链接

**系统询问**："提供网页链接"

```typescript
ask_user_question({
  questions: [{
    question: "请输入网页链接",
    header: "网页链接",
    multiSelect: false
  }]
})
```

**系统执行**：
- 使用 `web_fetch` 抓取内容
- 提取正文和结构
- 识别标题和作者
- 生成标准格式草稿

---

## 第 3 步：智能整理

**系统询问**："已提取内容，需要哪些智能整理？"

```typescript
ask_user_question({
  questions: [{
    question: "需要哪些智能整理功能？",
    header: "智能整理",
    options: [
      { 
        label: "自动生成标题", 
        description: "根据内容自动生成文档标题" 
      },
      { 
        label: "提取标签", 
        description: "从内容中提取相关标签" 
      },
      { 
        label: "生成描述", 
        description: "自动生成简短描述" 
      },
      { 
        label: "识别类型", 
        description: "自动识别文档类型" 
      }
    ],
    multiSelect: true
  }]
})
```

---

## 第 4 步：生成草稿

**系统执行**：
- 根据提取的内容生成 Markdown 草稿
- 自动生成标准元数据
- 使用对应的文档类型模板
- 添加默认内容结构

**草稿预览**：
```typescript
ask_user_question({
  questions: [{
    question: "文档草稿已生成，需要调整吗？",
    header: "草稿调整",
    options: [
      { label: "修改元数据", description: "调整标题、标签、描述等" },
      { label: "添加内容", description: "添加缺失的内容部分" },
      { label: "调整结构", description: "重新组织内容结构" },
      { label: "直接保存", description: "跳过调整，直接保存" }
    ],
    multiSelect: false
  }]
})
```

---

## 第 5 步：规范检查

**系统询问**："需要运行规范检查吗？"

```typescript
ask_user_question({
  questions: [{
    question: "需要哪些规范检查？",
    header: "规范检查",
    options: [
      { label: "元数据完整", description: "检查所有必需字段" },
      { label: "链接有效", description: "检查下载链接和图片链接" },
      { label: "格式正确", description: "检查 Markdown 格式" },
      { label: "清单更新", description: "确认 manifest.json 已更新" }
    ],
    multiSelect: true
  }]
})
```

**系统执行**：
- 运行规范检查
- 报告问题
- 提供修复建议

---

## 第 6 步：保存确认

**系统询问**："文档准备保存，确认信息："

**显示**：
- 文件名：自动生成
- 保存位置：`public/content/{类型}/`
- manifest.json：需要更新

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

## 元数据自动生成规则

### 标题生成
- 从文件名提取
- 从内容第一行提取
- 从项目名称提取
- 从网页标题提取

### 标签生成
- 从内容关键词提取
- 从项目类型推断
- 从链接域名推断
- 默认标签：`["未分类"]`

### 描述生成
- 从内容第一段提取（最多 100 字）
- 从项目描述提取
- 从网页摘要提取
- 默认描述："暂无描述"

### 作者生成
- 从内容元数据提取
- 从项目 package.json 提取
- 从网页作者提取
- 默认作者："烟囱鸭"

### 类型识别
- 文档位置（`/scripts/` → scripts）
- 文件扩展名（`.jsx` → scripts）
- 项目类型推断
- 内容关键词分析

---

## 与 writing-documents 的关系

### 调用关系
```
generate-documents (本 skill)
    ↓ (生成草稿)
    ↓
    ↓ (可选：调用规范检查)
    ↓
    ↓ (可选：调用质量检查)
    ↓
最终文档
```

### 复用功能
- 元数据规范
- 文件结构
- 清单更新逻辑
- 质量检查清单

---

## 快速模式

**如果用户选择快速模式**：

**系统询问**："提供内容路径或链接，其他使用默认值"

**执行**：
- 自动提取内容
- 自动生成元数据
- 使用默认内容结构
- 自动生成封面
- 直接保存

---

## 示例对话

### 示例 1：从项目文件夹生成

**用户**：从项目文件夹生成

**系统**：好的，请输入项目文件夹路径

**用户**：`/path/to/my-project`

**系统**：正在扫描项目...
- 发现 README.md
- 发现 package.json
- 发现 3 个 .jsx 文件
- 识别类型：脚本

**系统**：已提取内容，需要哪些智能整理？
- 自动生成标题
- 提取标签
- 生成描述
- 识别类型

**用户**：自动生成标题, 提取标签, 生成描述

**系统**：正在生成草稿...
草稿已生成，需要调整吗？
- 修改元数据
- 添加内容
- 调整结构
- 直接保存

**用户**：添加内容

**系统**：需要添加哪些内容部分？（下载链接/使用场景/功能特性/使用教程/效果展示/常见问题/更新日志）

**用户**：下载链接, 使用场景, 功能特性

**系统**：正在更新草稿...需要规范检查吗？

**用户**：需要

**系统**：需要哪些规范检查？（元数据完整/链接有效/格式正确/清单更新）

**用户**：元数据完整, 清单更新

**系统**：✅ 元数据检查通过
✅ manifest.json 已更新
确认保存到 `public/content/scripts/my-project.md`？

**用户**：确认保存

**系统**：✅ 文档已保存！

### 示例 2：从链接生成

**用户**：从链接生成

**系统**：好的，请输入网页链接

**用户**：https://example.com/article

**系统**：正在抓取内容...
- 标题：网页标题
- 作者：网页作者
- 内容：已提取

**系统**：正在生成草稿...已生成，需要调整吗？

**用户**：直接保存

**系统**：确认保存到 `public/content/scripts/web-article.md`？

**用户**：确认保存

**系统**：✅ 文档已保存！

---

## 注意事项

- 文件名自动生成（基于标题，小写，连字符分隔）
- manifest.json 自动更新
- 支持多种输入类型
- 智能提取和整理
- 交互式确认
- 自动符合规范

---

## 版本信息

**v1.0 (2026-03-19)**：
- 初始版本
- 支持 4 种输入类型
- 智能提取和整理
- 交互式确认流程
- 与 writing-documents skill 配合使用