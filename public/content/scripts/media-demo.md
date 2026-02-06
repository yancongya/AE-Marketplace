---
title: 媒体内容演示
iconEmoji: 🎬
author: 烟囱鸭
tags: [演示, 媒体, 视频]
category: scripts
description: 演示如何使用视频链接和媒体内容
updatedAt: 2026-02-06
---

# 媒体内容演示

本文档展示了 AE 脚本市场支持的媒体内容功能。

## YouTube 视频

直接输入 YouTube 视频链接，系统会自动识别并渲染为可播放的视频播放器：

https://www.youtube.com/watch?v=dQw4w9WgXcQ

或者使用链接语法：

[点击观看 YouTube 视频](https://www.youtube.com/watch?v=dQw4w9WgXcQ)

## Bilibili 视频

输入 Bilibili 视频链接：

https://www.bilibili.com/video/BV1xx411c7mD

## 直接视频文件

支持直接视频文件链接（.mp4, .webm, .ogg 等）：

https://www.w3schools.com/html/mov_bbb.mp4

## 普通链接

普通网页链接会显示为可点击的链接：

[访问 Google](https://www.google.com)

[访问 GitHub](https://github.com)

## 图片链接

使用标准 Markdown 图片语法：

![示例图片](https://picsum.photos/800/400)

## HTML 标签支持

测试 HTML 标签渲染：

### Iframe 测试

<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=-0.00401794910430908%2C51.47612752641776%2C0.000305771827697753%2C51.478569861898606&layer=mapnik" width="100%" height="400"></iframe>

### Video 测试

<video src="https://www.w3schools.com/html/mov_bbb.mp4" controls width="100%"></video>

### Image 测试

<img src="https://picsum.photos/600/300" alt="HTML 图片" width="100%" />

## 支持的视频平台

- ✅ YouTube (youtube.com, youtu.be)
- ✅ Bilibili (bilibili.com)
- ✅ 直接视频文件 (.mp4, .webm, .ogg, .mov, .avi)

## 功能特点

1. **自动识别**：系统自动检测链接类型
2. **智能渲染**：视频网站自动渲染为播放器
3. **兼容性**：支持标准 Markdown 语法
4. **扩展性**：支持直接使用 HTML 标签