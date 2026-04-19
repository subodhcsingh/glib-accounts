// ============ INDIVIDUAL LEDGER FUNCTIONS ============
// Get all unique accounts from transactions
function getAllAccounts() {
    const accounts = new Map();
    
    transactions.forEach(t => {
        // Add main category as an account
        const mainAccount = t.category && t.category !== '—' && t.category !== 'Uncategorized' 
            ? t.category 
            : 'Uncategorized';
        
        if (!accounts.has(mainAccount)) {
            accounts.set(mainAccount, { 
                type: t.type, 
                balance: 0, 
                transactionCount: 0 
            });
        }
        
        let amount = t.amount;
        if (t.type === 'expense' || t.type === 'asset' || t.type === 'adjustment') {
            amount = -t.amount;
        }
        const accountData = accounts.get(mainAccount);
        accountData.balance += amount;
        accountData.transactionCount++;
        
        // For transfers, also track the second account
        if (t.type === 'transfer' && t.secondAccount) {
            if (!accounts.has(t.secondAccount)) {
                accounts.set(t.secondAccount, { 
                    type: 'transfer', 
                    balance: 0, 
                    transactionCount: 0 
                });
            }
            const secondData = accounts.get(t.secondAccount);
            secondData.balance += t.amount;
            secondData.transactionCount++;
        }
    });
    
    // Convert to array and sort
    return Array.from(accounts.entries())
        .map(([name, data]) => ({
            name: name,
            type: data.type,
            balance: data.balance,
            transactionCount: data.transactionCount
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
}

// Get transactions for a specific account
function getAccountTransactions(accountName) {
    const accountTransactions = [];
    
    transactions.forEach(t => {
        // Check main category
        const mainAccount = t.category && t.category !== '—' && t.category !== 'Uncategorized' 
            ? t.category 
            : 'Uncategorized';
        
        if (mainAccount === accountName) {
            accountTransactions.push({
                ...t,
                ledgerType: 'main',
                displayDescription: t.description
            });
        }
        
        // Check second account for transfers
        if (t.type === 'transfer' && t.secondAccount === accountName) {
            accountTransactions.push({
                ...t,
                ledgerType: 'secondary',
                displayDescription: `[Received from] ${t.description}`,
                isCredit: true
            });
        }
    });
    
    // Sort by date
    return accountTransactions.sort((a, b) => a.date.localeCompare(b.date));
}

// Generate individual ledger HTML for a specific account
function generateIndividualLedger(accountName) {
    const accountTransactions = getAccountTransactions(accountName);
    
    if (accountTransactions.length === 0) {
        return `<div style="text-align: center; padding: 2rem; color: #666;">No transactions found for this account.</div>`;
    }
    
    // Calculate totals
    let totalDebit = 0;
    let totalCredit = 0;
    let runningBalance = 0;
    
    const transactionsWithBalance = accountTransactions.map(t => {
        const isDebit = (t.type === 'income' || t.type === 'equity' || t.type === 'liability');
        const amount = t.amount;
        
        if (isDebit) {
            totalDebit += amount;
            runningBalance += amount;
        } else {
            totalCredit += amount;
            runningBalance -= amount;
        }
        
        return {
            ...t,
            isDebit,
            amount,
            runningBalance: runningBalance
        };
    });
    
    const finalBalance = totalDebit - totalCredit;
    
    let html = `
        <div style="font-family: 'Courier New', monospace;">
            <h3 style="color: #1f486b; margin-bottom: 0.5rem;">📑 INDIVIDUAL LEDGER</h3>
            <h4 style="color: #2b5879; margin-bottom: 0.5rem;">${escapeHtml(accountName)}</h4>
            <p style="color: #666; font-size: 0.8rem; margin-bottom: 1rem;">
                Period: ${transactionsWithBalance[0].date} to ${transactionsWithBalance[transactionsWithBalance.length-1].date}
            </p>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                <div style="background: #e0f2e6; padding: 0.8rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.7rem;">Total Debit (Dr)</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">${formatCurrency(totalDebit)}</div>
                </div>
                <div style="background: #ffe6df; padding: 0.8rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.7rem;">Total Credit (Cr)</div>
                    <div style="font-size: 1.2rem; font-weight: bold;">${formatCurrency(totalCredit)}</div>
                </div>
                <div style="background: #eef2ff; padding: 0.8rem; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.7rem;">Closing Balance</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: ${finalBalance >= 0 ? '#2b7e3a' : '#bc4e2c'};">
                        ${formatCurrency(Math.abs(finalBalance))} ${finalBalance >= 0 ? '(Dr)' : '(Cr)'}
                    </div>
                </div>
            </div>
            
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
                    <thead>
                        <tr style="background: #f1f5f9; border-bottom: 2px solid #cbd5e1;">
                            <th style="padding: 0.6rem; text-align: left;">Date</th>
                            <th style="padding: 0.6rem; text-align: left;">Particulars</th>
                            <th style="padding: 0.6rem; text-align: left;">Reference</th>
                            <th style="padding: 0.6rem; text-align: right;">Debit (₹)</th>
                            <th style="padding: 0.6rem; text-align: right;">Credit (₹)</th>
                            <th style="padding: 0.6rem; text-align: right;">Balance (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
    `;
    
    let balance = 0;
    
    transactionsWithBalance.forEach(t => {
        const debit = t.isDebit ? t.amount : 0;
        const credit = !t.isDebit ? t.amount : 0;
        balance = balance + debit - credit;
        
        html += `
            <tr style="border-bottom: 1px solid #e2edf2;">
                <td style="padding: 0.6rem;">${t.date}</td>
                <td style="padding: 0.6rem;">
                    ${escapeHtml(t.displayDescription || t.description)}
                    ${t.ledgerType === 'secondary' ? '<span style="color: #999; font-size: 0.7rem;"> (Transfer)</span>' : ''}
                </td>
                <td style="padding: 0.6rem;">${t.reference || '—'}</td>
                <td style="padding: 0.6rem; text-align: right; color: #2b7e3a;">
                    ${debit > 0 ? `${formatCurrency(debit)}` : '—'}
                </td>
                <td style="padding: 0.6rem; text-align: right; color: #bc4e2c;">
                    ${credit > 0 ? `${formatCurrency(credit)}` : '—'}
                </td>
                <td style="padding: 0.6rem; text-align: right; font-weight: ${balance === finalBalance ? 'bold' : 'normal'};">
                    ${formatCurrency(balance)}
                </td>
            </tr>
        `;
    });
    
    html += `
                    </tbody>
                    <tfoot>
                        <tr style="background: #f1f5f9; border-top: 2px solid #cbd5e1;">
                            <td colspan="3" style="padding: 0.6rem;"><strong>TOTALS</strong></td>
                            <td style="padding: 0.6rem; text-align: right;"><strong>${formatCurrency(totalDebit)}</strong></td>
                            <td style="padding: 0.6rem; text-align: right;"><strong>${formatCurrency(totalCredit)}</strong></td>
                            <td style="padding: 0.6rem; text-align: right;"><strong>${formatCurrency(balance)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    `;
    
    return html;
}

// Populate the account selection dropdown

function populateAccountSelect() {
    console.log("=== populateAccountSelect START ===");
    
    const accounts = getAllAccounts();
    console.log("Accounts found:", accounts);
    console.log("Number of accounts:", accounts.length);
    
    const select = document.getElementById('accountSelect');
    console.log("Select element:", select);
    
    if (!select) {
        console.error("ERROR: accountSelect dropdown not found!");
        return;
    }
    
    select.innerHTML = '<option value="">-- Select an account --</option>';
    
    accounts.forEach(account => {
        const option = document.createElement('option');
        option.value = account.name;
        const balanceText = account.balance >= 0 ? 'Dr' : 'Cr';
        option.textContent = `${account.name} (${account.transactionCount} txns | ${balanceText} ${formatCurrency(Math.abs(account.balance))})`;
        select.appendChild(option);
        console.log(`Added option: ${account.name}`);
    });
    
    console.log("=== populateAccountSelect END ===");
}

// Show individual ledger selector modal
function showIndividualLedgerSelector() {
    if (transactions.length === 0) {
        showAlertModal("No Data", "Add some transactions first to view individual ledgers.");
        return;
    }
    populateAccountSelect();
    const modal = document.getElementById('accountSelectModal');
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error("accountSelectModal not found in DOM");
        showAlertModal("Error", "Individual Ledger feature is not properly configured.");
    }
}

// Handle view ledger button click
function handleViewLedger() {
    const select = document.getElementById('accountSelect');
    if (!select) {
        showAlertModal("Error", "Account selector not found.");
        return;
    }
    
    const selectedAccount = select.value;
    if (!selectedAccount) {
        showAlertModal("No Selection", "Please select an account to view.");
        return;
    }
    
    const html = generateIndividualLedger(selectedAccount);
    const csv = generateIndividualLedgerCSV(selectedAccount);
    
    // Close the account select modal
    const accountModal = document.getElementById('accountSelectModal');
    if (accountModal) accountModal.classList.remove('active');
    
    // Show the report
    showReport(`Ledger: ${selectedAccount}`, html, csv);
}

// Generate CSV for individual ledger
function generateIndividualLedgerCSV(accountName) {
    const transactions = getAccountTransactions(accountName);
    let csv = `Individual Ledger: ${accountName}\n`;
    csv += `Generated: ${new Date().toLocaleDateString()}\n\n`;
    csv += "Date,Particulars,Reference,Debit (₹),Credit (₹),Balance (₹)\n";
    
    let balance = 0;
    transactions.forEach(t => {
        const isDebit = (t.type === 'income' || t.type === 'equity' || t.type === 'liability');
        const debit = isDebit ? t.amount : 0;
        const credit = !isDebit ? t.amount : 0;
        balance += debit - credit;
        
        csv += `"${t.date}","${t.displayDescription || t.description}","${t.reference || '—'}",${debit.toFixed(2)},${credit.toFixed(2)},${balance.toFixed(2)}\n`;
    });
    
    return csv;
}