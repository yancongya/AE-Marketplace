---
title: AE脚本开发完全指南
iconEmoji: 📚
author: 烟囱鸭
tags: [教程, 高级, 脚本开发, JavaScript]
category: getting-started
description: 完整的AE脚本开发教程，从入门到精通
updatedAt: 2026-02-05
---
# AE脚本开发完全指南

本指南将带你从零开始学习 After Effects 脚本开发。


## 基础概念

AE脚本使用 **JavaScript** 或 **ExtendScript** 编写，可以访问 After Effects 的完整 API。

> **提示**：建议使用 ESTK 进行调试，它提供了专业的调试环境。

### 主要特性

| 特性     | 说明             |
| -------- | ---------------- |
| 自动化   | 批量处理重复任务 |
| 自定义UI | 创建自定义界面   |
| 插件集成 | 与第三方插件交互 |

---

## 流程图示例

```mermaid
graph TD
    A[开始脚本] --> B{检查AE版本}
    B -->|版本过低| C[显示错误提示]
    B -->|版本正常| D[获取选中图层]
    D --> E{有选中图层?}
    E -->|否| F[提示用户选择]
    E -->|是| G[应用效果]
    G --> H[渲染输出]
    H --> I[结束]
```

---

## 时序图示例

```mermaid
sequenceDiagram
    participant User as 用户
    participant UI as 脚本界面
    participant AE as After Effects
    participant Render as 渲染引擎

    User->>UI: 点击运行按钮
    UI->>AE: 获取项目信息
    AE-->>UI: 返回项目数据
    UI->>User: 显示配置界面
    User->>UI: 设置参数
    UI->>AE: 执行脚本命令
    AE->>Render: 开始渲染
    Render-->>UI: 进度更新
    UI-->>User: 显示进度
    Render-->>AE: 渲染完成
    AE-->>User: 导出文件
```

---

## 状态图示例

```mermaid
stateDiagram-v2
    [*] --> 空闲
    空闲 --> 运行中: 开始执行
    运行中 --> 暂停: 用户暂停
    暂停 --> 运行中: 继续执行
    运行中 --> 错误: 发生异常
    错误 --> 空闲: 重置
    运行中 --> 完成: 任务结束
    完成 --> [*]
```

---

## 类图示例

```mermaid
classDiagram
    class AEScript {
        +string name
        +string version
        +string author
        +execute() void
        +validate() boolean
    }

    class LayerController {
        +getSelectedLayers() Layer[]
        +applyEffect(effect: Effect) void
        +setKeyframes(prop: Property) void
    }

    class RenderManager {
        +queue: RenderItem[]
        +addToQueue(item: RenderItem) void
        +startRender() void
    }

    class Effect {
        +string name
        +params: Object
        +apply(target: Layer) void
    }

    AEScript --> LayerController: 使用
    AEScript --> RenderManager: 使用
    LayerController --> Effect: 应用
    RenderManager --> Effect: 包含
```

---

## ER图示例

```mermaid
erDiagram
    SCRIPT ||--o{ TAG : 包含
    SCRIPT ||--o{ EFFECT : 包含
    SCRIPT }|--|| AUTHOR : 编写
    LAYER ||--o{ EFFECT : 应用

    SCRIPT {
        string id PK
        string title
        string description
        string author
        date created_at
        date updated_at
    }

    TAG {
        string id PK
        string name
    }

    EFFECT {
        string id PK
        string name
        json parameters
    }

    LAYER {
        string id PK
        string name
        string type
    }

    AUTHOR {
        string id PK
        string name
        string email
    }
```

---

## 甘特图示例

```mermaid
gantt
    title AE脚本开发项目计划
    dateFormat YYYY-MM-DD
    section 基础框架
    项目初始化       :a1, 2026-02-01, 7d
    核心模块开发     :a2, after a1, 14d
    section UI开发
    界面设计         :b1, 2026-02-08, 5d
    交互实现         :b2, after b1, 10d
    section 测试
    单元测试         :c1, after a2, 7d
    集成测试         :c2, after b2, 7d
    section 发布
    文档编写         :d1, after c1, 5d
    版本发布         :d2, after c2, 2d
```

---

## 饼图示例

```mermaid
pie title 脚本类型分布
    "动画脚本" : 35
    "效果脚本" : 25
    "导出脚本" : 20
    "工具脚本" : 15
    "UI扩展" : 5
```

---

## 代码示例

### 基础模板

```javascript
// AE脚本基础模板
(function() {
    // 检查运行环境
    if (app.project === undefined) {
        alert("请先打开一个项目");
        return;
    }

    // 主逻辑
    function main() {
        var selectedLayers = app.project.activeItem.selectedLayers;
        if (selectedLayers.length === 0) {
            alert("请先选择图层");
            return;
        }

        // 处理选中的图层
        for (var i = 0; i < selectedLayers.length; i++) {
            processLayer(selectedLayers[i]);
        }
    }

    function processLayer(layer) {
        // 具体的图层处理逻辑
        $.writeln("处理图层: " + layer.name);
    }

    // 执行主函数
    main();
})();
```

### 高级用法

```javascript
// 使用ES6语法 (需要CC 2019+)
class AEScript {
    constructor(config) {
        this.config = config;
        this.version = '1.0.0';
    }

    async execute() {
        try {
            await this.validate();
            const result = await this.run();
            return result;
        } catch (error) {
            this.handleError(error);
        }
    }

    async validate() {
        const version = parseFloat(app.version);
        if (version < 16.0) {
            throw new Error('需要AE 16.0或更高版本');
        }
    }
}
```

---

## 总结

本教程涵盖了：

1. **流程图** - 展示程序逻辑
2. **时序图** - 描述交互过程
3. **状态图** - 建模状态转换
4. **类图** - 设计面向对象结构
5. **ER图** - 规划数据模型
6. **甘特图** - 项目进度管理
7. **饼图** - 数据可视化

> **下一步**：尝试创建你自己的第一个 AE 脚本！

---

*最后更新: 2026-02-05*
