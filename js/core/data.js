// ============ DATA MANAGEMENT ============
let transactions = [];

// Demo data
const getDemoData = () => [
    { 
        id: Date.now()+1, date: new Date().toISOString().slice(0,10), 
        description: "Business Investment", category: "Capital", 
        type: TRANSACTION_TYPES.EQUITY, amount: 100000.00,
        secondAccount: "Cash Account", reference: "INV-001"
    },
    { 
        id: Date.now()+2, date: new Date().toISOString().slice(0,10), 
        description: "Bank Loan Received", category: "Financing", 
        type: TRANSACTION_TYPES.LIABILITY, amount: 50000.00,
        secondAccount: "Bank Account", reference: "LOAN-2024-001"
    },
    // Add more demo data as needed
];

function loadData() {
    const stored = localStorage.getItem("ledgercore_transactions");
    if(stored) {
        try {
            transactions = JSON.parse(stored);
        } catch(e) { transactions = []; }
    } else {
        // Enhanced demo data with various transaction types
        transactions = [
            { 
                id: Date.now()+1, date: new Date().toISOString().slice(0,10), 
                description: "Business Investment", category: "Capital", 
                type: "equity", amount: 100000.00,
                secondAccount: "Cash Account", reference: "INV-001"
            },
            { 
                id: Date.now()+2, date: new Date().toISOString().slice(0,10), 
                description: "Bank Loan Received", category: "Financing", 
                type: "liability", amount: 50000.00,
                secondAccount: "Bank Account", reference: "LOAN-2024-001"
            },
            { 
                id: Date.now()+3, date: new Date().toISOString().slice(0,10), 
                description: "Equipment Purchase", category: "Assets", 
                type: "asset", amount: 25000.00,
                secondAccount: "Vendor Account", reference: "PO-1234"
            },
            { 
                id: Date.now()+4, date: new Date().toISOString().slice(0,10), 
                description: "Consulting Income", category: "Services", 
                type: "income", amount: 15000.00,
                secondAccount: "", reference: "INV-2024-001"
            },
            { 
                id: Date.now()+5, date: new Date().toISOString().slice(0,10), 
                description: "Office Rent", category: "Operational", 
                type: "expense", amount: 8000.00,
                secondAccount: "", reference: "RENT-MAR2024"
            }
        ];
        saveToLocal();
    }
    renderAll();
}


function addTransaction(txn) {
    transactions.push(txn);
    transactions = sortTransactionsByDate(transactions);
    saveToLocal();
    renderAll();
}

function updateTransaction(index, updatedTxn) {
    transactions[index] = updatedTxn;
    transactions = sortTransactionsByDate(transactions);
    saveToLocal();
    renderAll();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    transactions = sortTransactionsByDate(transactions);
    saveToLocal();
    renderAll();
}

function computeTotals() {
    let totalIncome = 0, totalExpense = 0;
    transactions.forEach(t => {
        if(t.type === TRANSACTION_TYPES.INCOME) totalIncome += t.amount;
        else if(t.type === TRANSACTION_TYPES.EXPENSE) totalExpense += t.amount;
    });
    const balance = totalIncome - totalExpense;
    return { totalIncome, totalExpense, balance };
}

        // reset with modal confirm

function handleReset() {
            showConfirmModal( "⚠️ Reset All Data", "This will permanently delete ALL transactions. This action cannot be undone. Continue?", () => {
                resetAllData();
            } );
}