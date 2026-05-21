---
title: Auto_Tinify
author: 烟囱鸭
tags: [图片压缩, AE脚本, PS脚本, 工具, Tinify]
description: 支持 After Effects 和 Photoshop 的图片压缩工具，通过 Tinify API 智能压缩，支持多 Key 轮换、批量处理
updatedAt: 2026-05-21
isFavorite: true
coverImage: /content/scripts/assets/auto-tinify-cover.png
---

## 简介

Auto_Tinify 是一款支持 After Effects 和 Photoshop 的图片压缩工具，通过 Tinify API 提供高效、智能的图片压缩服务。支持批量压缩、多 API Key 轮换、图层导出压缩，压缩率高达 70% 且画质几乎无损。

## 功能特性

- 🧠 **智能压缩**：支持 JPG、PNG、WebP 格式，压缩率高达 70%
- 🔑 **多密钥轮换**：支持多个 API Key 自动轮换，追踪剩余次数
- 🎯 **灵活路径**：支持 `${projectPath}` 变量，正则匹配压缩目录
- ⚡ **快捷操作**：`Ctrl+Shift` 导出图层并压缩，`Alt` 压缩选中素材
- 📊 **压缩对比**：完成后显示压缩前后大小对比及节省百分比
- 💾 **配置持久化**：自动保存配置，无需重复设置

## 使用方法

### 安装

**方法 1：kbar 安装（推荐）**

1. 安装 [kbar](https://kbar.itycon.cn/) 脚本管理器
2. 搜索 `Auto_Tinify`，点击安装

**方法 2：手动安装**

1. 下载 [jsxbin 文件](https://www.123865.com/s/FQvajv-z4EnH?pwd=zIXS)
2. 复制到脚本目录：
   - AE：`C:\Program Files\Adobe\Adobe After Effects [版本]\Support Files\Scripts\`
   - PS：`C:\Program Files\Adobe\Adobe Photoshop [版本]\Presets\Scripts\`
3. 重启 AE/PS

### 基本使用

1. 获取 [Tinify API Key](https://tinify.com/developers)（每月免费 500 次）
2. 点击 `⚙ API Key 设置` 添加 Key
3. 点击 `⚙ 路径设置` 配置压缩路径
4. 点击 `开始压缩`

### 快捷操作

| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 导出选中图层并压缩 | `Ctrl+Shift` + 点击 | AE/PS 均支持 |
| 压缩选中的图片素材 | `Alt` + 点击 | 仅 AE |
| 压缩指定文件 | 点击 `选择文件` | 支持多选 |
| 压缩指定文件夹 | 点击 `选择文件夹` | 递归压缩 |

### 路径配置

支持 `${projectPath}` 变量（项目文件所在目录的父目录）：

| 示例 | 说明 |
|------|------|
| `${projectPath}/输出` | 压缩项目目录旁的"输出"文件夹 |
| `${projectPath}/compressed` | 压缩项目目录旁的"compressed"文件夹 |
| `D:/MyProject/images` | 绝对路径 |

## 参数说明

### 配置文件

配置自动保存在 `auto_tinify_config.txt`（脚本同目录）：

| 配置项 | 格式 | 说明 |
|--------|------|------|
| API Key | `key:xxx,yyy` | API Key + 剩余次数 |
| 路径 | `名称\|路径模式` | 路径配置 |

## 效果展示

### 主界面

![主界面](./assets/main.jpg)

### 日志面板

![日志面板](./assets/logpanel.jpg)

## 常见问题

### Q: 压缩失败怎么办？

A: 检查 API Key 是否有效、网络是否正常、图片格式是否支持（JPG、PNG、WebP）

### Q: 免费额度用完了怎么办？

A: 注册多个 Tinify 账号，添加多个 Key，脚本会自动轮换（5 个 Key 每月最多 2500 次）

### Q: 如何备份配置？

A: 复制脚本同目录的 `auto_tinify_config.txt` 即可

## 下载

- [123 网盘下载](https://www.123865.com/s/FQvajv-z4EnH?pwd=zIXS)
- [GitHub Releases](https://github.com/yancongya/auto_tinify/releases)

## 更新日志

### v2.0.6（最新）

- 支持 Photoshop
- 图层导出压缩优化

### v2.0.4

- 设置窗口改版：拆分 API Key 和路径配置
- 中文文件名支持修复
- 状态栏优化

### v2.0.3

- 新增多 API Key 轮换
- 剩余次数追踪
