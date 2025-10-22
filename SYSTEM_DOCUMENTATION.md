# System Documentation

[English](#english-documentation) | [中文文档](#中文文档)

---

## English Documentation

### Architecture Overview

Excel Prompt Generator is a pure frontend application built with vanilla JavaScript, HTML, and CSS. It operates entirely in the browser without requiring any backend services or external API calls.

#### Core Components

1. **ExcelPromptGenerator Class** (`app.js`)
   - Main application controller
   - Handles all data processing and UI interactions
   - Manages state and user interactions

2. **User Interface** (`index.html`)
   - Two-tab interface: Data Processing and Prompt Settings
   - Responsive design with comprehensive instructions
   - Progress monitoring and completion feedback

3. **Styling** (CSS files)
   - `styles.css`: Main application styles
   - `custom_hide.css`: Custom visibility controls
   - `ui_improvements.css`: Enhanced UI components

4. **External Dependencies**
   - SheetJS (`libs/xlsx.full.min.js`): Excel file processing

### Data Flow

```
Excel File Upload → Sheet Selection → Column Selection → ID Grouping → 
Data Filtering → Prompt Configuration → Batch Generation → Excel Export
```

#### Detailed Process Flow

1. **File Processing**
   - User uploads .xlsx file (max 10MB)
   - SheetJS parses file into JSON arrays
   - Worksheets populated in dropdown

2. **Data Configuration**
   - User selects columns for output
   - ID column chosen for record grouping
   - Specific IDs selected for processing
   - Data columns chosen for prompt inclusion

3. **Prompt Setup**
   - System prompt configuration (optional)
   - Up to 3 user questions configured
   - Settings auto-saved to localStorage

4. **Generation Process**
   - Records grouped by ID
   - Markdown tables generated for each ID
   - Multiple prompt variations created per ID
   - Excel output generated with original data + prompts

### State Management

The application maintains state through class properties:

#### Core Data State
```javascript
{
  workbook: null,              // Parsed Excel workbook
  currentData: null,           // Active sheet as JSON array
  filteredData: null,          // After filters applied
  groupedData: Map(),          // Records grouped by ID
  selectedIds: Set(),          // IDs selected for processing
}
```

#### Configuration State
```javascript
{
  selectedColumns: [],         // Columns for output
  selectedAiColumns: [],       // Columns for prompts
  systemPrompt: '',           // System prompt text
  userQuestions: [],          // Array of user questions
  filters: [],                // Applied row filters
}
```

### Key Algorithms

#### ID-Based Grouping
```javascript
groupDataByIdColumn() {
  this.groupedData.clear();
  for (let i = 1; i < this.currentData.length; i++) {
    const row = this.currentData[i];
    const id = row[this.idColumnIndex];
    if (!this.groupedData.has(id)) {
      this.groupedData.set(id, []);
    }
    this.groupedData.get(id).push(row);
  }
}
```

#### Prompt Generation
For each unique ID, generates 4 types of prompts:
1. `Prompt_Q1`, `Prompt_Q2`, `Prompt_Q3`: Question + Data (no system prompt)
2. `Prompt_Full_Q1`, `Prompt_Full_Q2`, `Prompt_Full_Q3`: System Prompt + Question + Data

#### Data Preservation
- All original data rows preserved in output
- Prompt columns added only to first row of each ID group
- Subsequent rows of same ID have empty prompt cells

### File Operations

#### Input Processing
- Supports .xlsx format only
- Maximum file size: 10MB
- Uses FileReader API for client-side processing
- SheetJS handles Excel parsing

#### Output Generation
- Creates new workbook with XLSX.utils.json_to_sheet()
- Filename format: `{original}_prompt_{timestamp}.xlsx`
- Uses Blob API for file download
- Preserves all original data structure

### Browser Storage

#### localStorage Usage
```javascript
// Prompt settings persistence
localStorage.setItem('systemPrompt', this.systemPrompt);
localStorage.setItem('userQuestions', JSON.stringify(this.userQuestions));
```

#### Data Security
- All processing client-side only
- No data transmission to external servers
- localStorage used only for user preferences
- No sensitive data stored persistently

### Error Handling

#### File Validation
- File type checking (.xlsx only)
- File size limits (10MB max)
- Workbook parsing error handling

#### User Input Validation
- Required field checking
- Data type validation
- Graceful error messaging

#### Processing Errors
- Try-catch blocks around critical operations
- User-friendly error messages
- Progress tracking with error recovery

### Performance Considerations

#### Memory Management
- Large file handling with streaming where possible
- Blob URL cleanup after downloads
- Event listener cleanup on reset

#### UI Responsiveness
- Progress indicators for long operations
- Chunked processing for large datasets
- Non-blocking UI updates

### Browser Compatibility

#### Supported Features
- ES6+ JavaScript (const/let, arrow functions, classes)
- FileReader API
- Blob API
- localStorage
- Modern CSS features

#### Minimum Requirements
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

### Security Considerations

#### Data Privacy
- No external network requests after initial load
- All processing local to user's browser
- No data logging or analytics
- Open source code for transparency

#### Input Sanitization
- Excel data treated as text
- No code execution from user data
- Safe HTML rendering practices

---

## 中文文档

### 架构概述

Excel Prompt Generator 是一个使用原生 JavaScript、HTML 和 CSS 构建的纯前端应用程序。它完全在浏览器中运行，无需任何后端服务或外部 API 调用。

#### 核心组件

1. **ExcelPromptGenerator 类** (`app.js`)
   - 主应用程序控制器
   - 处理所有数据处理和 UI 交互
   - 管理状态和用户交互

2. **用户界面** (`index.html`)
   - 双标签页界面：数据处理和提示词设置
   - 响应式设计，包含详细说明
   - 进度监控和完成反馈

3. **样式** (CSS 文件)
   - `styles.css`: 主应用程序样式
   - `custom_hide.css`: 自定义可见性控制
   - `ui_improvements.css`: 增强的 UI 组件

4. **外部依赖**
   - SheetJS (`libs/xlsx.full.min.js`): Excel 文件处理

### 数据流

```
Excel文件上传 → 工作表选择 → 列选择 → ID分组 → 
数据筛选 → 提示词配置 → 批量生成 → Excel导出
```

#### 详细处理流程

1. **文件处理**
   - 用户上传 .xlsx 文件（最大10MB）
   - SheetJS 将文件解析为 JSON 数组
   - 工作表填充到下拉菜单

2. **数据配置**
   - 用户选择输出列
   - 选择 ID 列进行记录分组
   - 选择特定 ID 进行处理
   - 选择提示词包含的数据列

3. **提示词设置**
   - 系统提示词配置（可选）
   - 配置最多3个用户问题
   - 设置自动保存到 localStorage

4. **生成过程**
   - 按 ID 分组记录
   - 为每个 ID 生成 Markdown 表格
   - 为每个 ID 创建多个提示词变体
   - 生成包含原始数据和提示词的 Excel 输出

### 状态管理

应用程序通过类属性维护状态：

#### 核心数据状态
```javascript
{
  workbook: null,              // 解析的 Excel 工作簿
  currentData: null,           // 活动工作表的 JSON 数组
  filteredData: null,          // 应用筛选器后的数据
  groupedData: Map(),          // 按 ID 分组的记录
  selectedIds: Set(),          // 选择处理的 ID
}
```

#### 配置状态
```javascript
{
  selectedColumns: [],         // 输出列
  selectedAiColumns: [],       // 提示词列
  systemPrompt: '',           // 系统提示词文本
  userQuestions: [],          // 用户问题数组
  filters: [],                // 应用的行筛选器
}
```

### 关键算法

#### 基于 ID 的分组
```javascript
groupDataByIdColumn() {
  this.groupedData.clear();
  for (let i = 1; i < this.currentData.length; i++) {
    const row = this.currentData[i];
    const id = row[this.idColumnIndex];
    if (!this.groupedData.has(id)) {
      this.groupedData.set(id, []);
    }
    this.groupedData.get(id).push(row);
  }
}
```

#### 提示词生成
为每个唯一 ID 生成4种类型的提示词：
1. `Prompt_Q1`, `Prompt_Q2`, `Prompt_Q3`: 问题 + 数据（无系统提示词）
2. `Prompt_Full_Q1`, `Prompt_Full_Q2`, `Prompt_Full_Q3`: 系统提示词 + 问题 + 数据

#### 数据保留
- 输出中保留所有原始数据行
- 提示词列仅添加到每个 ID 组的第一行
- 同一 ID 的后续行具有空的提示词单元格

### 文件操作

#### 输入处理
- 仅支持 .xlsx 格式
- 最大文件大小：10MB
- 使用 FileReader API 进行客户端处理
- SheetJS 处理 Excel 解析

#### 输出生成
- 使用 XLSX.utils.json_to_sheet() 创建新工作簿
- 文件名格式：`{原始名}_prompt_{时间戳}.xlsx`
- 使用 Blob API 进行文件下载
- 保留所有原始数据结构

### 浏览器存储

#### localStorage 使用
```javascript
// 提示词设置持久化
localStorage.setItem('systemPrompt', this.systemPrompt);
localStorage.setItem('userQuestions', JSON.stringify(this.userQuestions));
```

#### 数据安全
- 所有处理仅在客户端
- 不向外部服务器传输数据
- localStorage 仅用于用户偏好
- 不持久存储敏感数据

### 错误处理

#### 文件验证
- 文件类型检查（仅 .xlsx）
- 文件大小限制（最大10MB）
- 工作簿解析错误处理

#### 用户输入验证
- 必填字段检查
- 数据类型验证
- 优雅的错误消息

#### 处理错误
- 关键操作周围的 try-catch 块
- 用户友好的错误消息
- 带错误恢复的进度跟踪

### 性能考虑

#### 内存管理
- 尽可能使用流处理大文件
- 下载后清理 Blob URL
- 重置时清理事件监听器

#### UI 响应性
- 长操作的进度指示器
- 大数据集的分块处理
- 非阻塞 UI 更新

### 浏览器兼容性

#### 支持的功能
- ES6+ JavaScript (const/let, 箭头函数, 类)
- FileReader API
- Blob API
- localStorage
- 现代 CSS 功能

#### 最低要求
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

### 安全考虑

#### 数据隐私
- 初始加载后无外部网络请求
- 所有处理本地化到用户浏览器
- 无数据记录或分析
- 开源代码保证透明度

#### 输入清理
- Excel 数据作为文本处理
- 不执行用户数据中的代码
- 安全的 HTML 渲染实践