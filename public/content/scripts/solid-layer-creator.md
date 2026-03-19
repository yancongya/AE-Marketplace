---
title: 纯色层创建器修改测试
iconEmoji: 🎨
author: 烟囱鸭
tags: ["纯色层", "颜色", "UI工具"]
description: 功能强大的纯色层创建工具，支持自定义尺寸、颜色和预设管理
updatedAt: 2026-03-17
---
## 下载

🔗 [solid-layer-creator.jsx](https://www.123865.com/s/FQvajv-11EnH?pwd=XKRf#)

**配套文件：**
- 🔗 [solid.preset](https://www.123865.com/s/FQvajv-11EnH?pwd=XKRf#) - 预设配置文件（可选）

**文件信息：**
- 文件大小：约 90 KB
- 版本：v1.0.0
- 兼容性：AE CC 2018+
- 类型：UI工具

## 使用场景

- 快速创建指定尺寸的纯色层
- 使用标签色板快速设置纯色层颜色
- 管理常用尺寸和名称预设
- 批量创建统一规格的纯色层
- UI设计稿快速搭建原型

## 功能特性

### 核心功能

| 功能 | 说明 | 快捷键 |
|------|------|--------|
| 自定义尺寸 | 自由设置宽度和高度 | - |
| 宽高比锁定 | 调整时保持固定比例 | 点击锁定按钮 |
| 使用合成大小 | 快速应用当前合成尺寸 | 点击按钮 |
| 尺寸预设 | 管理常用尺寸预设 | + / - 按钮 |
| 名称预设 | 管理常用图层名称 | + / - 按钮 |
| 颜色选择 | 从预设色板选择颜色 | 左键点击 |
| 高级颜色选择 | 打开系统颜色选择器 | 右键点击 |
| 批量随机色相 | 随机化所有彩色块色相 | Ctrl+左键 |
| 批量恢复默认 | 恢复所有彩色块默认颜色 | Alt+左键 |
| 参考图层 | 创建不被渲染的参考图层 | 右键点击确定按钮 |
| 智能默认行为 | 自动应用合理的默认设置 | 自动 |

### 高级功能

- **智能记忆**：自动保存所有设置，下次打开自动恢复
- **实时保存**：修改设置后500ms自动保存到 `solid.preset`
- **AE标签色板**：基于AE标准标签色的预设色板（11种预设色）
- **防抖保存**：避免频繁写入，提高性能
- **预设管理**：创建、保存、删除自定义预设
- **自适应布局**：支持不同AE版本的UI适配
- **快捷键支持**：Enter确认，Escape关闭
- **参考图层**：右键点击"确定"按钮创建参考图层（Guide Layer），不会被渲染输出
- **智能默认行为**：
  - 名称：自动选择名称预设列表的第一个（默认"纯色层"）
  - 尺寸：自动应用当前活动合成的尺寸
  - 尺寸预设：自动切换到"自定义"选项
  - 其他设置（颜色、自定义预设等）保持上次保存的状态
- **宽高比锁定记忆**：自动保存锁定状态和宽高比值

## 使用教程

### 步骤 1：安装

1. 下载 `solid-layer-creator.jsx` 脚本文件
2. 复制到 AE 脚本目录：
   - Windows: `C:\Program Files\Adobe\Adobe After Effects [版本]\Support Files\Scripts\ScriptUI Panels\`
   - macOS: `/Applications/Adobe After Effects [版本]/Scripts/ScriptUI Panels/`
3. （可选）将 `solid.preset` 放在同一目录，用于预设配置
4. 重启 After Effects

### 步骤 2：打开面板

1. 启动 After Effects
2. 选择 Window → 纯色层创建器
3. 弹出"纯色层设置"面板

#### 界面预览

![主界面](./assets/main.jpg)

这是脚本的主界面，包含名称设置、尺寸设置、颜色选择和操作按钮四个主要区域。

### 步骤 3：设置图层名称

1. 从 **名称** 下拉菜单选择预设名称
2. 或直接在输入框中输入自定义名称
3. 点击 `+` 按钮保存当前名称为预设
4. 点击 `-` 按钮删除选中的名称预设

![名称设置演示](./assets/name_settings.gif)

### 步骤 4：设置尺寸

#### 方法1：手动输入

1. 在 **宽度** 和 **高度** 输入框中输入数值
2. 如果需要锁定宽高比，点击"长宽比锁定"文本
3. 调整一个数值，另一个会自动按比例调整

#### 方法2：使用合成大小

1. 点击"使用合成大小"文本
2. 自动应用当前活动合成的尺寸

#### 方法3：使用预设

1. 从 **预设** 下拉菜单选择尺寸预设
2. 预设包括：Full HD (1920x1080)、4K (3840x2160) 等
3. 点击 `+` 按钮保存当前尺寸为自定义预设
4. 点击 `-` 按钮删除选中的尺寸预设

![尺寸设置演示](./assets/size_settings.gif)

### 步骤 5：选择颜色

#### 基础选择

1. 左键点击色板中的颜色块
2. 选中颜色后会显示蓝色外描边

#### 高级选择

1. 右键点击任意色板
2. 打开高级颜色选择器
3. 输入RGB值（0-255范围）或调整预览颜色
4. 选择自定义颜色并确认

#### 批量操作

- **批量随机化色相**：按住 `Ctrl` + 左键点击任意色板
  - 对所有非灰度色块进行色相随机化
  - 保留灰度色块（黑色、白色、深灰色）不变
- **批量恢复默认颜色**：按住 `Alt` + 左键点击任意色板
  - 恢复所有彩色块到AE标准标签色
  - 灰度色块保持不变

![颜色设置演示](./assets/color_settings.gif)

![颜色面板详情](./assets/color.jpg)

### 步骤 6：创建图层

#### 创建普通纯色层

1. 左键点击 **确定** 按钮或按 `Enter` 键
2. 纯色层创建在当前合成中
3. 设置自动保存到 `solid.preset` 文件

#### 创建参考图层（Guide Layer）

1. 右键点击 **确定** 按钮
2. 创建的纯色层会被标记为参考图层
3. 参考图层特点：
   - 不会被渲染输出
   - 在合成面板中显示为虚线边框
   - 适合用作对齐参考或设计辅助
   - 可以在图层面板中随时切换普通/参考状态

**注意**：右键点击创建参考图层后，设置也会被自动保存。

#### 操作提示

![确定按钮悬浮提示](./assets/sample.jpg)

鼠标悬停在"确定"按钮上时，会显示操作提示：左键创建普通纯色层，右键创建参考图层。

### 步骤 7：关闭面板

1. 点击 **取消** 按钮或按 `Escape` 键
2. 所有设置已自动保存
3. 下次打开会恢复到上次的状态

## 原理分析

### 架构设计

脚本采用MVVM（Model-View-ViewModel）架构：

```mermaid
graph TD
    A[Model 模型] --> B[全局状态变量]
    A --> C[solid.preset 文件]
    D[View 视图] --> E[ScriptUI 窗口]
    D --> F[create...Section 函数]
    D --> G[自定义控件绘制]
    H[ViewModel 视图模型] --> I[事件处理函数]
    H --> J[状态管理函数]
    I --> B
    I --> E
    J --> B
    J --> E
    C --> B
```

### 核心模块

#### 1. 状态模型（Model）

```javascript
var currentColor = [0.8, 0.2, 0.2]; // 当前颜色 [R, G, B]
var isLocked = true;                 // 宽高比锁定状态
var aspectRatio = 1.78;              // 当前宽高比
var globalPanel = null;              // 全局面板引用
var isUpdating = false;              // 防止循环更新标志
```

**说明：** 全局变量存储UI状态，实现响应式更新

#### 2. 视图层（View）

```javascript
function createSolidLayerPanel() {
    var win = new Window("dialog", "纯色层设置", undefined, {resizeable: true});

    // 创建各个部分
    createNameSection(win);
    createSizeSection(win);
    createColorSection(win);
    createButtonSection(win);

    return win;
}
```

**说明：** 使用ScriptUI创建模块化UI，每个部分独立创建

#### 3. 视图模型（ViewModel）

```javascript
function setupSizeEvents(widthInput, heightInput) {
    widthInput.onChanging = function() {
        if (isUpdating) return;
        var newWidth = parseInt(this.text);

        if (isLocked) {
            var newHeight = Math.round(newWidth / aspectRatio);
            heightInput.text = newHeight;
        } else {
            aspectRatio = newWidth / parseInt(heightInput.text);
        }

        debouncedAutoSave(); // 防抖保存
    };
}
```

**说明：** 连接视图和模型，实现数据绑定和持久化

#### 4. 持久化系统

```javascript
function savePreset() {
    var settings = {
        width: widthInput.text,
        height: heightInput.text,
        color: currentColor,
        namePresets: namePresets,      // 自定义名称预设
        sizePresets: sizePresets,      // 自定义尺寸预设
        lockState: isLocked
    };

    var presetFile = new File(presetPath);
    presetFile.open('w');
    presetFile.write(JSON.stringify(settings));
    presetFile.close();
}

function loadPreset() {
    var presetFile = new File(presetPath);
    if (presetFile.exists) {
        presetFile.open('r');
        var settings = JSON.parse(presetFile.read());
        presetFile.close();

        // 恢复所有设置
        widthInput.text = settings.width;
        heightInput.text = settings.height;
        currentColor = settings.color;
        namePresets = settings.namePresets || [];
        sizePresets = settings.sizePresets || [];
    }
}
```

**说明：** 使用JSON格式保存和加载用户设置，内置预设不会写入文件

#### 5. 智能默认行为系统

```javascript
function applyPresetSettings(panel) {
    // 恢复所有保存的设置
    loadPreset();

    // 应用智能默认行为
    panel.namePresetDropdown.selection = 0; // 选择第一个名称预设
    panel.nameInput.text = panel.namePresets[0];

    // 获取当前合成尺寸
    var compSize = getActiveCompSize();
    panel.widthInput.text = compSize.width;
    panel.heightInput.text = compSize.height;

    // 切换到"自定义"尺寸预设
    panel.presetDropdown.selection = panel.presetDropdown.items.length - 1;

    // 更新状态
    updateLockButtonState();
    updatePresetButtonStates(panel);
}
```

**说明：** 在恢复设置后自动应用合理的默认值，平衡记忆功能和智能体验

#### 6. 批量颜色操作

```javascript
function batchRandomizeHues() {
    // 对所有非灰度色块进行色相随机化
    for (var i = 0; i < aeColors.length; i++) {
        if (!isGrayscale(aeColors[i])) {
            aeColors[i] = randomizeHue(aeColors[i]);
        }
    }
    refreshColorButtons();
}

function batchRestoreDefaultColors() {
    // 恢复所有彩色块到AE标准标签色
    for (var i = 0; i < aeColors.length; i++) {
        if (!isGrayscale(aeColors[i])) {
            aeColors[i] = defaultAeColors[i];
        }
    }
    refreshColorButtons();
}
```

**说明：** 实现批量颜色操作，保留灰度色块不变

### 数据流程

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant ViewModel
    participant Model
    participant File
    
    User->>UI: 修改宽度
    UI->>ViewModel: 触发 onChanging
    ViewModel->>Model: 更新 aspectRatio
    ViewModel->>UI: 更新高度显示
    ViewModel->>ViewModel: 触发防抖(500ms)
    Note over ViewModel: 等待500ms
    ViewModel->>Model: 收集所有状态
    Model->>File: 保存到 solid.preset
    
    User->>UI: 点击确定
    UI->>ViewModel: 触发 onClick
    ViewModel->>Model: 获取最终参数
    ViewModel->>File: 再次保存
    Note over File: 创建纯色层
```

## 注意事项

> ⚠️ **注意**：
> - 脚本需要 ScriptUI 支持，AE CC 2018+ 完全兼容
> - `solid.preset` 文件会自动创建，无需手动创建
> - 预设数据保存在脚本同目录下，重装AE后可能需要重新配置
> - 自定义预设会自动保存，内置预设不会被写入文件
> - 颜色值为 0-1 范围的RGB值，与AE内部格式一致
> - 面板可调整大小，但最小尺寸由控件决定

## 常见问题

### Q: 预设没有保存？

**A:** 检查 `solid.preset` 文件是否有写入权限。确保脚本目录可写，预设会在修改后500ms自动保存。

### Q: 颜色显示不正确？

**A:** 确保使用左键点击选择颜色，右键会打开高级颜色选择器。批量操作需要配合快捷键使用。

### Q: 面板打不开？

**A:** 检查AE版本是否支持ScriptUI（CC 2018+）。如果是面板模式，可能需要在 Window 菜单中找到脚本。

### Q: 如何导入其他预设？

**A:** 将其他 `solid.preset` 文件复制到脚本目录，重启脚本即可加载。注意会覆盖当前预设。

### Q: 预设文件损坏怎么办？

**A:** 删除 `solid.preset` 文件，重启脚本会自动创建默认预设。

### Q: 为什么尺寸输入框显示的值不对？

**A:** 检查是否启用了宽高比锁定。解锁后可以自由输入任意尺寸。

### Q: 参考图层是什么？如何创建？

**A:** 参考图层（Guide Layer）是不会被渲染输出的图层，适合用作对齐参考或设计辅助。右键点击"确定"按钮即可创建参考图层。

### Q: 为什么每次打开脚本，尺寸都会自动变成当前合成尺寸？

**A:** 这是智能默认行为。脚本会自动应用当前活动合成的尺寸作为默认值，方便快速创建。但您之前保存的颜色、预设等设置都会被保留。

### Q: 如何禁用智能默认行为？

**A:** 目前不支持禁用智能默认行为。这是设计上为了提供更好的用户体验而实现的特性。

### Q: 批量随机化颜色会影响灰度色块吗？

**A:** 不会。批量随机化色相和恢复默认颜色功能都会跳过灰度色块（黑色、白色、深灰色），只影响彩色块。

### Q: 为什么内置预设不会被写入 solid.preset 文件？

**A:** 这是为了保持 `solid.preset` 文件的简洁性。内置预设已经硬编码在脚本中，无需重复保存。文件中只保存用户自定义的预设。

## 更新日志

### v1.3 (2025-09-12)

**新增功能：**
- 参考图层支持：右键点击"确定"按钮创建参考图层（Guide Layer）
- 智能默认行为：自动应用合理的默认设置（名称、尺寸、预设）
- 批量颜色操作：Ctrl+左键随机化色相，Alt+左键恢复默认颜色
- 宽高比锁定记忆：自动保存锁定状态和宽高比值

**优化改进：**
- 优化预设保存逻辑，内置预设不再写入文件
- 改进尺寸预设选择逻辑，自动切换到"自定义"选项
- 增强颜色选择器功能，支持RGB值精确输入
- 优化UI布局，提升响应式体验

**Bug修复：**
- 修复自定义尺寸预设选择后不更新的问题
- 修复名称预设双向绑定不一致的问题

### v1.0.0 (初始版本)

**核心功能：**
- 完整的UI面板实现
- 预设管理系统（名称预设、尺寸预设）
- 智能记忆功能
- 高级颜色选择器集成
- 宽高比锁定功能
- 使用合成大小功能

## 相关脚本

- [添加到渲染队列](./add-to-render-queue)
- [图层分析工具](./layer-analysis)
- [旋转适配工具集](./rotate-and-fit)
- [AE脚本开发完全指南](./ae-script-guide)