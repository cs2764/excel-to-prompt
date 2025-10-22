# Excel Prompt Generator

[中文文档](#中文文档) | [English Documentation](#english-documentation)

---

## English Documentation

### Overview

Excel Prompt Generator is a pure frontend tool for generating AI prompts from Excel data. It operates completely offline with no server requirements or API calls.

### Key Features

- ✅ **Pure Frontend**: No server required, runs entirely in browser
- ✅ **Offline Operation**: No internet connection needed after loading
- ✅ **Zero Installation**: Simply open HTML file to start
- ✅ **Excel Processing**: Import and process .xlsx files
- ✅ **Flexible Data Selection**: Choose columns, filter rows, group by ID
- ✅ **Custom Prompts**: Configure system prompts and user questions
- ✅ **Batch Generation**: Generate prompts for multiple records
- ✅ **Excel Export**: Download results with original data + generated prompts

### Quick Start

#### 1. Launch Application

Open `index.html` directly in your browser.

**Recommended Browsers**: Chrome, Edge, Firefox (latest versions)

#### 2. Usage Workflow

**Step 1: Upload Excel File**

1. Click "Choose File" or drag & drop Excel file
2. Supports `.xlsx` format (max 10MB)
3. Select worksheet to process

**Step 2: Configure Data Processing**

1. **Column Selection**: Check columns to include in output
2. **ID Column**: Select column for grouping records
3. **ID Filtering**: Choose which IDs to process
4. **Prompt Data Columns**: Select columns to include in prompts
5. **Row Filters** (optional): Add conditions to filter data rows

**Step 3: Configure Prompts**

1. Switch to "Prompt Settings" tab
2. **System Prompt**: Set system-level prompt (optional)
3. **User Questions**: Configure up to 3 questions
4. Settings auto-save to browser storage

**Step 4: Generate Prompts**

1. Return to "Data Processing" tab
2. Verify all settings
3. Click "📝 Generate Prompts"
4. Wait for processing completion
5. Download generated Excel file

### Output Format

#### File Naming

```
<original_filename>_prompt_<YYYYMMDD_HHMMSS>.xlsx
```

Example: `medical_data_prompt_20251021_143045.xlsx`

#### File Contents

The output Excel file contains:

1. **Original Data Columns**: All source data preserved
2. **Prompt Columns** (based on configured questions):
   - `Prompt_Q1`: Question 1 + data (no system prompt)
   - `Prompt_Q2`: Question 2 + data (no system prompt)
   - `Prompt_Q3`: Question 3 + data (no system prompt)
   - `Prompt_Full_Q1`: System prompt + Question 1 + data
   - `Prompt_Full_Q2`: System prompt + Question 2 + data
   - `Prompt_Full_Q3`: System prompt + Question 3 + data

### Project Structure

```
excel-prompt-generator/
├── index.html              # Main application
├── app.js                  # Application logic
├── styles.css              # Main styles
├── custom_hide.css         # Custom styles
├── ui_improvements.css     # UI enhancements
├── README.md               # This documentation
├── libs/
│   └── xlsx.full.min.js    # SheetJS Excel library
├── prompts/
│   ├── system_prompt.txt   # System prompt template
│   └── questions.json      # User questions config
└── output/                 # Output files (optional)
```

### Prompt Configuration

#### System Prompt

Configure in "Prompt Settings" tab. Added to "Full" version prompts.

#### User Questions

Configure up to 3 questions in JSON format:

```json
{
  "question1": "First question",
  "question2": "Second question",
  "question3": "Third question (optional)"
}
```

### Technical Specifications

- **Frontend**: Pure HTML + CSS + JavaScript (ES6+)
- **Excel Processing**: SheetJS (xlsx.js)
- **Architecture**: Single-page application, no backend
- **Compatibility**: Modern browsers (Chrome 90+, Edge 90+, Firefox 88+)
- **Data Security**: All processing local, no data transmission

### Browser Compatibility

✅ Chrome 90+  
✅ Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
❌ Internet Explorer (not supported)

### Version Information

**Version**: 1.0  
**Release Date**: October 21, 2025  
**License**: MIT License

---

## 中文文档

### 项目概述

Excel Prompt Generator 是一个纯前端的 Excel 数据提示词生成工具，完全离线运行，无需服务器或 API 调用。

### 核心特性

- ✅ **纯前端实现**：无需服务器，完全在浏览器中运行
- ✅ **离线操作**：加载后无需网络连接
- ✅ **免安装**：直接打开 HTML 文件即可使用
- ✅ **Excel 处理**：导入和处理.xlsx 文件
- ✅ **灵活数据选择**：选择列、筛选行、按 ID 分组
- ✅ **自定义提示词**：配置系统提示词和用户问题
- ✅ **批量生成**：为多条记录生成提示词
- ✅ **Excel 导出**：下载包含原始数据和生成提示词的结果

### 快速开始

#### 1. 启动应用

直接在浏览器中打开 `index.html` 文件。

**推荐浏览器**：Chrome、Edge、Firefox（最新版本）

#### 2. 使用流程

**第一步：上传 Excel 文件**

1. 点击"Choose File"或拖拽 Excel 文件
2. 支持 `.xlsx` 格式（最大 10MB）
3. 选择要处理的工作表

**第二步：配置数据处理**

1. **列选择**：勾选要包含在输出中的列
2. **ID 列**：选择用于分组记录的列
3. **ID 筛选**：选择要处理的 ID
4. **提示词数据列**：选择要包含在提示词中的列
5. **行筛选**（可选）：添加条件筛选数据行

**第三步：配置提示词**

1. 切换到"Prompt Settings"标签页
2. **系统提示词**：设置系统级提示词（可选）
3. **用户问题**：配置最多 3 个问题
4. 设置自动保存到浏览器存储

**第四步：生成提示词**

1. 返回"Data Processing"标签页
2. 验证所有设置
3. 点击"📝 Generate Prompts"
4. 等待处理完成
5. 下载生成的 Excel 文件

### 输出格式

#### 文件命名

```
<原文件名>_prompt_<YYYYMMDD_HHMMSS>.xlsx
```

示例：`medical_data_prompt_20251021_143045.xlsx`

#### 文件内容

输出的 Excel 文件包含：

1. **原始数据列**：保留所有源数据
2. **提示词列**（基于配置的问题）：
   - `Prompt_Q1`：问题 1 + 数据（不含系统提示词）
   - `Prompt_Q2`：问题 2 + 数据（不含系统提示词）
   - `Prompt_Q3`：问题 3 + 数据（不含系统提示词）
   - `Prompt_Full_Q1`：系统提示词 + 问题 1 + 数据
   - `Prompt_Full_Q2`：系统提示词 + 问题 2 + 数据
   - `Prompt_Full_Q3`：系统提示词 + 问题 3 + 数据

### 项目结构

```
excel-prompt-generator/
├── index.html              # 主应用程序
├── app.js                  # 应用逻辑
├── styles.css              # 主样式
├── custom_hide.css         # 自定义样式
├── ui_improvements.css     # UI增强
├── README.md               # 本文档
├── libs/
│   └── xlsx.full.min.js    # SheetJS Excel库
├── prompts/
│   ├── system_prompt.txt   # 系统提示词模板
│   └── questions.json      # 用户问题配置
└── output/                 # 输出文件（可选）
```

### 提示词配置

#### 系统提示词

在"Prompt Settings"标签页配置，添加到"Full"版本提示词中。

#### 用户问题

配置最多 3 个问题，JSON 格式：

```json
{
  "question1": "第一个问题",
  "question2": "第二个问题",
  "question3": "第三个问题（可选）"
}
```

### 技术规格

- **前端技术**：纯 HTML + CSS + JavaScript (ES6+)
- **Excel 处理**：SheetJS (xlsx.js)
- **架构**：单页应用，无后端
- **兼容性**：现代浏览器（Chrome 90+, Edge 90+, Firefox 88+）
- **数据安全**：所有处理本地化，无数据传输

### 浏览器兼容性

✅ Chrome 90+  
✅ Edge 90+  
✅ Firefox 88+  
✅ Safari 14+  
❌ Internet Explorer（不支持）

### 版本信息

**版本**：1.0  
**发布日期**：2025 年 10 月 21 日  
**许可证**：MIT 许可证

### 常见问题

**Q: 程序无法打开？**  
A: 确保使用现代浏览器（Chrome/Edge/Firefox），不要使用 IE 浏览器。

**Q: 无法加载提示词文件？**  
A: 确保 `prompts/` 文件夹中存在配置文件，或在 Prompt Settings 标签页重新配置。

**Q: 生成的 Excel 文件无法打开？**  
A: 检查是否安装了 Excel 或 WPS Office 等电子表格软件。

**Q: 如何在多台电脑上使用？**  
A: 直接复制整个项目文件夹到其他电脑即可，无需安装。

### 数据安全

- 所有数据处理在本地浏览器完成
- 不上传任何数据到服务器
- 完全离线运行
- 源代码完全开源可审查

### 许可证

本项目采用 MIT 许可证开源发布。
