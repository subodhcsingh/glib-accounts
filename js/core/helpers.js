// ============ HELPER FUNCTIONS ============
function generateId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function formatCurrencyIndian(amount) {
    // Handle undefined, null, or non-numeric values
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '₹0';
    }
    
    // Convert to number if string
    let num = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    // Format as Indian currency
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
}

// function formatNumberWithSeparator(amount) {
//     let numStr = amount.toFixed(2);
//     let parts = numStr.split('.');
//     let wholePart = parts[0];
//     let decimalPart = parts[1];
//     let reversed = wholePart.split('').reverse().join('');
//     let withCommasReversed = reversed.replace(/\d\d\d(?=\d)/g, '$&,');
//     if (withCommasReversed.length > 3) {
//         withCommasReversed = withCommasReversed.replace(/\d\d(?=\d\d\d)/g, '$&,');
//     }
//     let formattedWhole = withCommasReversed.split('').reverse().join('');
//     formattedWhole = formattedWhole.replace(/^,/, '');
//     return formattedWhole + '.' + decimalPart;
// }

function formatNumberInternational(amount) {
    return amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

const formatCurrency = formatCurrencyIndian;

function sortTransactionsByDate(transactionsArray) {
    return [...transactionsArray].sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.id - b.id;
    });
}

function getTransactionTypeLabel(type) {
    return TYPE_LABELS[type] || type;
}

function getTransactionTypeIcon(type) {
    return TYPE_ICONS[type] || '📝';
}

// Get all unique categories
function getUniqueCategories() {
    const categories = new Set();
    transactions.forEach(t => {
        const cat = t.category && t.category !== '—' && t.category !== 'Uncategorized' ? t.category : 'Uncategorized';
        categories.add(cat);
    });
    return Array.from(categories).sort();
}

function getContraAccount(type) {
    const contra = {
        'income': 'Cash/Bank Account',
        'expense': 'Cash/Bank Account',
        'transfer': 'Counterparty Account',
        'equity': 'Capital Account',
        'liability': 'Cash/Bank Account',
        'asset': 'Cash/Bank Account',
        'adjustment': 'Retained Earnings'
    };
    return contra[type] || 'Counter Account';
}

function getAccountForType(type) {
    const accounts = {
        'income': 'Revenue Account',
        'expense': 'Expense Account',
        'transfer': 'Transfer Account',
        'equity': 'Owner\'s Equity',
        'liability': 'Liability Account',
        'asset': 'Asset Account',
        'adjustment': 'Adjustment Account'
    };
    return accounts[type] || 'General Account';
}