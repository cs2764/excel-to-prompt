/**
 * Excel Prompt Generator v1.1
 * Pure frontend application for generating AI prompts from Excel data
 * No API calls - Completely offline operation
 * 
 * @version 1.1
 * @date 2025-10-21
 * @license MIT
 * @author Excel Prompt Generator Team
 */

class ExcelPromptGenerator {
    constructor() {
        // Excel workbook data
        this.workbook = null;
        this.currentSheet = null;
        this.currentData = null;
        this.originalData = null;
        this.filteredData = null;
        this.originalFileName = '';
        

        
        // Filter state
        this.filters = [];
        this.filterLogic = 'AND';
        this.filterId = 0;
        
        // ID Column and Grouping state
        this.selectedIdColumn = null;
        this.idColumnIndex = -1;
        this.groupedData = new Map();
        this.uniqueIds = [];
        this.selectedIds = new Set();
        this.currentPreviewId = null;
        
        // AI Column Selection state (for prompt data)
        this.selectedAiColumns = [];
        this.aiColumnIndices = [];
        
        // Prompt data
        this.systemPrompt = '';
        this.userQuestions = [];
        
        // Progress tracking
        this.isProcessing = false;
        this.processedCount = 0;
        this.totalCount = 0;
        this.processedIds = new Set();
        this.lastGeneratedFile = null;
        
        this.initializeEventListeners();
        // Load prompts after DOM is ready
        this.loadPrompts().catch(err => {
            console.error('Failed to load prompts:', err);
        });
    }
    
    initializeEventListeners() {
        // Instructions toggle
        const toggleInstructionsBtn = document.getElementById('toggleInstructionsBtn');
        if (toggleInstructionsBtn) {
            toggleInstructionsBtn.addEventListener('click', () => this.toggleInstructions());
        }
        
        // File upload
        const uploadBtn = document.getElementById('uploadBtn');
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');
        
        uploadBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        
        // Sheet selection
        document.getElementById('sheetSelect').addEventListener('change', () => this.handleSheetChange());
        

        
        // ID column selection
        document.getElementById('idColumnSelect').addEventListener('change', () => this.handleIdColumnChange());
        document.getElementById('selectAllIdsBtn').addEventListener('click', () => this.toggleAllIds(true));
        document.getElementById('deselectAllIdsBtn').addEventListener('click', () => this.toggleAllIds(false));
        document.getElementById('copyIdDataBtn').addEventListener('click', () => this.copySelectedIdData());
        
        // AI column selection
        document.getElementById('selectAllAiColsBtn').addEventListener('click', () => this.toggleAllAiColumns(true));
        document.getElementById('deselectAllAiColsBtn').addEventListener('click', () => this.toggleAllAiColumns(false));
        
        // Filters
        document.getElementById('addFilterBtn').addEventListener('click', () => this.addFilter());
        document.getElementById('clearFiltersBtn').addEventListener('click', () => this.clearAllFilters());
        document.getElementById('applyFiltersBtn').addEventListener('click', () => this.applyFilters());
        document.getElementById('filterLogicSelect').addEventListener('change', (e) => {
            this.filterLogic = e.target.value;
        });
        
        // Generate prompt button
        document.getElementById('generatePromptBtn').addEventListener('click', () => this.generatePrompts());
        document.getElementById('modifySelectionBtn').addEventListener('click', () => this.modifySelection());
        
        // Prompt management
        document.getElementById('savePromptsBtn').addEventListener('click', () => this.savePrompts());
        document.getElementById('exportPromptsBtn').addEventListener('click', () => this.exportPrompts());
        document.getElementById('loadPromptsBtn').addEventListener('click', () => this.loadPrompts());
        document.getElementById('clearQuestion1Btn').addEventListener('click', () => this.clearQuestion(1));
        document.getElementById('clearQuestion2Btn').addEventListener('click', () => this.clearQuestion(2));
        document.getElementById('clearQuestion3Btn').addEventListener('click', () => this.clearQuestion(3));
        
        // Character counts for prompts with auto-save
        ['systemPrompt', 'userQuestion1', 'userQuestion2', 'userQuestion3'].forEach(id => {
            const textarea = document.getElementById(id);
            if (textarea) {
                textarea.addEventListener('input', () => {
                    this.updateCharCount(id);
                    this.autoSavePrompts();
                });
            }
        });
        
        // Progress panel controls
        document.getElementById('minimizeProgressBtn')?.addEventListener('click', () => this.minimizeProgress());
        document.getElementById('clearLogBtn')?.addEventListener('click', () => this.clearLog());
        document.getElementById('closeCompletionBtn')?.addEventListener('click', () => this.closeCompletion());
        
        // Tab navigation
        this.initializeTabNavigation();
        
        // Reset button
        document.getElementById('resetBtn').addEventListener('click', () => this.resetApplication());
    }
    
    initializeTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        // Update button states
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });
        
        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
    }
    
    // ==================== File Handling ====================
    
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('drag-over');
    }
    
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('drag-over');
    }
    
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }
    
    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    processFile(file) {
        // Store original filename
        this.originalFileName = file.name.replace(/\.xlsx$/i, '');
        
        if (!file.name.toLowerCase().endsWith('.xlsx')) {
            this.showMessage('Please select a .xlsx format file', 'error');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            this.showMessage('File size exceeds 10MB limit', 'error');
            return;
        }
        
        this.showMessage('Parsing file...', 'info');
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                this.workbook = XLSX.read(data, { type: 'array' });
                this.populateSheetSelector();
                this.showMessage('File parsed successfully!', 'success');
            } catch (error) {
                this.showMessage('File parsing failed', 'error');
                console.error('File parsing error:', error);
            }
        };
        
        reader.readAsArrayBuffer(file);
    }
    
    populateSheetSelector() {
        const sheetSelect = document.getElementById('sheetSelect');
        sheetSelect.innerHTML = '';
        
        this.workbook.SheetNames.forEach((name) => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            sheetSelect.appendChild(option);
        });
        
        // Show UI sections
        document.getElementById('tabNavigation').style.display = 'flex';
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('sheetSection').style.display = 'block';
        document.getElementById('idGroupingSection').style.display = 'block';
        document.getElementById('filterSection').style.display = 'block';
        document.getElementById('previewSection').style.display = 'block';
        document.getElementById('controlsSection').style.display = 'block';
        
        // Automatically select first sheet
        this.handleSheetChange();
    }
    
    handleSheetChange() {
        const sheetSelect = document.getElementById('sheetSelect');
        const selectedSheet = sheetSelect.value;
        
        if (selectedSheet && this.workbook) {
            this.currentSheet = selectedSheet;
            const worksheet = this.workbook.Sheets[selectedSheet];
            
            // Convert to JSON array
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: '',
                blankrows: false
            });
            
            // Filter empty rows
            this.currentData = jsonData.filter(row => 
                row.some(cell => cell !== null && cell !== undefined && cell !== '')
            );
            
            if (this.currentData.length > 0) {
                this.originalData = this.currentData.slice();
                this.clearAllFilters();
                this.createAiColumnSelector();
                this.populateIdColumnSelector();
                this.applyFilters();
            } else {
                this.showMessage('No data in the selected worksheet', 'error');
            }
        }
    }
    

    
    // ==================== ID Column & Grouping ====================
    
    populateIdColumnSelector() {
        const idColumnSelect = document.getElementById('idColumnSelect');
        idColumnSelect.innerHTML = '<option value="">-- Select ID Column --</option>';
        
        const headers = this.currentData[0] || [];
        headers.forEach((header, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = header || `Column ${index + 1}`;
            idColumnSelect.appendChild(option);
        });
        
        // Automatically select the first column (index 0)
        if (headers.length > 0) {
            idColumnSelect.value = '0';
            this.handleIdColumnChange();
        }
    }
    
    handleIdColumnChange() {
        const idColumnSelect = document.getElementById('idColumnSelect');
        const selectedIndex = idColumnSelect.value;
        
        if (selectedIndex === '') {
            this.selectedIdColumn = null;
            this.idColumnIndex = -1;
            this.hideIdList();
            this.hideAiColumnSection();
            return;
        }
        
        this.idColumnIndex = parseInt(selectedIndex);
        this.selectedIdColumn = this.currentData[0][this.idColumnIndex];
        
        // Group data by ID
        this.groupDataByIdColumn();
        this.displayIdList();
        this.showAiColumnSection();
    }
    
    groupDataByIdColumn() {
        this.groupedData.clear();
        this.uniqueIds = [];
        
        for (let i = 1; i < this.currentData.length; i++) {
            const row = this.currentData[i];
            const id = row[this.idColumnIndex];
            
            if (id !== null && id !== undefined && id !== '') {
                if (!this.groupedData.has(id)) {
                    this.groupedData.set(id, []);
                    this.uniqueIds.push(id);
                }
                this.groupedData.get(id).push(row);
            }
        }
    }
    
    displayIdList() {
        const idListContainer = document.getElementById('idListContainer');
        const idList = document.getElementById('idList');
        const idStats = document.getElementById('idStats');
        
        idList.innerHTML = '';
        
        document.getElementById('uniqueIdCount').textContent = this.uniqueIds.length;
        document.getElementById('totalRowsCount').textContent = this.currentData.length - 1;
        
        idStats.style.display = 'flex';
        idListContainer.style.display = 'block';
        
        this.uniqueIds.forEach(id => {
            const idItem = document.createElement('div');
            idItem.className = 'id-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `id-${id}`;
            checkbox.checked = true;
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.selectedIds.add(id);
                } else {
                    this.selectedIds.delete(id);
                }
                this.updateSelectedIdInfo();
                this.updateProcessingConfirmation();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `id-${id}`;
            label.textContent = id;
            
            const rowCount = this.groupedData.get(id).length;
            const countSpan = document.createElement('span');
            countSpan.className = 'row-count';
            countSpan.textContent = `(${rowCount} row${rowCount > 1 ? 's' : ''})`;
            
            idItem.appendChild(checkbox);
            idItem.appendChild(label);
            idItem.appendChild(countSpan);
            
            // Add click event to preview
            idItem.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    this.previewIdData(id);
                }
            });
            
            idList.appendChild(idItem);
            this.selectedIds.add(id);
        });
        
        this.updateSelectedIdInfo();
        this.updateProcessingConfirmation();
    }
    
    toggleAllIds(select) {
        this.selectedIds.clear();
        
        const checkboxes = document.querySelectorAll('#idList input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = select;
            if (select) {
                const id = checkbox.id.replace('id-', '');
                this.selectedIds.add(id);
            }
        });
        
        this.updateSelectedIdInfo();
        this.updateProcessingConfirmation();
    }
    
    updateSelectedIdInfo() {
        const selectedIdInfo = document.getElementById('selectedIdInfo');
        const count = this.selectedIds.size;
        
        if (count === 0) {
            selectedIdInfo.textContent = 'No IDs selected';
        } else if (count === this.uniqueIds.length) {
            selectedIdInfo.textContent = 'All IDs selected';
        } else {
            selectedIdInfo.textContent = `${count} of ${this.uniqueIds.length} IDs selected`;
        }
    }
    
    previewIdData(id) {
        this.currentPreviewId = id;
        const rows = this.groupedData.get(id);
        
        if (!rows || rows.length === 0) return;
        
        const headers = this.currentData[0];
        const markdown = this.convertRowsToMarkdown(headers, rows, this.aiColumnIndices);
        
        document.getElementById('previewIdName').textContent = `ID: ${id}`;
        document.getElementById('idDataPreview').textContent = markdown;
        document.getElementById('idPreviewContainer').style.display = 'block';
    }
    
    copySelectedIdData() {
        const markdown = document.getElementById('idDataPreview').textContent;
        navigator.clipboard.writeText(markdown).then(() => {
            this.showMessage('Data copied to clipboard', 'success');
        });
    }
    
    hideIdList() {
        document.getElementById('idStats').style.display = 'none';
        document.getElementById('idListContainer').style.display = 'none';
        document.getElementById('idPreviewContainer').style.display = 'none';
    }
    
    // ==================== AI Column Selection ====================
    
    createAiColumnSelector() {
        if (!this.currentData || this.currentData.length === 0) return;
        
        const aiColumnSelector = document.getElementById('aiColumnSelector');
        aiColumnSelector.innerHTML = '';
        
        const headers = this.currentData[0] || [];
        this.selectedAiColumns = new Array(headers.length).fill(true);
        this.aiColumnIndices = [];
        
        headers.forEach((header, index) => {
            const columnItem = document.createElement('div');
            columnItem.className = 'ai-column-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `ai-column-${index}`;
            checkbox.checked = true;
            checkbox.addEventListener('change', (e) => {
                this.selectedAiColumns[index] = e.target.checked;
                this.updateAiColumnIndices();
                this.updateAiColumnInfo();
                this.updateProcessingConfirmation();
            });
            
            const label = document.createElement('label');
            label.htmlFor = `ai-column-${index}`;
            label.textContent = header || `Column ${index + 1}`;
            
            columnItem.appendChild(checkbox);
            columnItem.appendChild(label);
            aiColumnSelector.appendChild(columnItem);
        });
        
        this.updateAiColumnIndices();
        this.updateAiColumnInfo();
    }
    
    updateAiColumnIndices() {
        this.aiColumnIndices = this.selectedAiColumns
            .map((selected, index) => selected ? index : -1)
            .filter(index => index !== -1);
    }
    
    toggleAllAiColumns(select) {
        const checkboxes = document.querySelectorAll('#aiColumnSelector input[type="checkbox"]');
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = select;
            this.selectedAiColumns[index] = select;
        });
        this.updateAiColumnIndices();
        this.updateAiColumnInfo();
        this.updateProcessingConfirmation();
    }
    
    updateAiColumnInfo() {
        const aiColumnInfo = document.getElementById('aiColumnInfo');
        const selectedCount = this.selectedAiColumns.filter(s => s).length;
        const totalCount = this.selectedAiColumns.length;
        
        if (selectedCount === 0) {
            aiColumnInfo.textContent = 'No columns selected';
        } else if (selectedCount === totalCount) {
            aiColumnInfo.textContent = 'All columns selected';
        } else {
            aiColumnInfo.textContent = `${selectedCount} of ${totalCount} columns selected`;
        }
    }
    
    showAiColumnSection() {
        document.getElementById('aiColumnSection').style.display = 'block';
        this.updateProcessingConfirmation();
    }
    
    hideAiColumnSection() {
        document.getElementById('aiColumnSection').style.display = 'none';
        document.getElementById('aiProcessingConfirmation').style.display = 'none';
    }
    
    updateProcessingConfirmation() {
        const hasIdColumn = this.selectedIdColumn && this.idColumnIndex !== -1;
        const hasAiColumns = this.aiColumnIndices.length > 0;
        const hasSelectedIds = this.selectedIds.size > 0;
        
        if (hasIdColumn && hasAiColumns && hasSelectedIds) {
            document.getElementById('confirmIdColumn').textContent = this.selectedIdColumn;
            document.getElementById('confirmAiColumns').textContent = `${this.aiColumnIndices.length} columns`;
            document.getElementById('confirmIdCount').textContent = this.selectedIds.size;
            this.updateConfirmQuestions();
            document.getElementById('aiProcessingConfirmation').style.display = 'block';
        } else {
            document.getElementById('aiProcessingConfirmation').style.display = 'none';
        }
    }
    
    updateConfirmQuestions() {
        const confirmQuestionsDiv = document.getElementById('confirmQuestions');
        
        if (this.userQuestions.length === 0) {
            confirmQuestionsDiv.innerHTML = '<p class="no-questions">No questions configured</p>';
        } else {
            confirmQuestionsDiv.innerHTML = '';
            this.userQuestions.forEach((question, index) => {
                if (question.trim()) {
                    const questionItem = document.createElement('div');
                    questionItem.className = 'question-item';
                    questionItem.innerHTML = `<strong>Q${index + 1}:</strong> ${question}`;
                    confirmQuestionsDiv.appendChild(questionItem);
                }
            });
        }
    }
    
    modifySelection() {
        document.getElementById('aiColumnSelector').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    // ==================== Filtering ====================
    
    addFilter() {
        if (!this.currentData || this.currentData.length === 0) return;
        
        const filtersContainer = document.getElementById('filtersContainer');
        const filterId = this.filterId++;
        
        const filterDiv = document.createElement('div');
        filterDiv.className = 'filter-item';
        filterDiv.id = `filter-${filterId}`;
        
        const headers = this.currentData[0] || [];
        
        filterDiv.innerHTML = `
            <select class="form-control filter-column">
                ${headers.map((h, i) => `<option value="${i}">${h || `Column ${i + 1}`}</option>`).join('')}
            </select>
            <select class="form-control filter-operator">
                <option value="equals">Equals</option>
                <option value="contains">Contains</option>
                <option value="startsWith">Starts with</option>
                <option value="endsWith">Ends with</option>
                <option value="notEquals">Not equals</option>
            </select>
            <input type="text" class="form-control filter-value" placeholder="Value">
            <button class="btn btn-secondary btn-sm" onclick="app.removeFilter(${filterId})">Remove</button>
        `;
        
        filtersContainer.appendChild(filterDiv);
        
        this.filters.push({
            id: filterId,
            columnIndex: 0,
            operator: 'equals',
            value: ''
        });
    }
    
    removeFilter(filterId) {
        const filterDiv = document.getElementById(`filter-${filterId}`);
        if (filterDiv) {
            filterDiv.remove();
        }
        
        this.filters = this.filters.filter(f => f.id !== filterId);
        this.applyFilters();
    }
    
    clearAllFilters() {
        const filtersContainer = document.getElementById('filtersContainer');
        filtersContainer.innerHTML = '';
        this.filters = [];
        this.applyFilters();
    }
    
    applyFilters() {
        if (!this.originalData || this.originalData.length === 0) return;
        
        // Start with original data
        let data = this.originalData.slice();
        
        // Apply filters
        if (this.filters.length > 0) {
            data = [data[0]]; // Keep headers
            
            for (let i = 1; i < this.originalData.length; i++) {
                const row = this.originalData[i];
                let includeRow = this.filterLogic === 'AND';
                
                for (const filter of this.filters) {
                    const cellValue = String(row[filter.columnIndex] || '').toLowerCase();
                    const filterValue = String(filter.value || '').toLowerCase();
                    
                    let matches = false;
                    switch (filter.operator) {
                        case 'equals':
                            matches = cellValue === filterValue;
                            break;
                        case 'contains':
                            matches = cellValue.includes(filterValue);
                            break;
                        case 'startsWith':
                            matches = cellValue.startsWith(filterValue);
                            break;
                        case 'endsWith':
                            matches = cellValue.endsWith(filterValue);
                            break;
                        case 'notEquals':
                            matches = cellValue !== filterValue;
                            break;
                    }
                    
                    if (this.filterLogic === 'AND') {
                        includeRow = includeRow && matches;
                    } else {
                        includeRow = includeRow || matches;
                    }
                }
                
                if (includeRow) {
                    data.push(row);
                }
            }
        }
        
        // Use all columns for filtered data
        this.filteredData = data;
        
        this.updateFilterInfo();
        this.updatePreviewTable();
    }
    
    updateFilterInfo() {
        const filterInfo = document.getElementById('filterInfo');
        if (this.filters.length === 0) {
            filterInfo.textContent = 'No filters applied';
        } else {
            const rowCount = this.filteredData.length - 1;
            filterInfo.textContent = `${this.filters.length} filter(s) applied - ${rowCount} rows`;
        }
    }
    
    // ==================== Preview ====================
    
    updatePreviewTable() {
        if (!this.filteredData || this.filteredData.length === 0) return;
        
        const previewTable = document.getElementById('previewTable');
        previewTable.innerHTML = '';
        
        const maxRows = Math.min(51, this.filteredData.length); // Show max 50 data rows + header
        
        for (let i = 0; i < maxRows; i++) {
            const row = this.filteredData[i];
            const tr = document.createElement('tr');
            
            row.forEach(cell => {
                const td = document.createElement(i === 0 ? 'th' : 'td');
                td.textContent = cell || '';
                tr.appendChild(td);
            });
            
            previewTable.appendChild(tr);
        }
        
        const rowCountInfo = document.getElementById('rowCountInfo');
        const totalRows = this.filteredData.length - 1;
        const displayedRows = maxRows - 1;
        
        if (totalRows > displayedRows) {
            rowCountInfo.textContent = `Showing ${displayedRows} of ${totalRows} rows`;
        } else {
            rowCountInfo.textContent = `Showing all ${totalRows} rows`;
        }
    }
    
    // ==================== Prompt Management ====================
    
    async loadPrompts() {
        try {
            console.log('Loading prompts...');
            let systemLoaded = false;
            let questionsLoaded = false;
            
            // First, try to load from localStorage
            const savedSystemPrompt = localStorage.getItem('systemPrompt');
            const savedQuestions = localStorage.getItem('userQuestions');
            
            if (savedSystemPrompt || savedQuestions) {
                console.log('Loading prompts from localStorage...');
                
                if (savedSystemPrompt) {
                    this.systemPrompt = savedSystemPrompt;
                    const systemPromptElement = document.getElementById('systemPrompt');
                    if (systemPromptElement) {
                        systemPromptElement.value = this.systemPrompt;
                        this.updateCharCount('systemPrompt');
                        systemLoaded = true;
                    }
                }
                
                if (savedQuestions) {
                    try {
                        this.userQuestions = JSON.parse(savedQuestions);
                        const q1 = document.getElementById('userQuestion1');
                        const q2 = document.getElementById('userQuestion2');
                        const q3 = document.getElementById('userQuestion3');
                        
                        if (q1) {
                            q1.value = this.userQuestions[0] || '';
                            this.updateCharCount('userQuestion1');
                        }
                        if (q2) {
                            q2.value = this.userQuestions[1] || '';
                            this.updateCharCount('userQuestion2');
                        }
                        if (q3) {
                            q3.value = this.userQuestions[2] || '';
                            this.updateCharCount('userQuestion3');
                        }
                        questionsLoaded = true;
                    } catch (err) {
                        console.error('Error parsing saved questions:', err);
                    }
                }
                
                this.updateConfirmQuestions();
                this.showMessage('Prompts loaded from saved settings', 'success');
                return;
            }
            
            // If no localStorage data, try to load from files (requires HTTP server)
            console.log('No saved prompts found, attempting to load from files...');
            
            // Load system prompt
            try {
                const systemResponse = await fetch('prompts/system_prompt.txt');
                console.log('System prompt response status:', systemResponse.status);
                if (systemResponse.ok) {
                    this.systemPrompt = await systemResponse.text();
                    const systemPromptElement = document.getElementById('systemPrompt');
                    if (systemPromptElement) {
                        systemPromptElement.value = this.systemPrompt;
                        this.updateCharCount('systemPrompt');
                        systemLoaded = true;
                        // Save to localStorage for future use
                        localStorage.setItem('systemPrompt', this.systemPrompt);
                        console.log('System prompt loaded and saved');
                    }
                }
            } catch (err) {
                console.log('Could not load system prompt from file (this is normal when opening HTML directly)');
            }
            
            // Load questions
            try {
                const questionsResponse = await fetch('prompts/questions.json');
                console.log('Questions response status:', questionsResponse.status);
                if (questionsResponse.ok) {
                    const questionsData = await questionsResponse.json();
                    this.userQuestions = [
                        questionsData.question1 || '',
                        questionsData.question2 || '',
                        questionsData.question3 || ''
                    ];
                    
                    const q1 = document.getElementById('userQuestion1');
                    const q2 = document.getElementById('userQuestion2');
                    const q3 = document.getElementById('userQuestion3');
                    
                    if (q1) {
                        q1.value = this.userQuestions[0];
                        this.updateCharCount('userQuestion1');
                    }
                    if (q2) {
                        q2.value = this.userQuestions[1];
                        this.updateCharCount('userQuestion2');
                    }
                    if (q3) {
                        q3.value = this.userQuestions[2];
                        this.updateCharCount('userQuestion3');
                    }
                    
                    questionsLoaded = true;
                    // Save to localStorage for future use
                    localStorage.setItem('userQuestions', JSON.stringify(this.userQuestions));
                    console.log('Questions loaded and saved');
                }
            } catch (err) {
                console.log('Could not load questions from file (this is normal when opening HTML directly)');
            }
            
            this.updateConfirmQuestions();
            
            if (systemLoaded || questionsLoaded) {
                this.showMessage('Prompts loaded from files and saved', 'success');
            } else {
                this.showMessage('No saved prompts found. Please configure prompts in the Prompt Settings tab.', 'info');
                console.log('No prompts loaded. You can configure them in the Prompt Settings tab.');
            }
        } catch (error) {
            console.error('Error loading prompts:', error);
            this.showMessage('Error loading prompts', 'warning');
        }
    }
    
    savePrompts() {
        // Get current values
        this.systemPrompt = document.getElementById('systemPrompt').value;
        this.userQuestions = [
            document.getElementById('userQuestion1').value,
            document.getElementById('userQuestion2').value,
            document.getElementById('userQuestion3').value
        ];
        
        // Save to localStorage
        localStorage.setItem('systemPrompt', this.systemPrompt);
        localStorage.setItem('userQuestions', JSON.stringify(this.userQuestions));
        
        this.updateConfirmQuestions();
        this.showMessage('Prompts saved successfully!', 'success');
        console.log('Prompts saved to browser storage');
    }
    
    exportPrompts() {
        // Get current values
        this.systemPrompt = document.getElementById('systemPrompt').value;
        this.userQuestions = [
            document.getElementById('userQuestion1').value,
            document.getElementById('userQuestion2').value,
            document.getElementById('userQuestion3').value
        ];
        
        // Create downloadable files
        const systemBlob = new Blob([this.systemPrompt], { type: 'text/plain' });
        const systemUrl = URL.createObjectURL(systemBlob);
        
        const questionsData = {
            question1: this.userQuestions[0],
            question2: this.userQuestions[1],
            question3: this.userQuestions[2]
        };
        const questionsBlob = new Blob([JSON.stringify(questionsData, null, 2)], { type: 'application/json' });
        const questionsUrl = URL.createObjectURL(questionsBlob);
        
        // Download system prompt
        const systemLink = document.createElement('a');
        systemLink.href = systemUrl;
        systemLink.download = 'system_prompt.txt';
        systemLink.click();
        
        // Download questions
        setTimeout(() => {
            const questionsLink = document.createElement('a');
            questionsLink.href = questionsUrl;
            questionsLink.download = 'questions.json';
            questionsLink.click();
            
            URL.revokeObjectURL(systemUrl);
            URL.revokeObjectURL(questionsUrl);
        }, 100);
        
        this.showMessage('Prompt files exported successfully!', 'success');
    }
    
    clearQuestion(number) {
        document.getElementById(`userQuestion${number}`).value = '';
        this.userQuestions[number - 1] = '';
        this.updateCharCount(`userQuestion${number}`);
        this.updateConfirmQuestions();
    }
    
    updateCharCount(textareaId) {
        const textarea = document.getElementById(textareaId);
        const countSpan = document.getElementById(`${textareaId}Count`);
        if (textarea && countSpan) {
            const count = textarea.value.length;
            countSpan.textContent = `${count} characters`;
        }
    }
    
    autoSavePrompts() {
        // Debounce auto-save to avoid too frequent saves
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            const systemPrompt = document.getElementById('systemPrompt').value;
            const userQuestions = [
                document.getElementById('userQuestion1').value,
                document.getElementById('userQuestion2').value,
                document.getElementById('userQuestion3').value
            ];
            
            localStorage.setItem('systemPrompt', systemPrompt);
            localStorage.setItem('userQuestions', JSON.stringify(userQuestions));
            console.log('Prompts auto-saved');
        }, 1000); // Save after 1 second of no typing
    }
    
    // ==================== Prompt Generation ====================
    
    async generatePrompts() {
        // Validation
        if (!this.selectedIdColumn || this.idColumnIndex === -1) {
            this.showMessage('Please select an ID column', 'error');
            return;
        }
        
        if (this.selectedIds.size === 0) {
            this.showMessage('Please select at least one ID', 'error');
            return;
        }
        
        if (this.aiColumnIndices.length === 0) {
            this.showMessage('Please select at least one column for prompts', 'error');
            return;
        }
        
        // Get current prompt values
        this.systemPrompt = document.getElementById('systemPrompt').value;
        this.userQuestions = [
            document.getElementById('userQuestion1').value,
            document.getElementById('userQuestion2').value,
            document.getElementById('userQuestion3').value
        ];
        
        // Show progress panel
        this.showProgressPanel();
        this.isProcessing = true;
        this.processedCount = 0;
        this.totalCount = this.selectedIds.size;
        this.processedIds = new Set();
        this.lastGeneratedFile = null;
        
        this.updateProgress();
        this.addLog('info', 'Starting prompt generation...');
        
        try {
            const results = [];
            const headers = this.currentData[0];
            
            // Process all data rows from original data
            for (let i = 1; i < this.currentData.length; i++) {
                const row = this.currentData[i];
                const id = row[this.idColumnIndex];
                
                // Create result row with all original data
                const resultRow = {};
                headers.forEach((header, index) => {
                    resultRow[header || `Column_${index + 1}`] = row[index];
                });
                
                // Check if this is the first row of a selected ID
                const isFirstRowOfId = this.isFirstRowOfId(id, i);
                const isSelectedId = this.selectedIds.has(id);
                
                if (isSelectedId && isFirstRowOfId) {
                    // Generate prompts for this ID
                    if (!this.processedIds.has(id)) {
                        this.updateStatus(`Processing ID: ${id} (${this.processedIds.size + 1}/${this.totalCount})`);
                        this.addLog('info', `Generating prompts for ID: ${id}`);
                        
                        const idRows = this.groupedData.get(id);
                        const markdownData = this.convertRowsToMarkdown(headers, idRows, this.aiColumnIndices);
                        const prompts = this.generatePromptsForId(id, markdownData);
                        
                        // Add prompt columns to this row
                        Object.keys(prompts).forEach(key => {
                            resultRow[key] = prompts[key];
                        });
                        
                        this.processedIds.add(id);
                        this.processedCount++;
                        this.updateProgress();
                    }
                } else if (isSelectedId) {
                    // Add empty prompt columns for subsequent rows of selected IDs
                    // Get column names from user questions
                    this.userQuestions.forEach((question, index) => {
                        if (question.trim()) {
                            const qNum = index + 1;
                            resultRow[`Prompt_Q${qNum}`] = '';
                            if (this.systemPrompt.trim()) {
                                resultRow[`Prompt_Full_Q${qNum}`] = '';
                            }
                        }
                    });
                }
                
                results.push(resultRow);
            }
            
            // Generate Excel output
            this.addLog('info', 'Writing Excel file...');
            this.updateStatus('Writing Excel file...');
            
            await this.generateExcelOutput(results);
            
            this.addLog('success', 'Prompt generation completed!');
            this.showCompletionSummary(results.length);
            
        } catch (error) {
            this.addLog('error', `Error: ${error.message}`);
            this.showMessage('Prompt generation failed: ' + error.message, 'error');
        } finally {
            this.isProcessing = false;
        }
    }
    
    convertRowsToMarkdown(headers, rows, columnIndices) {
        // Filter headers and rows based on selected AI columns
        const filteredHeaders = columnIndices.map(i => headers[i] || `Column ${i + 1}`);
        
        let markdown = '| ' + filteredHeaders.join(' | ') + ' |\n';
        markdown += '|' + filteredHeaders.map(() => '---').join('|') + '|\n';
        
        rows.forEach(row => {
            const filteredCells = columnIndices.map(i => {
                const cell = row[i];
                return cell !== null && cell !== undefined ? String(cell) : '';
            });
            markdown += '| ' + filteredCells.join(' | ') + ' |\n';
        });
        
        return markdown;
    }
    
    generatePromptsForId(id, markdownData) {
        const prompts = {};
        
        // First, generate prompts WITHOUT system prompt for all questions
        this.userQuestions.forEach((question, index) => {
            if (question.trim()) {
                const qNum = index + 1;
                // Structure: Data + Question
                prompts[`Prompt_Q${qNum}`] = `## Data Record\n\n${markdownData}\n\n${question}`;
            }
        });
        
        // Then, generate prompts WITH system prompt for all questions
        if (this.systemPrompt.trim()) {
            this.userQuestions.forEach((question, index) => {
                if (question.trim()) {
                    const qNum = index + 1;
                    // Structure: System Prompt + Data + Question
                    prompts[`Prompt_Full_Q${qNum}`] = `${this.systemPrompt}\n\n## Data Record\n\n${markdownData}\n\n${question}`;
                }
            });
        }
        
        return prompts;
    }
    
    isFirstRowOfId(id, currentRowIndex) {
        // Check if this is the first occurrence of this ID in the data
        for (let i = 1; i < currentRowIndex; i++) {
            if (this.currentData[i][this.idColumnIndex] === id) {
                return false;
            }
        }
        return true;
    }
    
    async generateExcelOutput(results) {
        // Create worksheet from results
        const ws = XLSX.utils.json_to_sheet(results);
        
        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Prompts');
        
        // Generate filename with timestamp (local time)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}${month}${day}_${hours}${minutes}${seconds}`;
        
        const filename = `${this.originalFileName}_prompt_${timestamp}.xlsx`;
        
        // Generate file as blob to get size
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const fileSizeKB = (blob.size / 1024).toFixed(2);
        
        // Create download URL for the blob
        const downloadUrl = URL.createObjectURL(blob);
        
        this.addLog('success', `File generated: ${filename} (${fileSizeKB} KB)`);
        this.addLog('info', `File is ready for download. Click the download button to save it.`);
        
        // Store file info for completion summary
        this.lastGeneratedFile = {
            name: filename,
            size: fileSizeKB,
            rowCount: results.length,
            timestamp: new Date().toLocaleString(),
            downloadUrl: downloadUrl,
            blob: blob
        };
        
        return filename;
    }
    
    // ==================== Progress Display ====================
    
    showProgressPanel() {
        document.getElementById('progressPanel').style.display = 'block';
        document.getElementById('completionSummary').style.display = 'none';
    }
    
    updateProgress() {
        const percentage = this.totalCount > 0 ? (this.processedCount / this.totalCount * 100).toFixed(1) : 0;
        
        document.getElementById('overallPercentage').textContent = `${percentage}%`;
        document.getElementById('overallProgressBar').style.width = `${percentage}%`;
        document.getElementById('processedCount').textContent = this.processedCount;
        document.getElementById('totalCount').textContent = this.totalCount;
    }
    
    updateStatus(message) {
        document.getElementById('currentStatus').textContent = message;
    }
    
    addLog(level, message) {
        const logContainer = document.getElementById('processingLog');
        const timestamp = new Date().toLocaleTimeString();
        
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry log-${level}`;
        logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;
        
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }
    
    clearLog() {
        document.getElementById('processingLog').innerHTML = '';
    }
    
    minimizeProgress() {
        const content = document.getElementById('progressContent');
        const btn = document.getElementById('minimizeProgressBtn');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            btn.textContent = '−';
        } else {
            content.style.display = 'none';
            btn.textContent = '+';
        }
    }
    
    showCompletionSummary(totalProcessed) {
        document.getElementById('progressContent').style.display = 'none';
        document.getElementById('completionSummary').style.display = 'block';
        
        // Update completion information
        document.getElementById('completionTotal').textContent = this.processedCount || totalProcessed;
        
        if (this.lastGeneratedFile) {
            document.getElementById('completionFilename').textContent = this.lastGeneratedFile.name;
            document.getElementById('completionFileSize').textContent = `${this.lastGeneratedFile.size} KB`;
            document.getElementById('completionRowCount').textContent = this.lastGeneratedFile.rowCount;
            document.getElementById('completionTimestamp').textContent = this.lastGeneratedFile.timestamp;
            
            // Setup download button
            const downloadBtn = document.getElementById('downloadGeneratedFileBtn');
            if (downloadBtn) {
                // Remove old event listeners by cloning
                const newDownloadBtn = downloadBtn.cloneNode(true);
                downloadBtn.parentNode.replaceChild(newDownloadBtn, downloadBtn);
                
                // Add new event listener
                newDownloadBtn.addEventListener('click', () => this.downloadFile());
            }
        }
    }
    
    downloadFile() {
        if (!this.lastGeneratedFile) {
            this.showMessage('No file available for download', 'error');
            return;
        }
        
        // Use browser's built-in download
        const a = document.createElement('a');
        a.href = this.lastGeneratedFile.downloadUrl;
        a.download = this.lastGeneratedFile.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        this.showMessage('File download started!', 'success');
    }
    
    closeCompletion() {
        // Clean up blob URL to free memory
        if (this.lastGeneratedFile && this.lastGeneratedFile.downloadUrl) {
            URL.revokeObjectURL(this.lastGeneratedFile.downloadUrl);
        }
        document.getElementById('progressPanel').style.display = 'none';
    }
    
    // ==================== Utility Functions ====================
    
    showMessage(message, type = 'info') {
        const messageBox = document.getElementById('messageBox');
        messageBox.textContent = message;
        messageBox.className = `message-box message-${type}`;
        messageBox.style.display = 'block';
        
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 3000);
    }
    
    toggleInstructions() {
        const instructionsContent = document.getElementById('instructionsContent');
        const toggleBtn = document.getElementById('toggleInstructionsBtn');
        
        if (instructionsContent && toggleBtn) {
            if (instructionsContent.classList.contains('hidden')) {
                instructionsContent.classList.remove('hidden');
                toggleBtn.textContent = 'Hide Instructions';
            } else {
                instructionsContent.classList.add('hidden');
                toggleBtn.textContent = 'Show Instructions';
            }
        }
    }
    
    resetApplication() {
        if (confirm('Are you sure you want to reset? All current data will be lost.')) {
            location.reload();
        }
    }
}

// Initialize application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ExcelPromptGenerator();
});
