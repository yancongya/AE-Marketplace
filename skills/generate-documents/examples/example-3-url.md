# 示例 3：从链接生成文档

## 场景

你发现了一个很棒的教程文章在网站上，想要将其转换为 AE 脚本市场的标准格式。

## 输入链接

```
https://example.com/ae-script-tutorial
```

## 步骤

### 1. 选择输入类型
- 选择"一个链接"

### 2. 提供链接
- 输入：`https://example.com/ae-script-tutorial`

### 3. 内容抓取
- 系统使用 `web_fetch` 抓取内容
- 提取标题、作者、正文
- 识别文章结构

### 4. 智能整理
- 选择：自动生成标题、提取标签、生成描述、识别类型

### 5. 生成草稿
- 系统自动生成标准格式文档
- 添加元数据
- 使用对应模板

### 6. 规范检查
- 选择：元数据完整、链接有效、格式正确、清单更新

### 7. 保存
- 保存到：`public/content/scripts/ae-script-tutorial.md`
- 更新：`public/content/scripts/_manifest.json`

## 生成结果

```yaml
---
title: AE Script Tutorial
author: 网页作者
tags: [脚本, 教程, 学习]
description: 完整的 AE 脚本开发教程
updatedAt: 2026-03-19
isFavorite: false
coverImage: https://example.com/tutorial-cover.jpg
---

## 概述

[从网页提取的概述部分]

## 学习目标

[从网页提取的学习目标]

## 教程内容

### 1. 基础概念

[从网页提取的基础概念部分]

### 2. 实践步骤

[从网页提取的实践步骤部分]

### 3. 进阶技巧

[从网页提取的进阶技巧部分]

## 相关资源

- [原文链接](https://example.com/ae-script-tutorial)
```