
// Generate Journal Entry view
function generateJournalEntries() {
    let html = `
        <div style="font-family: monospace;">
            <h3 style="color: #1f486b; margin-bottom: 1rem;">📓 GENERAL JOURNAL</h3>
            <p style="color: #666; font-size: 0.8rem; margin-bottom: 1rem;">All journal entries with debit/credit format</p>
    `;
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    
    sortedTransactions.forEach((tx, index) => {
        const isDebit = (tx.type === 'income' || tx.type === 'equity' || tx.type === 'liability');
        const account1 = tx.type === 'transfer' ? tx.description : getAccountForType(tx.type);
        const account2 = tx.secondAccount || getContraAccount(tx.type);
        
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
                        <td style="text-align: right;">${tx.amount.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 0.3rem;">${isDebit ? 'Cr.' : 'Dr.'} ${account2}</td>
                        <td style="text-align: right;">${tx.amount.toFixed(2)}</td>
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