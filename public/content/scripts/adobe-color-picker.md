---
title: Adobe Color Picker
author: smallpath
tags: [颜色选择器, AE脚本, 扩展脚本, 工具]
description: 为 Adobe ExtendScript 重构的颜色选择器，支持 PS、AI、AE 等软件
updatedAt: 2026-03-23
originalUrl: https://github.com/smallpath/adobe-color-picker
repository: smallpath/adobe-color-picker
version: v2.1
---

## 介绍

Adobe Color Picker 是一个为 Adobe ExtendScript 重构的颜色选择器组件，支持所有 Adobe 软件如 Photoshop、Illustrator、After Effects 等。

如果你在使用 ExtendScript 开发时需要让用户选择颜色，这个组件可以帮你实现原生风格的颜色选择器，再也不需要使用简陋的 `$.colorPicker()` 了。

## 产品官网

🌐 [GitHub 仓库](https://github.com/smallpath/adobe-color-picker)

## 下载

🔗 [GitHub Releases](https://github.com/smallpath/adobe-color-picker/releases)

**最新版本：** v2.1

## 功能特性

### 核心功能

- 🎨 **原生风格**：重构了 Adobe 软件原生的颜色选择器界面
- 🖥️ **多软件支持**：支持 Photoshop、Illustrator、After Effects 等所有 Adobe 软件
- 🌈 **多格式支持**：支持 RGB、HEX、HSB 三种颜色格式
- 📝 **快捷编辑**：支持快捷键快速调整数值
- 💾 **位置记忆**：记住上次关闭时的位置和锚点
- 📐 **多种模式**：支持小模式（palette 和 panel 窗口）

### 快捷操作

| 操作 | 快捷键 | 说明 |
|------|--------|------|
| 数值增减 | `↑` / `↓` | 每次增减 1 |
| 数值大幅增减 | `Shift` + `↑` / `↓` | 每次增减 10 |

### 参数选项

| 参数类型 | 格式 | 取值范围 |
|----------|------|----------|
| RGB | Array | [0,0,0] 到 [1,1,1] |
| LargeRGB | Array | [0,0,0] 到 [255,255,255] |
| Hex | String | "000000" 到 "FFFFFF" |
| ShortHex | String | 如 "F7C" 表示 "FF77CC" |
| HSB | Array | [0,0,0,"hsb"] 到 [360,100,100,"hsb"] |

## 使用方法

### 方法一：#include 引入

```javascript
#include './colorPicker.js'
```

> 💡 **提示**：打包发布时，使用 ESTK 的 `File -> Export as binary` 命令可以将 Include 语句编译进脚本

### 方法二：复制粘贴

直接复制 `colorPicker.js` 中的所有代码，粘贴到脚本顶部

### 调用函数

```javascript
// 调用颜色选择器
var resultColor = colorPicker();

// 获取颜色结果
resultColor;
// 返回 RGB 数组 [0,0,0] 到 [1,1,1]
```

### 指定默认颜色

```javascript
// 使用 RGB 数组指定默认颜色
var resultColor = colorPicker([0.5, 0.5, 0.5]);

// 使用 HEX 指定默认颜色
var resultColor = colorPicker("FF0000");

// 使用 HSB 指定默认颜色
var resultColor = colorPicker([180, 50, 50, "hsb"]);
```

## 代码示例

### 基础用法

```javascript
#include './colorPicker.js'

// 打开颜色选择器
var myColor = colorPicker();

if (myColor) {
    // 用户选择了颜色
    var r = myColor[0];
    var g = myColor[1];
    var b = myColor[2];
    
    alert("你选择的颜色: R=" + r + ", G=" + g + ", B=" + b);
}
```

### 在 AE 中应用颜色

```javascript
#include './colorPicker.js'

// 获取当前合成
var comp = app.project.activeItem;
if (!comp) {
    alert("请先打开一个合成");
    exit();
}

// 获取选中的图层
var layer = comp.selectedLayers[0];
if (!layer) {
    alert("请先选择一个图层");
    exit();
}

// 打开颜色选择器
var color = colorPicker([0, 0, 1]); // 默认蓝色

if (color) {
    // 应用到图层属性（以填充为例）
    var fill = layer.property("ADBE Vector Graphics").property("ADBE Vector Fill");
    if (fill) {
        fill.color = color;
    }
}
```

### 指定多种格式默认值

```javascript
// 使用 RGB [0-1]
var color1 = colorPicker([0.25, 0.5, 0.75]);

// 使用 LargeRGB [0-255]
var color2 = colorPicker({ rgb: [64, 128, 192] });

// 使用 HEX
var color3 = colorPicker({ hex: "4080C0" });

// 使用 HSB
var color4 = colorPicker({ hsb: [200, 40, 80] });
```

## 更新日志

### v2.1

- 支持压缩工具的 minification

### v2.0

- 修复 #12 和 #11
- 减少 20% 文件大小
- 将 prototype 属性/方法移至函数原生属性/方法
- 使 HSB 字段可编辑
- 记住 ACP 关闭时的位置
- 记住亮度为 0 时的锚点位置
- 修复亮度字段为 NaN 时的错误

### v1.6

- 将颜色轮图片移回原位，避免 Mac 上显示问题
- 为 colorPicker 函数添加静态选项
- 在构造函数中添加选项
- 为调色板和面板窗口添加小模式

### v1.5

- 修复点击中心点时的崩溃
- 获取颜色后重置光标位置
- 鼠标按下时移动更流畅
- 在构造函数中支持 RGB、Hex 和 HSB
- 支持短 Hex 格式

### v1.4

- ACP 运行速度大幅提升
- 减少 90% 文件大小
- 修复无效 Hex 导致崩溃的问题

### v1.3

- 不再需要 'new' 关键字
- 添加光标
- 更好的亮度控制
- 启动时自动高亮 Hex 字段
- 不影响用户的"旧颜色"

### v1.2

- 减少 33% 的颜色选择器大小
- 启用鼠标按下时的鼠标移动处理

### v1.1

- 首次发布
- 添加对所有 Adobe 软件的支持
- 添加对 ESTK 的支持

### v1.0

- 添加对 Adobe After Effects 的支持

## 常见问题

### Q: 这个颜色选择器和 $.colorPicker() 有什么区别？

**A:** 原生的 `$.colorPicker()` 调用的是操作系统简陋的颜色选择器，而 Adobe Color Picker 重构了 Adobe 软件原生的颜色选择器界面，功能更强大、更美观。

### Q: 支持哪些 Adobe 软件？

**A:** 支持所有支持 ExtendScript 的 Adobe 软件，包括 Photoshop、Illustrator、InDesign、After Effects、Premiere Pro 等。

### Q: 如何获取颜色值？

**A:** 调用 `colorPicker()` 后会返回一个 RGB 数组，格式为 `[R, G, B]`，值范围是 0 到 1。

### Q: 打包发布时怎么处理？

**A:** 使用 ESTK 的 `File -> Export as binary` 命令可以将 `#include` 的代码编译进脚本，这样发布时就只需要一个 .jsxbin 文件。

## 许可证

MIT License

## 相关链接

- 📖 [GitHub 仓库](https://github.com/smallpath/adobe-color-picker)
- 🐛 [提交 Issue](https://github.com/smallpath/adobe-color-picker/issues)
- 💡 [ESTK 文档](https://helpx.adobe.com/en_US ExtendScript/4.0/)

---

**特别说明**：本项目为 GitHub 开源项目，文档内容基于 README 自动生成，版权归原作者 smallpath 所有。
