# 图片资源管理

## 核心规则

### 目录结构

文档同级目录创建 `assets/` 目录：

```
public/content/{模块类型}/
├── document.md
└── assets/
    └── image.png
```

### 引用规则

**必须使用相对路径：**

```markdown
![描述](./assets/filename.png)
```

### 命名规则

使用小写字母和连字符：

```
✅ main-interface.png
✅ step-1-install.png
❌ MainInterface.png
❌ image1.png
```

## 常见问题

**Q: 图片显示不出来？**

检查：
- 路径是否正确（`./assets/`）
- 文件名是否正确
- assets 目录是否存在