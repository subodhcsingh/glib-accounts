function exportToCSV() {
    if(transactions.length === 0) {
        showAlertModal("No Data", "There are no transactions to export.");
        return;
    }
    
    // Updated headers to include new fields
    let csvRows = [["ID", "Date", "Description", "Category", "Type", "Amount", "Second Account", "Reference"]];
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    
    for(let t of sortedTransactions) {
        csvRows.push([
            t.id,
            t.date,
            t.description,
            t.category || "",
            t.type,
            t.amount.toFixed(2),
            t.secondAccount || "",
            t.reference || ""
        ]);
    }
    
    const csvContent = csvRows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `ledger_export_${new Date().toISOString().slice(0,19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showAlertModal("Export Complete", "Your transactions have been exported as CSV. The file never leaves your device.");
}

// Download CSV template function
function downloadTemplate() {
    const templateData = [
        {
            id: "1700000000001",
            date: new Date().toISOString().slice(0,10),
            description: "Sample Business Income",
            category: "Sales",
            type: "income",
            amount: 25000.00,
            secondAccount: "Bank Account",
            reference: "INV-2024-001"
        },
        {
            id: "1700000000002",
            date: new Date().toISOString().slice(0,10),
            description: "Sample Office Rent",
            category: "Operational",
            type: "expense",
            amount: 15000.00,
            secondAccount: "",
            reference: "RENT-MAR2024"
        },
        {
            id: "1700000000003",
            date: new Date().toISOString().slice(0,10),
            description: "Sample Bank Transfer",
            category: "Banking",
            type: "transfer",
            amount: 5000.00,
            secondAccount: "Cash Account",
            reference: "TRF-001"
        },
        {
            id: "1700000000004",
            date: new Date().toISOString().slice(0,10),
            description: "Sample Owner Investment",
            category: "Capital",
            type: "equity",
            amount: 100000.00,
            secondAccount: "Bank Account",
            reference: "INV-001"
        },
        {
            id: "1700000000005",
            date: new Date().toISOString().slice(0,10),
            description: "Sample Bank Loan",
            category: "Financing",
            type: "liability",
            amount: 50000.00,
            secondAccount: "Bank Account",
            reference: "LOAN-2024-001"
        }
    ];
    
    // Updated headers including new fields
    const headers = ["ID", "Date", "Description", "Category", "Type", "Amount", "Second Account", "Reference"];
    const csvRows = [headers];
    
    for(let t of templateData) {
        csvRows.push([
            t.id,
            t.date,
            t.description,
            t.category,
            t.type,
            t.amount.toFixed(2),
            t.secondAccount,
            t.reference
        ]);
    }
    
    const csvContent = csvRows.map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    
    // Add detailed instructions
    const instructions = [
        '# LEDGERCORE IMPORT TEMPLATE - Version 2.0',
        '# ==========================================',
        '# INSTRUCTIONS:',
        '# 1. Keep the header row exactly as shown below',
        '# 2. "ID" must be unique for each transaction (any number, leave blank for auto-generate)',
        '# 3. "Date" format: YYYY-MM-DD (e.g., 2026-04-19)',
        '# 4. "Description" is required - brief description of transaction',
        '# 5. "Category" is optional - leave blank for uncategorized',
        '# 6. "Type" must be one of: income, expense, transfer, equity, liability, asset, adjustment',
        '# 7. "Amount" must be a positive number (e.g., 1500.50)',
        '# 8. "Second Account" - For transfers: where money is coming from/to',
        '# 9. "Reference" - Optional: Invoice #, Cheque #, Loan ID, etc.',
        '# 10. Save as CSV file before importing',
        '#',
        '# TRANSACTION TYPE GUIDE:',
        '# - income: Revenue from sales/services',
        '# - expense: Costs and expenditures',
        '# - transfer: Moving money between accounts',
        '# - equity: Owner investment or withdrawal',
        '# - liability: Loans or borrowings',
        '# - asset: Purchase or disposal of assets',
        '# - adjustment: Corrections or reclassifications',
        '#',
    ];
    
    const fullContent = instructions.join("\n") + "\n" + csvContent;
    
    const blob = new Blob([fullContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", "ledgercore_import_template_v2.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showAlertModal("Template Downloaded", 
        "Updated template CSV file has been downloaded.\n\n" +
        "📋 What's new in Version 2:\n" +
        "• Added 'Second Account' field for transfers\n" +
        "• Added 'Reference' field for invoice/cheque numbers\n" +
        "• New transaction types: transfer, equity, liability, asset, adjustment\n\n" +
        "The template includes examples of all transaction types.");
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
        showAlertModal("Invalid File", "Please select a CSV file.");
        return;
    }
    
    showConfirmModal("Confirm Import", 
        `This will add transactions from "${file.name}" to your existing data. Duplicate entries will be skipped. Continue?`, 
        () => {
            importFromCSV(file);
            document.getElementById('importFileInput').value = ''; // Reset file input
        });
}

// Import CSV function
function importFromCSV(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        // Find the header row (skip comment lines starting with #)
        let headerLine = '';
        let dataStartIndex = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim() && !lines[i].trim().startsWith('#')) {
                headerLine = lines[i];
                dataStartIndex = i + 1;
                break;
            }
        }
        
        if (!headerLine) {
            showAlertModal("Invalid Format", "No valid CSV header found.");
            return;
        }
        
        // Parse headers
        const headers = headerLine.split(',').map(h => h.replace(/"/g, '').trim());
        
        // Check which format is being used (old vs new)
        const hasNewFields = headers.includes('Second Account') || headers.includes('Reference');
        const hasOldFields = headers.includes('ID') && headers.includes('Date') && headers.includes('Description') && headers.includes('Type') && headers.includes('Amount');
        
        if (!hasOldFields) {
            showAlertModal("Invalid Format", "CSV must contain columns: ID, Date, Description, Type, Amount (minimum)");
            return;
        }
        
        let importedCount = 0;
        let skippedCount = 0;
        let upgradedCount = 0;
        
        for (let i = dataStartIndex; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            // Parse CSV line respecting quotes
            const matches = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
            if (!matches || matches.length < 6) {
                skippedCount++;
                continue;
            }
            
            const cleanMatches = matches.map(m => m.replace(/^"|"$/g, '').trim());
            
            // Map based on header positions
            const idIndex = headers.indexOf('ID');
            const dateIndex = headers.indexOf('Date');
            const descIndex = headers.indexOf('Description');
            const catIndex = headers.indexOf('Category');
            const typeIndex = headers.indexOf('Type');
            const amountIndex = headers.indexOf('Amount');
            const secondAccIndex = headers.indexOf('Second Account');
            const refIndex = headers.indexOf('Reference');
            
            const idStr = idIndex !== -1 ? cleanMatches[idIndex] : '';
            const date = dateIndex !== -1 ? cleanMatches[dateIndex] : '';
            const description = descIndex !== -1 ? cleanMatches[descIndex] : '';
            const category = catIndex !== -1 ? cleanMatches[catIndex] : '';
            let type = typeIndex !== -1 ? cleanMatches[typeIndex] : '';
            const amountStr = amountIndex !== -1 ? cleanMatches[amountIndex] : '';
            const secondAccount = secondAccIndex !== -1 ? cleanMatches[secondAccIndex] : '';
            const reference = refIndex !== -1 ? cleanMatches[refIndex] : '';
            
            // Validate required fields
            if (!date || !description || !type || !amountStr) {
                skippedCount++;
                continue;
            }
            
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount <= 0) {
                skippedCount++;
                continue;
            }
            
            // Validate and normalize type (handle old format where only income/expense existed)
            const validTypes = ['income', 'expense', 'transfer', 'equity', 'liability', 'asset', 'adjustment'];
            if (!validTypes.includes(type)) {
                // If old format with only income/expense, keep as is
                if (type !== 'income' && type !== 'expense') {
                    skippedCount++;
                    continue;
                }
            }
            
            // Check for duplicate ID
            const exists = transactions.some(t => t.id.toString() === idStr);
            if (exists && idStr) {
                skippedCount++;
                continue;
            }
            
            // Create transaction object with new fields
            const newTransaction = {
                id: idStr || generateId(),
                date: date,
                description: description,
                category: category === '—' || category === 'Uncategorized' || !category ? '' : category,
                type: type,
                amount: amount,
                secondAccount: secondAccount || '',
                reference: reference || ''
            };
            
            // If importing old format, mark as upgraded
            if (!hasNewFields && (type === 'income' || type === 'expense')) {
                upgradedCount++;
            }
            
            transactions.push(newTransaction);
            importedCount++;
        }
        
        if (importedCount > 0) {
            // Re-sort transactions
            transactions = sortTransactionsByDate(transactions);
            saveToLocal();
            renderAll();
            
            let message = `Successfully imported ${importedCount} transactions. Skipped: ${skippedCount}.`;
            if (upgradedCount > 0) {
                message += `\n${upgradedCount} transactions were upgraded to the new format (now support Second Account and Reference fields).`;
            }
            showAlertModal("Import Complete", message);
        } else {
            showAlertModal("Import Failed", "No valid transactions found in the file. Please check the format.");
        }
    };
    
    reader.onerror = function() {
        showAlertModal("Import Error", "Failed to read the file. Please try again.");
    };
    
    reader.readAsText(file);
}

