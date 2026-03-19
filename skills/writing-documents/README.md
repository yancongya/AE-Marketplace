# Writing Documents Skill - 文档编写技能

## 快速开始

1. **阅读 SKILL.md** - 了解核心规则
2. **选择文档类型** - 参考对应的模块文档
3. **查看示例** - 参考 examples/ 目录中的示例文档
4. **创建文档** - 自由发挥，遵循核心规则
5. **更新清单** - 在 _manifest.json 中添加文件名

## 文档结构

```
writing-documents/
├── SKILL.md                  # 主技能文档（必读）
├── README.md                 # 本文档
├── shared/                   # 共享规则
│   ├── image-resources.md    # 图片资源管理
│   └── download-links.md     # 下载链接规范
├── examples/                 # 文档示例（参考）
│   ├── expression-example.md
│   ├── script-example.md
│   ├── preset-example.md
│   └── extension-example.md
├── expressions.md            # 表达式文档要点
├── scripts.md                # 脚本文档要点
├── presets.md                # 预设文档要点
└── extensions.md             # 扩展文档要点
```

## 核心规则（必须）

### 1. 元数据格式

所有文档必须包含：

```yaml
---
title: 文档标题
author: 烟囱鸭
tags: [标签1, 标签2, 标签3]
description: 简短副标题
updatedAt: YYYY-MM-DD
isFavorite: false  # 可选
coverImage: https://example.com/cover.jpg  # 可选
---
```

### 2. 图片路径

使用相对路径：`./assets/filename.png`

```markdown
✅ ![描述](./assets/image.png)
```

### 3. 下载链接

使用网络地址：

```markdown
✅ 🔗 [下载](https://github.com/.../file.ext)
```

### 4. 清单更新

在 _manifest.json 数组中添加文件名：

```json
["existing-doc.md", "new-doc.md"]
```

## 文档类型

| 类型 | 参考文档 | 核心要素 |
|------|----------|----------|
| 表达式 | expressions.md | 可复制代码、使用场景、原理分析 |
| 脚本 | scripts.md | 下载链接、功能特性、使用教程 |
| 预设 | presets.md | 下载链接、效果预览、参数说明 |
| 扩展 | extensions.md | 下载链接、系统要求、安装教程 |

## 质量检查

- [ ] 元数据包含所有 5 个必需字段（title, author, tags, description, updatedAt）
- [ ] 元数据格式正确（移除 iconEmoji 和 category）
- [ ] 文件保存在正确目录
- [ ] 下载链接使用网络地址
- [ ] 图片使用相对路径 `./assets/`（如果存在）
- [ ] 相关文档链接不包含 `.md` 后缀
- [ ] 相关文档链接指向实际存在的文档
- [ ] 已更新 _manifest.json

## 重要注意事项

### 1. 图片引用

**只引用实际存在的图片：**
- 不要添加不存在的图片链接
- 如果没有实际图片，使用文字描述代替
- 图片路径格式：`./assets/filename.png`

### 2. 相关文档链接

**链接格式（前端路由）：**
```markdown
✅ [文档名称](./document-name)   # 不包含 .md
❌ [文档名称](./document-name.md) # 包含 .md 会导致无法打开
```

**只引用实际存在的文档：**
- 检查对应目录的 `_manifest.json` 获取可用文档列表
- **表达式**：`auto-keyframe.md`, `advanced-guide.md`, `looping-wiggle.md`
- **脚本**：`shape-morpher.md`, `ae-script-guide.md`, `script-complete-guide.md`
- **预设**：`animation.md`, `advanced-presets.md`
- **扩展**：`what-is-scripts.md`, `extension-dev-guide.md`

## 参考资源

- **现有文档**：`public/content/` 目录下的实际文档
- **共享规则**：`shared/` 目录
- **文档示例**：`examples/` 目录

## 灵活性

本技能提供核心规则和参考示例，鼓励：
- ✅ 创造性的内容组织
- ✅ 适合特定文档的章节
- ✅ 灵活的表达方式
- ✅ 个性化的风格

**原则：核心规则必须遵守，内容形式自由发挥。**