// Generate 1000 realistic sample transactions
function generateSampleTransactions() {
    const descriptions = {
        income: [
            "Salary Credit", "Consulting Fees", "Freelance Payment", "Client Payment", 
            "Product Sales", "Service Revenue", "Commission Earned", "Bonus Received",
            "Interest Income", "Dividend Income", "Rent Received", "Refund Received",
            "Gift Received", "Tax Refund", "Insurance Claim", "Royalty Income"
        ],
        expense: [
            "Rent Payment", "Electricity Bill", "Water Bill", "Internet Bill",
            "Phone Bill", "Groceries", "Restaurant", "Fuel Purchase",
            "Car Maintenance", "Insurance Premium", "Medical Expenses", "Education Fees",
            "Entertainment", "Shopping", "Subscription Service", "Office Supplies",
            "Travel Expenses", "Hotel Stay", "Flight Ticket", "Tax Payment"
        ],
        transfer: [
            "Bank to Cash", "Cash to Bank", "Savings Transfer", "Account Transfer",
            "Wallet Transfer", "UPI Transfer", "NEFT Transfer", "IMPS Transfer"
        ],
        equity: [
            "Capital Investment", "Additional Capital", "Owner Drawing", 
            "Partner Contribution", "Startup Funding", "Personal Investment"
        ],
        liability: [
            "Bank Loan Received", "Loan Repayment", "Credit Card Payment",
            "Vendor Credit", "EMI Payment", "Interest Payment"
        ],
        asset: [
            "Laptop Purchase", "Office Furniture", "Vehicle Purchase",
            "Equipment Buy", "Property Purchase", "Asset Sale"
        ],
        adjustment: [
            "Correction Entry", "Depreciation", "Amortization", 
            "Reconciliation Adjustment", "Rounding Adjustment"
        ]
    };
    
    const categories = {
        income: ["Salary", "Freelance", "Business", "Investments", "Rental", "Other Income"],
        expense: ["Housing", "Utilities", "Food", "Transport", "Healthcare", "Education", 
                  "Entertainment", "Shopping", "Insurance", "Taxes", "Office", "Travel"],
        transfer: ["Banking", "Cash Management", "Fund Transfer"],
        equity: ["Capital", "Owner's Equity", "Partnership"],
        liability: ["Loans", "Credit", "Financing"],
        asset: ["Equipment", "Property", "Vehicles", "Electronics"],
        adjustment: ["Corrections", "Depreciation"]
    };
    
    const transactions = [];
    const startDate = new Date(2023, 0, 1); // Jan 1, 2023
    const endDate = new Date(); // Today
    
    // Type distribution (realistic business scenario)
    const typeDistribution = [
        'income', 'income', 'income', 'income',  // 40% income
        'expense', 'expense', 'expense', 'expense', 'expense', 'expense', // 60% expense
        'transfer', 'transfer',  // 20% transfer
        'equity', 'liability', 'asset', 'adjustment'  // remaining
    ];
    
    for (let i = 0; i < 1000; i++) {
        // Select type based on distribution
        let type;
        if (i < 400) type = 'income';
        else if (i < 700) type = 'expense';
        else if (i < 820) type = 'transfer';
        else if (i < 900) type = 'equity';
        else if (i < 950) type = 'liability';
        else if (i < 980) type = 'asset';
        else type = 'adjustment';
        
        // Random date within range
        const date = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const dateStr = date.toISOString().split('T')[0];
        
        // Random amount based on type
        let amount;
        if (type === 'income') amount = Math.round((Math.random() * 50000 + 5000) * 100) / 100;
        else if (type === 'expense') amount = Math.round((Math.random() * 20000 + 500) * 100) / 100;
        else if (type === 'transfer') amount = Math.round((Math.random() * 25000 + 1000) * 100) / 100;
        else if (type === 'equity') amount = Math.round((Math.random() * 200000 + 50000) * 100) / 100;
        else if (type === 'liability') amount = Math.round((Math.random() * 100000 + 10000) * 100) / 100;
        else if (type === 'asset') amount = Math.round((Math.random() * 75000 + 5000) * 100) / 100;
        else amount = Math.round((Math.random() * 5000 + 100) * 100) / 100;
        
        // Random description
        const descList = descriptions[type] || descriptions.income;
        const description = descList[Math.floor(Math.random() * descList.length)];
        
        // Random category
        const catList = categories[type] || categories.income;
        const category = catList[Math.floor(Math.random() * catList.length)];
        
        // For transfers, add second account
        let secondAccount = '';
        let reference = '';
        
        if (type === 'transfer') {
            const accounts = ['Savings Account', 'Current Account', 'Cash Account', 'Wallet', 'Fixed Deposit'];
            secondAccount = accounts[Math.floor(Math.random() * accounts.length)];
            reference = `TRF-${Math.floor(Math.random() * 9999)}`;
        } else if (type === 'liability') {
            reference = `LOAN-${Math.floor(Math.random() * 9999)}`;
        } else if (type === 'equity') {
            reference = `INV-${Math.floor(Math.random() * 9999)}`;
        } else if (type === 'asset') {
            reference = `PO-${Math.floor(Math.random() * 9999)}`;
        } else if (Math.random() > 0.7) {
            reference = `REF-${Math.floor(Math.random() * 9999)}`;
        }
        
        transactions.push({
            id: Date.now() + i + Math.random() * 10000,
            date: dateStr,
            description: `${description} ${Math.floor(Math.random() * 100)}`, // Add variation
            category: category,
            type: type,
            amount: amount,
            secondAccount: secondAccount,
            reference: reference
        });
    }
    
    // Sort by date
    transactions.sort((a, b) => a.date.localeCompare(b.date));
    
    return transactions;
}

// Generate and download as CSV
function downloadSampleCSV() {
    const transactions = generateSampleTransactions();
    
    // Create CSV
    const headers = ["ID", "Date", "Description", "Category", "Type", "Amount", "Second Account", "Reference"];
    const csvRows = [headers];
    
    for(let t of transactions) {
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
    
    // Add header comment
    const finalContent = "# LEDGERCORE SAMPLE DATA - 1000 Transactions\n# Generated for testing purposes\n" + csvContent;
    
    const blob = new Blob([finalContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", `sample_1000_transactions_${new Date().toISOString().slice(0,19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log("✅ 1000 sample transactions generated!");
    return transactions;
}

// Add this function to app.js
// function generateAndImportSamples() {
//     showConfirmModal("Generate Sample Data", 
//         "This will add 1000 realistic sample transactions to your existing data.\n\n" +
//         "⚠️ This is for testing only. Continue?", 
//         () => {
//             const sampleTransactions = generateSampleTransactions();
            
//             let addedCount = 0;
//             let duplicateCount = 0;
            
//             sampleTransactions.forEach(sample => {
//                 // Check if transaction with same ID exists
//                 const exists = transactions.some(t => t.id === sample.id);
//                 if (!exists) {
//                     transactions.push(sample);
//                     addedCount++;
//                 } else {
//                     duplicateCount++;
//                 }
//             });
            
//             if (addedCount > 0) {
//                 transactions = sortTransactionsByDate(transactions);
//                 saveToLocal();
//                 renderAll();
//                 showAlertModal("Sample Data Added", 
//                     `✅ Added ${addedCount} sample transactions.\n` +
//                     `⚠️ Skipped ${duplicateCount} duplicates.\n\n` +
//                     `Now you have ${transactions.length} total transactions.`);
//             } else {
//                 showAlertModal("No Changes", "No new transactions were added.");
//             }
//         });
// }
