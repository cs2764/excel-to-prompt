# Contributing to Excel Prompt Generator

[English](#english) | [中文](#中文)

---

## English

Thank you for your interest in contributing to Excel Prompt Generator! This document provides guidelines for contributing to the project.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/excel-prompt-generator.git
   cd excel-prompt-generator
   ```
3. **Open `index.html`** in your browser to test the application

### Development Setup

No build process required! This is a pure frontend application:

- **HTML**: `index.html` - Main application interface
- **JavaScript**: `app.js` - Core application logic
- **CSS**: `styles.css`, `custom_hide.css`, `ui_improvements.css` - Styling
- **Dependencies**: Only SheetJS library (`libs/xlsx.full.min.js`)

### Code Style Guidelines

#### JavaScript
- Use ES6+ features (const/let, arrow functions, template literals)
- Follow camelCase naming convention
- Add JSDoc comments for functions
- Keep all logic in the `ExcelPromptGenerator` class
- Use meaningful variable and function names

#### HTML
- Use semantic HTML elements
- Follow accessibility best practices
- Use camelCase for IDs
- Include proper ARIA labels where needed

#### CSS
- Use kebab-case for class names
- Group related styles together
- Comment major sections
- Maintain responsive design principles

### Making Changes

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the code style guidelines

3. **Test thoroughly**:
   - Test with different Excel files
   - Test all UI interactions
   - Test in multiple browsers (Chrome, Edge, Firefox)
   - Verify offline functionality

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

### Types of Contributions

#### Bug Reports
- Use the issue template
- Include browser version and OS
- Provide steps to reproduce
- Include sample Excel files if relevant

#### Feature Requests
- Describe the use case
- Explain the expected behavior
- Consider backward compatibility

#### Code Contributions
- Bug fixes
- New features
- Performance improvements
- Documentation updates
- UI/UX enhancements

### Testing Guidelines

Since this is a frontend-only application:

1. **Manual Testing**:
   - Test with various Excel file formats
   - Test with different data sizes
   - Test all user interactions
   - Verify prompt generation accuracy

2. **Browser Testing**:
   - Chrome (latest)
   - Edge (latest)
   - Firefox (latest)
   - Safari (if available)

3. **Offline Testing**:
   - Disconnect internet after loading
   - Verify all functionality works offline

### Documentation

- Update README.md for new features
- Add comments to complex code sections
- Update CHANGELOG.md for releases
- Maintain bilingual documentation (English/Chinese)

### Questions?

Feel free to open an issue for questions or discussions about contributing.

---

## 中文

感谢您对 Excel Prompt Generator 项目的贡献兴趣！本文档提供了项目贡献指南。

### 开始贡献

1. **Fork 仓库** 到您的 GitHub 账户
2. **克隆到本地**:
   ```bash
   git clone https://github.com/your-username/excel-prompt-generator.git
   cd excel-prompt-generator
   ```
3. **打开 `index.html`** 在浏览器中测试应用

### 开发环境

无需构建过程！这是一个纯前端应用：

- **HTML**: `index.html` - 主应用界面
- **JavaScript**: `app.js` - 核心应用逻辑
- **CSS**: `styles.css`, `custom_hide.css`, `ui_improvements.css` - 样式
- **依赖**: 仅 SheetJS 库 (`libs/xlsx.full.min.js`)

### 代码风格指南

#### JavaScript
- 使用 ES6+ 特性 (const/let, 箭头函数, 模板字符串)
- 遵循 camelCase 命名约定
- 为函数添加 JSDoc 注释
- 将所有逻辑保持在 `ExcelPromptGenerator` 类中
- 使用有意义的变量和函数名

#### HTML
- 使用语义化 HTML 元素
- 遵循无障碍最佳实践
- ID 使用 camelCase
- 在需要的地方包含适当的 ARIA 标签

#### CSS
- 类名使用 kebab-case
- 将相关样式分组
- 为主要部分添加注释
- 保持响应式设计原则

### 提交更改

1. **创建功能分支**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **按照代码风格指南进行更改**

3. **充分测试**:
   - 使用不同的 Excel 文件测试
   - 测试所有 UI 交互
   - 在多个浏览器中测试 (Chrome, Edge, Firefox)
   - 验证离线功能

4. **提交更改**:
   ```bash
   git add .
   git commit -m "Add: 更改的简要描述"
   ```

5. **推送到您的 fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **在 GitHub 上创建 Pull Request**

### 贡献类型

#### Bug 报告
- 使用问题模板
- 包含浏览器版本和操作系统
- 提供重现步骤
- 如相关，包含示例 Excel 文件

#### 功能请求
- 描述使用场景
- 解释预期行为
- 考虑向后兼容性

#### 代码贡献
- Bug 修复
- 新功能
- 性能改进
- 文档更新
- UI/UX 增强

### 测试指南

由于这是一个纯前端应用：

1. **手动测试**:
   - 使用各种 Excel 文件格式测试
   - 测试不同数据大小
   - 测试所有用户交互
   - 验证提示词生成准确性

2. **浏览器测试**:
   - Chrome (最新版)
   - Edge (最新版)
   - Firefox (最新版)
   - Safari (如可用)

3. **离线测试**:
   - 加载后断开网络连接
   - 验证所有功能离线工作

### 文档

- 为新功能更新 README.md
- 为复杂代码段添加注释
- 为发布更新 CHANGELOG.md
- 维护双语文档 (英文/中文)

### 有问题？

欢迎开启 issue 讨论贡献相关问题。