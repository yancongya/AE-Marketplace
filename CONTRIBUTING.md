# 贡献指南

感谢你考虑为 AE脚本市场做出贡献！

## 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. 先在 [Issues](https://github.com/example/ae-scripts-market/issues) 中搜索，确保该 bug 还没有被报告
2. 创建一个新的 issue，包含：
   - 清晰的标题
   - 复现步骤
   - 预期行为
   - 实际行为
   - 截图或录屏（如果可能）
   - 环境信息（操作系统、浏览器版本等）

### 提出新功能

如果你想提出新功能：

1. 先在 [Issues](https://github.com/example/ae-scripts-market/issues) 中搜索，确保该功能还没有被建议
2. 创建一个新的 issue，包含：
   - 清晰的功能描述
   - 使用场景
   - 实现建议（可选）

### 提交代码

#### 开发流程

1. **Fork 项目**
   ```bash
   # Fork 项目到你的 GitHub 账户
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/your-username/ae-scripts-market.git
   cd ae-scripts-market
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **进行开发**
   - 遵循代码规范
   - 添加必要的注释
   - 编写测试（如果有）

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加你的功能描述"
   ```

   **提交信息格式**：
   ```
   <type>(<scope>): <subject>
   
   <body>
   ```
   
   **Type 类型**：
   - `feat`: 新功能
   - `fix`: Bug 修复
   - `docs`: 文档更新
   - `style`: 代码格式调整
   - `refactor`: 重构
   - `perf`: 性能优化
   - `test`: 测试相关
   - `chore`: 构建/工具相关
   - `ci`: CI/CD 相关
   
   **Scope 范围**：
   - 组件名（如：`TabContent`, `Navbar`）
   - 功能模块（如：`markdown`, `theme`）
   
   **示例**：
   ```
   feat(TabContent): 添加代码块复制功能
   
   - 添加复制按钮
   - 添加 Toast 提示
   - 添加复制状态管理
   
   fix(mermaid): 修复图表主题切换问题
   - 优化主题配置更新逻辑
   ```

6. **推送更改**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 访问 [Pull Requests](https://github.com/example/ae-scripts-market/pulls)
   - 点击 "New Pull Request"
   - 选择你的分支和目标分支
   - 填写 PR 模板

#### PR 模板

```markdown
## 描述
简要描述这个 PR 的目的和实现的功能

## 类型
- [ ] Bug 修复
- [ ] 新功能
- [ ] 代码重构
- [ ] 文档更新
- [ ] 性能优化
- [ ] 其他

## 变更内容
列出主要的代码变更

## 测试
描述你如何测试这些更改

- [ ] 本地测试通过
- [ ] 添加了测试用例
- [ ] 所有测试通过

## 截图（如果适用）
添加相关截图

## 检查清单
- [ ] 代码遵循项目的代码规范
- [ ] 我已更新相关文档
- [ ] 我的更改不引入新的警告
- [ ] 我已测试这些更改
```

#### 代码审查

所有 PR 都需要经过代码审查。审查者会检查：

- 代码质量
- 功能正确性
- 代码风格一致性
- 是否有测试
- 文档是否更新

## 开发规范

### 代码风格

#### TypeScript
- 启用严格模式
- 使用明确的类型
- 避免使用 `any`
- 使用接口定义对象类型

```typescript
// ✅ 好的写法
interface Props {
  title: string;
  count?: number;
}

function Component({ title, count = 0 }: Props) {
  return <div>{title}: {count}</div>;
}

// ❌ 不好的写法
function Component(props: any) {
  return <div>{props.title}: {props.count}</div>;
}
```

#### React
- 使用函数组件
- 使用 Hooks
- 使用命名导出

```typescript
// ✅ 好的写法
export function MyComponent({ name }: { name: string }) {
  return <div>{name}</div>;
}

// ❌ 不好的写法
export default function() {
  return <div>...</div>;
}
```

#### 组件结构

```typescript
// 1. 导入
import { useState } from 'react';
import { Button } from '@/components/ui/button';

// 2. 类型定义
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. 组件定义
export function MyComponent({ title, onAction }: MyComponentProps) {
  // Hooks
  const [state, setState] = useState(null);

  // 渲染
  return <div>{title}</div>;
}
```

#### 样式规范

- 使用 Tailwind CSS 工具类
- 使用 `cn()` 函数合并类名
- 遵循标准类名顺序

```tsx
// ✅ 好的写法
<div className="flex items-center gap-4 p-4 bg-card rounded-lg">
  <span className="text-foreground font-medium">内容</span>
</div>

// ❌ 不好的写法
<div className="flex items-center p-4 bg-card rounded-lg gap-4">
  <span className="text-foreground font-medium">内容</span>
</div>
```

### 文档规范

#### 添加新文档

当添加新的 Markdown 文档时，请确保：

1. **Frontmatter 完整**
   ```markdown
   ---
   title: 文档标题
   iconEmoji: 🎯
   author: 作者名
   tags: [标签1, 标签2]
   category: 分类
   command: 命令
   description: 简短描述
   updatedAt: YYYY-MM-DD
   toc:
     - id: 标题id
       text: 标题文本
       level: 2
   ---
   ```

2. **内容质量**
   - 使用清晰的标题层级
   - 提供代码示例
   - 添加必要的图表
   - 编写清晰的说明

3. **图表使用**
   - 使用 Mermaid 绘制流程图
   - 确保图表语法正确
   - 添加必要的注释

### 测试规范

如果添加新功能，请确保：

- 添加相应的测试用例
- 测试覆盖主要功能路径
- 测试边界情况

## 提交规范

### Commit Message 规范

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

```
<type>(<scope>): <subject>

<body>
```

#### Type 类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI/CD 相关

#### Scope 范围

Scope 用于说明 commit 影响的范围，如：

- `TabContent`: TabContent 组件
- `mermaid`: Mermaid 图表功能
- `theme`: 主题相关
- `docs`: 文档

#### Subject 主题

Subject 是 commit 的简短描述，不超过 50 个字符，使用祈使句，首字母小写。

#### Body 正文

Body 是对 commit 的详细描述，可以包含多行，每行不超过 72 个字符。

#### 示例

```
feat(TabContent): 添加代码块复制功能

- 添加复制按钮到代码块头部
- 添加 Toast 提示
- 添加复制状态管理
- 添加快捷键支持（Ctrl/Cmd + C）

修复了 issue #123
```

## 开发环境设置

### 1. 克隆仓库

```bash
git clone https://github.com/example/ae-scripts-market.git
cd ae-scripts-market
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 运行测试

```bash
npm test
```

### 5. 运行代码检查

```bash
npm run lint
```

## 项目结构

了解项目结构有助于更好地贡献：

```
src/
├── components/         # React 组件
│   ├── ui/            # UI 组件（shadcn/radix）
│   ├── Navbar.tsx     # 导航栏
│   ├── TabContent.tsx  # 文档内容组件
│   ├── TabCard.tsx     # 卡片组件
│   └── ...
├── contexts/           # React Context
│   └── ThemeContext.tsx
├── lib/                # 工具函数
│   ├── content.ts      # 内容加载
│   └── utils.ts
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## 常见问题

### 1. 如何添加新的 Mermaid 图表类型？

在 `TabContent.tsx` 中的 `MermaidDiagram` 组件中，Mermaid 会自动处理所有支持的图表类型（graph、sequence、gantt、pie等）。

### 2. 如何添加新的代码语言支持？

`react-syntax-highlighter` 支持大多数编程语言。如果需要特殊支持，可以扩展 `SyntaxHighlighter` 组件。

### 3. 如何自定义主题？

主题在 `index.css` 中定义。可以修改 CSS 变量来调整颜色和其他样式。

### 4. 如何添加新的 UI 组件？

UI 组件基于 Radix UI 和 shadcn/ui。可以参考现有组件创建新组件。

## 获取帮助

如果你在贡献过程中遇到问题：

1. 查看项目文档
2. 搜索现有的 Issues
3. 提问时提供尽可能详细的信息
4. 在 Issue 中使用适当的标签

## 许可证

通过向本项目贡献代码，你同意你的贡献将根据 MIT 许可证进行许可。

## 致谢

感谢所有贡献者！

- 感谢 [shadcn/ui](https://ui.shadcn.com/) 提供 UI 组件
- 感谢 [Radix UI](https://www.radix-ui.com/) 提供无障碍组件
- 感谢 [Mermaid](https://mermaid.js.org/) 提供图表渲染
- 感谢所有测试者和用户提供反馈

---

**最后更新**: 2026-02-05
