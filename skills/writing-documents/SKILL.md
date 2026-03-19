---
name: writing-documents
description: Use when writing documentation with YAML frontmatter, markdown formatting, download links, or managing content manifests
---

# 文档编写技能

## 触发条件

当用户需要创建或编辑以下类型的文档时使用此技能：
- 表达式文档
- 脚本文档
- 预设文档
- 扩展文档

## 快速开始

使用 `ask_user_question` 工具收集必要信息：

### 1. 选择文档类型
```typescript
ask_user_question({
  questions: [{
    question: "要创建什么类型的文档？",
    header: "文档类型",
    options: [
      { label: "表达式", description: "After Effects 表达式代码" },
      { label: "脚本", description: "自动化脚本工具" },
      { label: "预设", description: "动画效果预设" },
      { label: "扩展", description: "AE 扩展插件" }
    ],
    multiSelect: false
  }]
})
```

### 2. 收集基本信息
```typescript
ask_user_question({
  questions: [{
    question: "文档标题是什么？",
    header: "基本信息",
    multiSelect: false
  }, {
    question: "是否需要封面图片？",
    header: "封面",
    options: [
      { label: "需要", description: "提供封面图片 URL" },
      { label: "不需要", description: "自动生成默认封面" }
    ],
    multiSelect: false
  }]
})
```

### 3. 可选功能
```typescript
ask_user_question({
  questions: [{
    question: "需要哪些额外功能？",
    header: "额外功能",
    options: [
      { label: "流程图", description: "添加 Mermaid 流程图" },
      { label: "代码示例", description: "添加代码块和说明" },
      { label: "界面截图", description: "添加界面展示图片" },
      { label: "视频教程", description: "添加视频教程链接" }
    ],
    multiSelect: true
  }]
})
```

## 标准元数据

根据用户选择生成元数据：

```yaml
---
title: {{标题}}
author: 烟囱鸭
tags: [{{标签}}]
description: {{描述}}
updatedAt: {{当前日期}}
{{isFavorite ? 'isFavorite: true' : ''}}
{{coverImage ? `coverImage: ${coverImage}` : ''}}
---
```

**必填字段**：title, author, tags, description, updatedAt
**可选字段**：isFavorite, coverImage

## 文档结构

根据文档类型使用对应模板：

### 表达式文档
```markdown
## 功能描述
## 使用方法
## 参数说明
## 效果演示
## 常见问题
```

### 脚本文档
```markdown
## 下载
## 使用场景
## 功能特性
## 使用教程
## 注意事项
```

### 预设文档
```markdown
## 下载
## 使用场景
## 使用方法
## 参数说明
## 效果演示
```

### 扩展文档
```markdown
## 下载
## 功能描述
## 核心特性
## 安装方法
## 界面展示
```

## 图片管理

**规则**：
- 下载链接使用网络地址（HTTPS）
- 本地图片使用相对路径 `./assets/filename.png`
- 封面图片：可选，不设置则自动生成

**交互询问**：
```typescript
ask_user_question({
  questions: [{
    question: "如何提供图片资源？",
    header: "图片",
    options: [
      { label: "网络链接", description: "使用 GitHub 或其他图片托管服务" },
      { label: "本地文件", description: "使用项目内的 assets 目录" },
      { label: "暂不提供", description: "稍后补充图片" }
    ],
    multiSelect: false
  }]
})
```

## 清单更新

创建文档后，更新对应的 `manifest.json`：

```json
["existing-doc.md", "new-doc.md"]
```

**位置**：
- 表达式：`public/content/expressions/manifest.json`
- 脚本：`public/content/scripts/manifest.json`
- 预设：`public/content/presets/manifest.json`
- 扩展：`public/content/extensions/manifest.json`

## 质量检查

创建文档后，使用 ask_user_question 确认：

```typescript
ask_user_question({
  questions: [{
    question: "文档是否需要以下检查？",
    header: "质量检查",
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

## 常见交互场景

### 场景 1：快速创建简单文档
1. 选择文档类型
2. 输入标题和描述
3. 选择"不需要封面"
4. 选择"暂不提供图片"
5. 生成基础文档

### 场景 2：创建完整文档
1. 选择文档类型
2. 输入标题、描述、作者
3. 选择"需要封面"，提供 URL
4. 选择"流程图"和"代码示例"
5. 生成完整文档
6. 更新 manifest.json

### 场景 3：更新现有文档
1. 确认要更新的文档
2. 询问更新哪些部分
3. 修改对应内容
4. 确认 manifest.json 是否需要更新

## 保存位置

根据文档类型保存到对应目录：
- 表达式：`public/content/expressions/{{slug}}.md`
- 脚本：`public/content/scripts/{{slug}}.md`
- 预设：`public/content/presets/{{slug}}.md`
- 扩展：`public/content/extensions/{{slug}}.md`

## 注意事项

- ⚠️ 移除了 `iconEmoji` 字段
- ⚠️ 移除了 `category` 字段
- ✅ 添加了 `isFavorite` 字段
- ✅ 添加了 `coverImage` 字段
- ✅ 支持自动生成默认封面
- ✅ 使用交互式问题收集信息