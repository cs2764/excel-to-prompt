# Changelog

All notable changes to Excel Prompt Generator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-10-21

### Removed
- **Column Selection Feature**: Removed redundant column selection interface that only affected preview but not final output
- **Related UI Components**: Removed column selector, column controls, and column info display
- **Unused CSS Styles**: Cleaned up column selection related styles (~50 lines of CSS)
- **JavaScript Methods**: Removed `createColumnSelector()`, `toggleAllColumns()`, `updateColumnInfo()` methods

### Changed
- **Simplified Workflow**: Reduced data processing steps from 5 to 4 steps
- **Improved Consistency**: Preview table now shows exactly what will be exported
- **Enhanced User Experience**: Eliminated confusion between preview and output
- **Optimized Performance**: Reduced DOM operations and code complexity
- **Updated Documentation**: Revised README and usage instructions

### Fixed
- **Data Integrity**: All original columns are now consistently preserved in output
- **Preview Accuracy**: Preview table now matches final Excel output exactly
- **User Interface**: Streamlined interface focuses on core functionality

### Technical Details
- Simplified `applyFilters()` method: `this.filteredData = data` (no column filtering)
- Removed `selectedColumns` state variable and related logic
- Updated initialization flow to skip column selector creation
- Cleaned up event listeners and UI display logic

## [1.0.0] - 2025-10-21

### Added
- Initial open source release with MIT license
- Bilingual documentation (English/Chinese)
- Version display in header
- Comprehensive README with usage instructions
- CHANGELOG and LICENSE files
- Enhanced project structure documentation
- Excel file upload and processing
- Data column selection and filtering
- ID-based record grouping
- Custom prompt configuration
- Batch prompt generation
- Excel export with original data + prompts
- Offline operation capability
- Auto-save prompt settings
- Progress monitoring
- Bilingual UI support (English/Chinese)

### Changed
- Initial version 1.0.0 for open source release
- Improved documentation structure
- Enhanced meta tags in HTML
- Better code organization and comments

### Technical Details
- Pure frontend implementation with no backend dependencies
- Offline-first architecture
- Browser-based Excel processing using SheetJS
- Local storage for prompt configurations
- Cross-platform compatibility

### Browser Support
- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+

### Features
- Pure frontend implementation
- No server requirements
- Complete offline operation
- Flexible data selection
- Custom prompt templates
- Batch processing
- Excel I/O operations
- Data privacy (no external data transmission)