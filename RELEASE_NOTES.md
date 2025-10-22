# Release Notes - Excel Prompt Generator v1.0

## 🎉 首次开源发布 - Initial Open Source Release

**发布日期**: 2025年10月21日  
**版本**: 1.0  
**许可证**: MIT License

---

## 📖 项目简介 - Project Overview

Excel Prompt Generator 是一个纯前端的Excel数据提示词生成工具。它能够将Excel数据转换为结构化的AI提示词，完全离线运行，无需服务器或API调用。

Excel Prompt Generator is a pure frontend tool that converts Excel data into structured AI prompts. It operates completely offline with no server requirements or API calls.

---

## ✨ 核心特性 - Key Features

### 🖥️ 纯前端架构 - Pure Frontend Architecture
- 无需服务器，完全在浏览器中运行
- 基于HTML5、CSS3、JavaScript (ES6+)
- 仅依赖SheetJS库进行Excel处理

### 🔒 数据安全与隐私 - Data Security & Privacy
- **完全离线运行** - 加载后无需网络连接
- **数据不离开本地** - 所有处理在浏览器中完成
- **无数据收集** - 不收集任何用户数据或使用统计
- **开源透明** - 所有代码公开可审查

### 📊 Excel数据处理 - Excel Data Processing
- 支持.xlsx格式文件 (最大10MB)
- 灵活的列选择和数据筛选
- 基于ID的记录分组功能
- 实时数据预览

### 🤖 智能提示词生成 - Intelligent Prompt Generation
- 自定义系统提示词配置
- 支持最多3个用户问题
- 批量生成多种提示词格式
- Markdown格式数据表格

### 🌐 国际化支持 - Internationalization
- 完整的双语界面 (英文/中文)
- 双语文档和帮助说明
- 本地化的用户体验

### 📱 现代化界面 - Modern Interface
- 响应式设计，支持桌面和移动设备
- 直观的双标签页界面
- 实时进度监控
- 友好的错误提示

---

## 🚀 快速开始 - Quick Start

### 1️⃣ 获取项目 - Get the Project
```bash
git clone https://github.com/excel-prompt-generator/excel-prompt-generator.git
cd excel-prompt-generator
```

### 2️⃣ 启动应用 - Launch Application
直接在浏览器中打开 `index.html` 文件即可开始使用。

Simply open `index.html` in your browser to start using the application.

### 3️⃣ 使用流程 - Usage Workflow
1. 上传Excel文件 (.xlsx格式)
2. 选择工作表和数据列
3. 配置ID分组和筛选条件
4. 设置提示词模板和问题
5. 生成并下载结果文件

---

## 📋 系统要求 - System Requirements

### 浏览器支持 - Browser Support
- ✅ Chrome 90+
- ✅ Edge 90+  
- ✅ Firefox 88+
- ✅ Safari 14+
- ❌ Internet Explorer (不支持)

### 系统兼容性 - System Compatibility
- Windows 10/11
- macOS 10.15+
- Linux (现代发行版)
- 无需安装任何软件

### 性能要求 - Performance Requirements
- 内存: 建议4GB以上
- 存储: 约2MB项目文件
- 网络: 仅首次加载需要 (之后完全离线)

---

## 📁 项目结构 - Project Structure

```
excel-prompt-generator/
├── index.html              # 主应用程序
├── app.js                  # 核心JavaScript逻辑
├── styles.css              # 主样式文件
├── libs/xlsx.full.min.js   # Excel处理库
├── prompts/                # 提示词配置
├── README.md               # 项目文档
├── LICENSE                 # MIT许可证
└── docs/                   # 技术文档
```

---

## 🔧 技术规格 - Technical Specifications

### 架构设计 - Architecture
- **类型**: 单页应用 (SPA)
- **框架**: 原生JavaScript (无框架依赖)
- **数据处理**: 客户端处理，无服务器通信
- **存储**: 浏览器localStorage (仅用户配置)

### 核心技术 - Core Technologies
- **前端**: HTML5, CSS3, JavaScript ES6+
- **Excel处理**: SheetJS (xlsx.js)
- **文件操作**: FileReader API, Blob API
- **数据存储**: localStorage API

### 安全特性 - Security Features
- 无外部网络请求 (加载后)
- 输入数据验证和清理
- 无代码注入风险
- 开源代码可审查

---

## 📚 文档资源 - Documentation Resources

### 用户文档 - User Documentation
- [README.md](README.md) - 完整使用指南
- [快速开始指南](快速开始.txt) - 中文快速入门
- [输出格式说明](输出格式说明.txt) - 输出文件格式详解

### 技术文档 - Technical Documentation  
- [SYSTEM_DOCUMENTATION.md](SYSTEM_DOCUMENTATION.md) - 系统架构文档
- [CONTRIBUTING.md](CONTRIBUTING.md) - 贡献指南
- [CHANGELOG.md](CHANGELOG.md) - 版本更新历史

---

## 🤝 贡献与支持 - Contributing & Support

### 如何贡献 - How to Contribute
1. Fork 项目仓库
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

详细指南请参考 [CONTRIBUTING.md](CONTRIBUTING.md)

### 问题反馈 - Issue Reporting
- GitHub Issues: 报告Bug和功能请求
- 讨论区: 技术讨论和使用问题

### 社区支持 - Community Support
- 开源社区驱动
- 欢迎贡献代码、文档、翻译
- 遵循行为准则，友好协作

---

## 📄 许可证 - License

本项目采用 [MIT License](LICENSE) 开源许可证。

This project is licensed under the [MIT License](LICENSE).

### 许可证要点 - License Highlights
- ✅ 商业使用 - Commercial use
- ✅ 修改 - Modification  
- ✅ 分发 - Distribution
- ✅ 私人使用 - Private use
- ❗ 责任限制 - Limited liability
- ❗ 无担保 - No warranty

---

## 🎯 未来规划 - Future Roadmap

### 短期计划 - Short Term
- [ ] 更多Excel格式支持 (.xls)
- [ ] CSV导入/导出功能
- [ ] 提示词模板管理
- [ ] 批量文件处理

### 长期愿景 - Long Term
- [ ] 插件架构支持
- [ ] 数据可视化功能
- [ ] 移动端优化
- [ ] 多语言扩展

---

## 🙏 致谢 - Acknowledgments

感谢以下开源项目和社区的支持：

- [SheetJS](https://sheetjs.com/) - Excel文件处理
- 开源社区的宝贵建议和反馈
- 所有测试用户和贡献者

---

**项目主页**: https://github.com/excel-prompt-generator/excel-prompt-generator  
**发布时间**: 2025年10月21日  
**维护团队**: Excel Prompt Generator Team