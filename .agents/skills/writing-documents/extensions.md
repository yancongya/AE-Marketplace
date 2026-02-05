# 扩展文档编写

## 概述

为 After Effects 扩展创建符合规范的文档，重点突出下载链接、效果预览、使用场景和简单原理说明。

## 文档结构

```markdown
---
title: 扩展名称
iconEmoji: 🔌
author: 烟囱鸭
tags: [扩展, 插件, 工具]
description: 扩展 After Effects 功能
updatedAt: 2026-02-05
---

## 下载

🔗 [下载扩展](/downloads/extension-name.zip)

## 效果预览

![预览图片](/images/extensions/extension-name.png)

## 使用场景

- 自定义工作流集成
- 第三方工具连接
- 增强功能

## 原理分析

[扩展架构的简单说明]
```

## 关键要素

### 1. 下载链接

- 放在文章顶部
- 使用明显的 emoji 图标
- 链接到实际下载文件
- 文件格式：`.zip` 或安装包

### 2. 效果预览

- 放在下载链接下方
- 使用高质量预览图
- 展示扩展界面和功能
- 可以包含多张截图

### 3. 使用场景

- 列举 3-5 个典型应用场景
- 描述具体的使用环境
- 解决的问题和痛点
- 适合不同用户需求

### 4. 原理分析

- 简单说明扩展架构
- 不需要深入技术细节
- 重点突出集成方式
- 说明与 AE 的交互

## 内容模板

```markdown
## 下载

🔗 [下载扩展](/downloads/extension-name.zip)

**文件信息：**
- 文件大小：2.5 MB
- 版本：v1.0.0
- 兼容性：AE CC 2020+
- 类型：面板扩展
- 语言：中文/英文

## 效果预览

### 主界面

![主界面](/images/extensions/extension-name-main.png)

### 功能演示

![功能演示](/images/extensions/extension-name-demo.gif)

## 使用场景

- **场景 1**：详细描述和应用效果
- **场景 2**：详细描述和应用效果
- **场景 3**：详细描述和应用效果

## 原理分析

### 架构设计

[简单说明扩展的整体架构]

### 集成方式

[说明扩展如何与 After Effects 集成]

### 数据交互

[说明数据如何在扩展和 AE 之间流动]

## 系统要求

- **操作系统**：Windows 10+ / macOS 10.14+
- **After Effects**：CC 2020 或更高版本
- **内存**：建议 8GB 以上
- **存储空间**：50MB 可用空间

## 安装教程

### 方法 1：自动安装（推荐）

1. 下载扩展包
2. 双击安装程序
3. 按提示完成安装
4. 重启 After Effects

### 方法 2：手动安装

1. 下载扩展包
2. 解压到 AE 扩展目录：
   - Windows: `C:\Program Files\Adobe\Adobe After Effects [版本]\Support Files\Plug-ins\`
   - macOS: `/Applications/Adobe After Effects [版本]/Plug-ins/`
3. 重启 After Effects

## 使用教程

### 步骤 1：打开扩展

1. 启动 After Effects
2. 选择 Window → Extensions → 扩展名称
3. 扩展面板将显示

### 步骤 2：基本使用

1. 选择要处理的图层
2. 在扩展面板中配置参数
3. 点击应用按钮
4. 查看效果并调整

### 步骤 3：高级功能

[详细说明高级功能的使用方法]

## 功能特性

### 核心功能

| 功能 | 说明 | 快捷键 |
|------|------|--------|
| 功能 1 | 详细说明 | Ctrl+1 |
| 功能 2 | 详细说明 | Ctrl+2 |

### 高级功能

- **高级功能 1**：详细说明
- **高级功能 2**：详细说明

## 配置说明

### 基本配置

- **配置项 1**：详细说明
- **配置项 2**：详细说明

### 高级配置

[详细说明高级配置选项]

## 注意事项

> ⚠️ **注意**：重要的使用提示和限制

## 常见问题

### Q: 安装后找不到扩展？

**A:** 详细解答和解决方案

### Q: 扩展无法正常工作？

**A:** 详细解答和解决方案

## 更新日志

- **v1.0.0** (2026-02-05)：初始版本

## 相关扩展

- [扩展名称 1](./another-extension.md)
- [扩展名称 2](./another-extension-2.md)
```

## 图片资源

### 界面截图

**使用免费图片源：**
- **Unsplash**：`https://source.unsplash.com/featured/{关键词}`
- **Placeholder.com**：`https://via.placeholder.com/{宽}x{高}`

**示例：**
```markdown
![界面预览](https://source.unsplash.com/featured/interface)
```

### GIF 演示

如果有条件，使用 GIF 展示动态效果：
```markdown
![功能演示](/images/extensions/extension-name.gif)
```

## 系统架构图

```mermaid
graph TD
    A[After Effects] -->|CEP API| B[扩展面板]
    B -->|ExtendScript| C[AE 引擎]
    C -->|回调| B
    B -->|数据| D[本地存储]
```

## 功能对比表

| 功能 | 免费版 | 专业版 |
|------|--------|--------|
| 功能 1 | ✓ | ✓ |
| 功能 2 | ✓ | ✓ |
| 功能 3 | ✗ | ✓ |
| 功能 4 | ✗ | ✓ |

## 质量检查

- [ ] 顶部有下载链接
- [ ] 包含文件信息（大小、版本、兼容性）
- [ ] 有效果预览图片
- [ ] 至少 3 个使用场景
- [ ] 原理分析简单清晰
- [ ] 系统要求明确
- [ ] 安装教程详细（多种方法）
- [ ] 使用教程步骤清晰
- [ ] 功能特性完整
- [ ] 配置说明详细
- [ ] 有注意事项提示
- [ ] 包含常见问题解答
- [ ] 有更新日志
- [ ] 有相关扩展链接
- [ ] 已更新 `public/content/extensions/_manifest.json`

## 参考示例

查看现有扩展文档：
- `public/content/extensions/extension-dev-guide.md`
- `public/content/extensions/what-is-scripts.md`