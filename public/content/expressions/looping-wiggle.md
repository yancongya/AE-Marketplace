---
title: 平滑循环抖动表达式
iconEmoji: 🌊
author: 烟囱鸭
tags: [表达式, 抖动, 循环, 动画]
description: 创建无缝循环的平滑抖动动画效果
updatedAt: 2026-02-05
---

## 表达式代码

```javascript
// 点击复制
freq = 1;
amp = 10;
loopTime = 3;
t = time % loopTime;
wiggle1 = wiggle(freq, amp, 1, 0.5, t);
wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
[a,a]
```

## 使用场景

- **Logo 动画**：创建持续摆动的 Logo 效果
- **背景元素**：让背景元素保持轻微的动态感
- **文字效果**：为文字添加自然的呼吸感
- **UI 动效**：界面元素的微妙震动反馈
- **粒子运动**：粒子的自然漂移效果

## 原理分析

### 工作原理

这个表达式通过以下步骤实现平滑循环抖动：

1. **时间计算**：使用 `time % loopTime` 获取当前循环内的时间位置
2. **双重抖动**：计算当前周期和下一个周期的 wiggle 值
3. **线性插值**：使用 `linear()` 函数在两个周期之间平滑过渡
4. **无缝循环**：确保循环结束时与开始时的状态完美衔接

### 关键参数

| 参数 | 类型 | 说明 | 推荐值 |
|------|------|------|--------|
| freq | number | 抖动频率（每秒次数） | 0.5 - 3 |
| amp | number | 抖动振幅（像素） | 5 - 50 |
| loopTime | number | 循环周期（秒） | 2 - 10 |
| octaves | number | 噪声细节层级 | 1 - 4 |
| amp_mult | number | 振幅倍数 | 0.3 - 0.8 |

### 核心函数解析

**wiggle(freq, amp, octaves, amp_mult, t)**
- `freq`：抖动频率
- `amp`：抖动振幅
- `octaves`：噪声细节（值越大越复杂）
- `amp_mult`：振幅倍数（控制细节程度）
- `t`：时间偏移（用于计算不同周期的值）

**linear(t, tMin, tMax, value1, value2)**
- 在 `tMin` 到 `tMax` 之间，根据 `t` 的位置在 `value1` 和 `value2` 之间线性插值
- 实现两个周期之间的平滑过渡

## 实用示例

### 示例 1：轻微呼吸效果

```javascript
freq = 0.5;
amp = 5;
loopTime = 4;
t = time % loopTime;
wiggle1 = wiggle(freq, amp, 1, 0.5, t);
wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
[a,a]
```

**效果：** 缓慢、柔和的呼吸感

### 示例 2：快速震动效果

```javascript
freq = 2.5;
amp = 15;
loopTime = 2;
t = time % loopTime;
wiggle1 = wiggle(freq, amp, 1, 0.5, t);
wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
[a,a]
```

**效果：** 快速、有活力的震动

### 示例 3：复杂细节抖动

```javascript
freq = 1.5;
amp = 20;
loopTime = 5;
t = time % loopTime;
wiggle1 = wiggle(freq, amp, 3, 0.6, t);
wiggle2 = wiggle(freq, amp, 3, 0.6, t - loopTime);
a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
[a,a]
```

**效果：** 更复杂、更有细节的抖动

## 应用技巧

### 1. 控制抖动方向

如果只想在某个方向抖动：

```javascript
// 仅 X 轴抖动
freq = 1;
amp = 10;
loopTime = 3;
t = time % loopTime;
wiggle1 = wiggle(freq, amp, 1, 0.5, t);
wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
[value[0] + a, value[1]]
```

### 2. 添加延迟启动

```javascript
startTime = 2;  // 2秒后开始
if (time < startTime) {
  value
} else {
  t = (time - startTime) % loopTime;
  wiggle1 = wiggle(freq, amp, 1, 0.5, t);
  wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
  a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
  [a,a]
}
```

### 3. 淡入淡出

```javascript
fadeInDuration = 1;
fadeOutDuration = 1;
totalDuration = loopTime + fadeInDuration + fadeOutDuration;

if (time < fadeInDuration) {
  // 淡入阶段
  progress = time / fadeInDuration;
  amp * easeOut(progress) * wiggle(freq, 1, 1, 0.5, time)[0]
} else if (time < fadeInDuration + loopTime) {
  // 正常抖动
  t = (time - fadeInDuration) % loopTime;
  wiggle1 = wiggle(freq, amp, 1, 0.5, t);
  wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
  a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
  [a,a]
} else if (time < totalDuration) {
  // 淡出阶段
  progress = (time - fadeInDuration - loopTime) / fadeOutDuration;
  amp * (1 - easeIn(progress)) * wiggle(freq, 1, 1, 0.5, time)[0]
} else {
  value
}
```

## 常见问题

### Q: 为什么普通 wiggle 不能循环？

**A:** 普通的 wiggle() 函数使用随机噪声，每次循环都会产生不同的随机值，导致循环时不连续。本表达式通过预计算下一个周期的值并使用线性插值，确保循环的连贯性。

### Q: 如何调整抖动的随机性？

**A:** 调整 `octaves` 和 `amp_mult` 参数：
- 降低 `octaves`（如 1）：更简单、更规律的抖动
- 提高 `octaves`（如 3-4）：更复杂、更随机的抖动
- 降低 `amp_mult`（如 0.3）：细节更少
- 提高 `amp_mult`（如 0.8）：细节更多

### Q: 循环时间应该如何选择？

**A:** 根据应用场景选择：
- **背景元素**：5-10 秒（缓慢、不引人注意）
- **Logo 动画**：3-5 秒（中等节奏）
- **UI 反馈**：1-2 秒（快速响应）
- **粒子效果**：2-4 秒（自然漂移）

### Q: 可以用于旋转属性吗？

**A:** 可以！只需调整输出格式：

```javascript
// 用于旋转属性
freq = 1;
amp = 10;  // 角度（度）
loopTime = 3;
t = time % loopTime;
wiggle1 = wiggle(freq, amp, 1, 0.5, t);
wiggle2 = wiggle(freq, amp, 1, 0.5, t - loopTime);
a=linear(t, 0,  loopTime, wiggle1, wiggle2)[0];
value + a
```

## 注意事项

> ⚠️ **性能考虑**：复杂的抖动（高 octaves）可能会增加渲染时间，建议根据实际需求调整参数

> 💡 **预览优化**：在调整参数时，降低预览分辨率可以提高性能

> ⚠️ **循环同步**：确保多个图层使用相同的 `loopTime` 以保持同步

## 相关表达式

- [自动关键帧](./auto-keyframe)
- [高级指南](./advanced-guide)