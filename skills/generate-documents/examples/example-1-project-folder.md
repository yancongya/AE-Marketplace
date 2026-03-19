# 示例 1：从项目文件夹生成文档

## 场景

你有一个 After Effects 脚本项目，想要自动生成文档。

## 项目结构

```
my-ae-script/
├── README.md
├── package.json
├── src/
│   ├── script.jsx
│   ├── utils.js
│   └── main.jsx
└── dist/
    └── script.jsx
```

## 步骤

### 1. 选择输入类型
- 选择"项目文件夹"

### 2. 提供路径
- 输入：`/path/to/my-ae-script`

### 3. 智能整理
- 选择：自动生成标题、提取标签、生成描述、识别类型

### 4. 生成草稿
- 系统自动生成文档草稿
- 自动填充元数据
- 使用脚本模板

### 5. 规范检查
- 选择：元数据完整、清单更新

### 6. 保存
- 保存到：`public/content/scripts/my-ae-script.md`
- 更新：`public/content/scripts/_manifest.json`

## 生成结果

```yaml
---
title: My AE Script
author: 烟囱鸭
tags: [脚本, 自动化, 工具]
description: 功能强大的 AE 脚本项目
updatedAt: 2026-03-19
isFavorite: false
---

## 下载

🔗 [下载脚本](https://github.com/yancongya/AE----/releases/download/v1.0.0/script.jsx)

## 项目结构

[项目结构说明]

## 功能特性

[从代码注释提取的功能]

## 使用方法

[从 README.md 提取的使用说明]
```