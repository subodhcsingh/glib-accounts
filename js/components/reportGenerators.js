
function generateBalanceSheet() {
    const { totalIncome, totalExpense, balance } = computeTotals();
    
    const assets = totalIncome;
    const liabilities = totalExpense;
    const equity = balance;
    
    let html = `
        <div style="font-family: monospace;">
            <h3 style="color: #1f486b; margin-bottom: 1rem;">📊 BALANCE SHEET</h3>
            <p style="color: #666; font-size: 0.8rem; margin-bottom: 1.5rem;">As of ${new Date().toLocaleDateString()}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                <div style="background: #f8fafc; padding: 1rem; border-radius: 16px;">
                    <h4 style="color: #2b5879; margin-bottom: 1rem;">ASSETS</h4>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #dee9ef;">
                        <span>Total Income Received</span>
                        <span style="font-weight: 600;">${formatCurrency(assets)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; margin-top: 0.5rem; font-weight: bold; border-top: 2px solid #cbd5e1;">
                        <span>TOTAL ASSETS</span>
                        <span>${formatCurrency(assets)}</span>
                    </div>
                </div>
                
                <div style="background: #f8fafc; padding: 1rem; border-radius: 16px;">
                    <h4 style="color: #2b5879; margin-bottom: 1rem;">LIABILITIES & EQUITY</h4>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #dee9ef;">
                        <span>Total Expenses</span>
                        <span style="font-weight: 600;">${formatCurrency(liabilities)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                        <span>Owner's Equity (Net Balance)</span>
                        <span style="font-weight: 600;">${formatCurrency(equity)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; margin-top: 0.5rem; font-weight: bold; border-top: 2px solid #cbd5e1;">
                        <span>TOTAL LIABILITIES & EQUITY</span>
                        <span>${formatCurrency(liabilities + equity)}</span>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 1.5rem; padding: 0.8rem; background: #eef2ff; border-radius: 12px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold;">
                    <span>Accounting Equation Check:</span>
                    <span>Assets (${formatCurrency(assets)}) = Liabilities + Equity (${formatCurrency(liabilities + equity)})</span>
                </div>
            </div>
        </div>
    `;
    return html;
}

function generateProfitLoss() {
    const { totalIncome, totalExpense, balance } = computeTotals();
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    const oldestDate = sortedTransactions.length > 0 ? sortedTransactions[0].date : 'N/A';
    const newestDate = sortedTransactions.length > 0 ? sortedTransactions[sortedTransactions.length - 1].date : 'N/A';
    
    const incomeByCategory = {};
    const expenseByCategory = {};
    
    transactions.forEach(t => {
        const cat = t.category && t.category !== '—' && t.category !== 'Uncategorized' ? t.category : 'Uncategorized';
        if (t.type === 'income') {
            incomeByCategory[cat] = (incomeByCategory[cat] || 0) + t.amount;
        } else if (t.type === 'expense') {
            expenseByCategory[cat] = (expenseByCategory[cat] || 0) + t.amount;
        }
    });
    
    let html = `
        <div style="font-family: monospace;">
            <h3 style="color: #1f486b; margin-bottom: 1rem;">📈 PROFIT & LOSS STATEMENT</h3>
            <p style="color: #666; font-size: 0.8rem; margin-bottom: 1.5rem;">Period: ${oldestDate} to ${newestDate}</p>
            
            <div style="background: #f8fafc; padding: 1rem; border-radius: 16px; margin-bottom: 1rem;">
                <h4 style="color: #2b5879; margin-bottom: 1rem;">INCOME (Revenue)</h4>
                ${Object.entries(incomeByCategory).sort().map(([cat, amt]) => `
                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #e2edf2;">
                        <span>${cat}</span>
                        <span>${formatCurrency(amt)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; margin-top: 0.5rem; font-weight: bold; border-top: 2px solid #cbd5e1;">
                    <span>TOTAL INCOME</span>
                    <span style="color: #2b7e3a;">${formatCurrency(totalIncome)}</span>
                </div>
            </div>
            
            <div style="background: #f8fafc; padding: 1rem; border-radius: 16px; margin-bottom: 1rem;">
                <h4 style="color: #2b5879; margin-bottom: 1rem;">EXPENSES (Costs)</h4>
                ${Object.entries(expenseByCategory).sort().map(([cat, amt]) => `
                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; border-bottom: 1px solid #e2edf2;">
                        <span>${cat}</span>
                        <span>${formatCurrency(amt)}</span>
                    </div>
                `).join('')}
                <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; margin-top: 0.5rem; font-weight: bold; border-top: 2px solid #cbd5e1;">
                    <span>TOTAL EXPENSES</span>
                    <span style="color: #bc4e2c;">${formatCurrency(totalExpense)}</span>
                </div>
            </div>
            
            <div style="background: #eef2ff; padding: 1rem; border-radius: 16px;">
                <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: bold;">
                    <span>NET PROFIT / (LOSS)</span>
                    <span style="color: ${balance >= 0 ? '#2b7e3a' : '#bc4e2c'};">${formatCurrency(balance)}</span>
                </div>
            </div>
        </div>
    `;
    return html;
}

function generateGeneralLedger() {
    if (transactions.length === 0) {
        return `<div style="text-align: center; padding: 2rem;">No transactions to display.</div>`;
    }
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    
    let html = `
        <div style="font-family: monospace;">
            <h3 style="color: #1f486b; margin-bottom: 1rem;">📒 GENERAL LEDGER</h3>
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
                    <thead>
                        <tr style="background: #f1f5f9;">
                            <th style="padding: 0.5rem; text-align: left;">Date</th>
                            <th style="padding: 0.5rem; text-align: left;">Description</th>
                            <th style="padding: 0.5rem; text-align: left;">Type</th>
                            <th style="padding: 0.5rem; text-align: right;">Debit (₹)</th>
                            <th style="padding: 0.5rem; text-align: right;">Credit (₹)</th>
                            <th style="padding: 0.5rem; text-align: right;">Balance (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    let runningBalance = 0;
    
    sortedTransactions.forEach(t => {
        const isIncome = (t.type === 'income' || t.type === 'equity' || t.type === 'liability');
        const debit = isIncome ? t.amount : 0;
        const credit = !isIncome ? t.amount : 0;
        runningBalance = runningBalance + debit - credit;
        
        html += `
            <tr style="border-bottom: 1px solid #e2edf2;">
                <td style="padding: 0.5rem;">${t.date}</td>
                <td style="padding: 0.5rem;">${escapeHtml(t.description)}</td>
                <td style="padding: 0.5rem;">${getTransactionTypeLabel(t.type)}</td>
                <td style="padding: 0.5rem; text-align: right; color: #2b7e3a;">${debit > 0 ? `${formatCurrency(debit)}` : '—'}</td>
                <td style="padding: 0.5rem; text-align: right; color: #bc4e2c;">${credit > 0 ? `${formatCurrency(credit)}` : '—'}</td>
                <td style="padding: 0.5rem; text-align: right; font-weight: bold;">${formatCurrency(runningBalance)}</td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    return html;
}

// Generate Category Summary
// function generateCategorySummary() {
//     const summary = {};
    
//     transactions.forEach(t => {
//         const cat = t.category && t.category !== '—' && t.category !== 'Uncategorized' ? t.category : 'Uncategorized';
//         if (!summary[cat]) {
//             summary[cat] = { income: 0, expense: 0, count: 0 };
//         }
//         if (t.type === 'income') {
//             summary[cat].income += t.amount;
//         } else {
//             summary[cat].expense += t.amount;
//         }
//         summary[cat].count++;
//     });
    
//     let html = `
//         <div style="font-family: monospace;">
//             <h3 style="color: #1f486b; margin-bottom: 1rem;">🏷️ CATEGORY SUMMARY</h3>
//             <p style="color: #666; font-size: 0.8rem; margin-bottom: 1rem;">Income and expense breakdown by category</p>
//             <table style="width: 100%; border-collapse: collapse;">
//                 <thead>
//                     <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
//                         <th style="padding: 0.6rem; text-align: left;">Category</th>
//                         <th style="padding: 0.6rem; text-align: right;">Income (₹)</th>
//                         <th style="padding: 0.6rem; text-align: right;">Expense (₹)</th>
//                         <th style="padding: 0.6rem; text-align: right;">Net (₹)</th>
//                         <th style="padding: 0.6rem; text-align: center;">Transactions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//     `;
    
//     const sortedCategories = Object.keys(summary).sort();
//     let totalIncome = 0, totalExpense = 0;
    
//     sortedCategories.forEach(cat => {
//         const inc = summary[cat].income;
//         const exp = summary[cat].expense;
//         const net = inc - exp;
//         totalIncome += inc;
//         totalExpense += exp;
        
//         html += `
//             <tr style="border-bottom: 1px solid #e2edf2;">
//                 <td style="padding: 0.6rem;"><strong>${escapeHtml(cat)}</strong></td>
//                 <td style="padding: 0.6rem; text-align: right; color: #2b7e3a;">${inc.toFixed(2)}</td>
//                 <td style="padding: 0.6rem; text-align: right; color: #bc4e2c;">${exp.toFixed(2)}</td>
//                 <td style="padding: 0.6rem; text-align: right; font-weight: ${net !== 0 ? 'bold' : 'normal'};">${net.toFixed(2)}</td>
//                 <td style="padding: 0.6rem; text-align: center;">${summary[cat].count}</td>
//             </tr>
//         `;
//     });
    
//     html += `
//                 </tbody>
//                 <tfoot>
//                     <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
//                         <td style="padding: 0.6rem;"><strong>TOTALS</strong></td>
//                         <td style="padding: 0.6rem; text-align: right; font-weight: bold;">${totalIncome.toFixed(2)}</td>
//                         <td style="padding: 0.6rem; text-align: right; font-weight: bold;">${totalExpense.toFixed(2)}</td>
//                         <td style="padding: 0.6rem; text-align: right; font-weight: bold;">${(totalIncome - totalExpense).toFixed(2)}</td>
//                         <td style="padding: 0.6rem; text-align: center;">${transactions.length}</td>
//                     </tr>
//                 </tfoot>
//             </table>
//         </div>
//     `;
//     return html;
// }

function generateCategorySummary() {
    const summary = {};
    
    transactions.forEach(t => {
        const cat = t.category && t.category !== '—' && t.category !== 'Uncategorized' ? t.category : 'Uncategorized';
        if (!summary[cat]) {
            summary[cat] = { income: 0, expense: 0, count: 0 };
        }
        if (t.type === 'income') {
            summary[cat].income += t.amount;
        } else if (t.type === 'expense') {
            summary[cat].expense += t.amount;
        }
        summary[cat].count++;
    });
    
    let html = `
        <div style="font-family: monospace;">
            <h3 style="color: #1f486b; margin-bottom: 1rem;">🏷️ CATEGORY SUMMARY</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f1f5f9;">
                        <th style="padding: 0.6rem; text-align: left;">Category</th>
                        <th style="padding: 0.6rem; text-align: right;">Income (₹)</th>
                        <th style="padding: 0.6rem; text-align: right;">Expense (₹)</th>
                        <th style="padding: 0.6rem; text-align: right;">Net (₹)</th>
                        <th style="padding: 0.6rem; text-align: center;">Count</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    let totalIncome = 0, totalExpense = 0;
    
    Object.keys(summary).sort().forEach(cat => {
        const inc = summary[cat].income;
        const exp = summary[cat].expense;
        const net = inc - exp;
        totalIncome += inc;
        totalExpense += exp;
        
        html += `
            <tr style="border-bottom: 1px solid #e2edf2;">
                <td style="padding: 0.6rem;"><strong>${escapeHtml(cat)}</strong></td>
                <td style="padding: 0.6rem; text-align: right; color: #2b7e3a;">${formatCurrency(inc)}</td>
                <td style="padding: 0.6rem; text-align: right; color: #bc4e2c;">${formatCurrency(exp)}</td>
                <td style="padding: 0.6rem; text-align: right;">${formatCurrency(net)}</td>
                <td style="padding: 0.6rem; text-align: center;">${summary[cat].count}</td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
                <tfoot>
                    <tr style="background: #f1f5f9;">
                        <td style="padding: 0.6rem;"><strong>TOTALS</strong></td>
                        <td style="padding: 0.6rem; text-align: right; font-weight: bold;">${formatCurrency(totalIncome)}</td>
                        <td style="padding: 0.6rem; text-align: right; font-weight: bold;">${formatCurrency(totalExpense)}</td>
                        <td style="padding: 0.6rem; text-align: right; font-weight: bold;">${formatCurrency(totalIncome - totalExpense)}</td>
                        <td style="padding: 0.6rem; text-align: center;">${transactions.length}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
    return html;
}

// Generate Journal Entry HTML
function generateJournalEntries() {
    if (transactions.length === 0) {
        return `<div style="text-align: center; padding: 2rem;">No transactions to display.</div>`;
    }
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    let html = `
        <div style="font-family: monospace;">
            <h3 style="color: #1f486b; margin-bottom: 1rem;">📓 GENERAL JOURNAL</h3>
            <p style="color: #666; font-size: 0.8rem; margin-bottom: 1rem;">
                All transactions in debit/credit format
            </p>
    `;
    
    sortedTransactions.forEach((tx, index) => {
        const account1 = getAccountForType(tx.type);
        const account2 = getContraAccount(tx.type);
        const isDebit = (tx.type === 'income' || tx.type === 'equity' || tx.type === 'liability');
        
        html += `
            <div style="background: #f8fafc; margin-bottom: 1rem; padding: 1rem; border-radius: 8px; border-left: 4px solid #1f5e8e;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <strong>📅 ${tx.date}</strong>
                    <span style="color: #666;">Journal #${index + 1}</span>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <div><strong>Description:</strong> ${escapeHtml(tx.description)}</div>
                    ${tx.reference ? `<div><strong>Reference:</strong> ${escapeHtml(tx.reference)}</div>` : ''}
                </div>
                <table style="width: 100%; margin-top: 0.5rem; border-collapse: collapse;">
                    <tr style="border-bottom: 1px solid #dee9ef;">
                        <td style="padding: 0.3rem;">${isDebit ? 'Dr.' : 'Cr.'} ${account1}</td>
                        <td style="text-align: right;">${formatCurrency(tx.amount)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.3rem;">${isDebit ? 'Cr.' : 'Dr.'} ${account2}</td>
                        <td style="text-align: right;">${formatCurrency(tx.amount)}</td>
                    </tr>
                </table>
                <div style="margin-top: 0.5rem; font-size: 0.75rem; color: #666;">
                    Type: ${getTransactionTypeLabel(tx.type)} | Category: ${tx.category || '—'}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    return html;
}

// Generate Journal Entries CSV
function generateJournalEntriesCSV() {
    if (transactions.length === 0) {
        return "No transactions to export";
    }
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    let csv = "Journal Entry Report\n";
    csv += `Generated: ${new Date().toLocaleDateString()}\n`;
    csv += "Journal #,Date,Description,Reference,Account Name,Debit (₹),Credit (₹),Transaction Type,Category\n";
    
    sortedTransactions.forEach((tx, index) => {
        const account1 = getAccountForType(tx.type);
        const account2 = getContraAccount(tx.type);
        const isDebit = (tx.type === 'income' || tx.type === 'equity' || tx.type === 'liability');
        
        // First line (Dr. or Cr.)
        csv += `${index + 1},${tx.date},"${tx.description}","${tx.reference || ''}","${account1}",${isDebit ? tx.amount.toFixed(2) : '0'},${!isDebit ? tx.amount.toFixed(2) : '0'},"${tx.type}","${tx.category || ''}"\n`;
        
        // Second line (Cr. or Dr.)
        csv += `${index + 1},${tx.date},"${tx.description}","${tx.reference || ''}","${account2}",${!isDebit ? tx.amount.toFixed(2) : '0'},${isDebit ? tx.amount.toFixed(2) : '0'},"${tx.type}","${tx.category || ''}"\n`;
    });
    
    return csv;
}

// Show report by type (simplified)
function showReportByType(type) {
    if (transactions.length === 0) {
        showAlertModal("No Data", "Add some transactions first to generate reports.");
        return;
    }
    
    const reportGenerators = {
        balance: { 
            title: "Balance Sheet", 
            html: generateBalanceSheet, 
            csv: () => {
                const { totalIncome, totalExpense, balance } = computeTotals();
                return `Report Type,Balance Sheet\nDate,${new Date().toLocaleDateString()}\n\nAssets,${totalIncome}\nLiabilities,${totalExpense}\nEquity,${balance}`;
            }
        },
        pnl: { 
            title: "Profit & Loss Statement", 
            html: generateProfitLoss, 
            csv: () => `Profit & Loss Report\nGenerated: ${new Date().toLocaleDateString()}`
        },
        ledger: { 
            title: "General Ledger", 
            html: generateGeneralLedger, 
            csv: () => {
                let csv = "Date,Description,Category,Type,Amount\n";
                sortTransactionsByDate(transactions).forEach(t => {
                    csv += `${t.date},${t.description},${t.category},${t.type},${t.amount}\n`;
                });
                return csv;
            }
        },
        category: { 
            title: "Category Summary", 
            html: generateCategorySummary, 
            csv: () => "Category Summary Report"
        },
        journal: { 
            title: "Journal Entries", 
            html: generateJournalEntries, 
            csv: generateJournalEntriesCSV
        }
    };
    
    const generator = reportGenerators[type];
    if (generator) {
        showReport(generator.title, generator.html(), generator.csv());
    } else {
        console.error("Unknown report type:", type);
        showAlertModal("Error", "Report type not found.");
    }
}

let currentReportData = null;
let currentReportType = '';

