# 示例 2：从多个文档生成汇总文档

## 场景

你有 3 个相关的脚本文档，想要生成一个汇总文档。

## 输入文档

```
public/content/scripts/
├── script-basic.md
├── script-advanced.md
└── script-pro.md
```

## 步骤

### 1. 选择输入类型
- 选择"多个文档"

### 2. 提供路径
```
public/content/scripts/script-basic.md
public/content/scripts/script-advanced.md
public/content/scripts/script-pro.md
```

### 3. 智能整理
- 选择：自动生成标题、提取标签、生成描述

### 4. 生成草稿
- 系统提取所有文档的元数据
- 识别共同主题
- 生成汇总文档草稿

### 5. 规范检查
- 选择：元数据完整、清单更新

### 6. 保存
- 保存到：`public/content/scripts/script-series.md`
- 更新：`public/content/scripts/_manifest.json`

## 生成结果

```yaml
---
title: 脚本系列合集
author: 烟囱鸭
tags: [脚本, 系列, 汇总]
description: 基础、高级、专业三个级别的脚本合集
updatedAt: 2026-03-19
isFavorite: true
---

## 系列概述

本系列包含三个级别的脚本，从基础到专业，满足不同用户的需求。

## 文档列表

1. [基础版](./script-basic)
2. [高级版](./script-advanced)
3. [专业版](./script-pro)

## 系列特性

- 渐进式学习路径
- 统一的操作界面
- 完整的功能覆盖
```