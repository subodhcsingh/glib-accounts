// ============ RENDER FUNCTION ============
function renderAll() {
    const tbody = document.getElementById('transactionsTbody');
    const { totalIncome, totalExpense, balance } = computeTotals();
    
    document.getElementById('totalBalance').innerText = formatCurrency(balance);
    document.getElementById('totalIncome').innerText = formatCurrency(totalIncome);
    document.getElementById('totalExpense').innerText = formatCurrency(totalExpense);
    document.getElementById('transactionCount').innerText = transactions.length;

    if(transactions.length === 0) {
        tbody.innerHTML = '<tr class="empty-row"><td colspan="7">No transactions yet. Click "Add Transaction" to start.</td></tr>';
        return;
    }
    
    const sortedTransactions = sortTransactionsByDate(transactions);
    let html = '';
    
    sortedTransactions.forEach((tx) => {
        const typeLabel = getTransactionTypeLabel(tx.type);
        const typeIcon = getTransactionTypeIcon(tx.type);
        const amountFormatted = formatCurrency(tx.amount);
        
        let signDisplay = '';
        if (tx.type === TRANSACTION_TYPES.INCOME || tx.type === TRANSACTION_TYPES.EQUITY || tx.type === TRANSACTION_TYPES.LIABILITY) {
            signDisplay = '+';
        } else if (tx.type === TRANSACTION_TYPES.EXPENSE || tx.type === TRANSACTION_TYPES.ASSET) {
            signDisplay = '-';
        } else if (tx.type === TRANSACTION_TYPES.TRANSFER) {
            signDisplay = '↔️';
        } else {
            signDisplay = '±';
        }
        
        const secondAccountInfo = tx.secondAccount ? ` → ${tx.secondAccount}` : '';
        const referenceInfo = tx.reference ? ` (${tx.reference})` : '';
        
        html += `
            <tr>
                <td>${escapeHtml(tx.date)}</td>
                <td><strong>${escapeHtml(tx.description)}${referenceInfo}</strong><br>
                    <small style="color:#666;">${typeIcon} ${typeLabel}${secondAccountInfo}</small>
                </td>
                <td>${escapeHtml(tx.category || '—')}</td>
                <td><span class="type-badge">${typeLabel}</span></td>
                <td style="text-align: right; font-weight:500;">${signDisplay} ${amountFormatted}</td>
                <td style="text-align: center;"><button class="delete-btn-icon" data-id="${tx.id}" title="Delete transaction">🗑️</button></td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;

    tbody.addEventListener( 'click', ( e ) => {
        const deleteBtn = e.target.closest( '.delete-btn-icon' );
        if ( deleteBtn ) {
            e.stopPropagation();
            const id = parseInt( deleteBtn.getAttribute( 'data-id' ) );
            const transaction = transactions.find( t => t.id === id );
            if ( transaction ) {
                showConfirmModal( "Delete Transaction", `Delete "${transaction.description}"?`, () => {
                    const index = transactions.findIndex( t => t.id === id );
                    if ( index !== -1 ) {
                        deleteTransaction( index );
                        showAlertModal( "Deleted", "Transaction removed." );
                    }
                } );
            }
        }
    } );

    // In renderAll() function, after setting tbody.innerHTML
    
    // Attach delete events
    document.querySelectorAll( '.delete-btn-icon' ).forEach( btn => {
        console.log("Attaching delete listener to button with ID:", btn.getAttribute('data-id')); // Debug
        btn.addEventListener( 'click', ( e ) => {
            console.log("Delete button clicked!"); // Debug
            e.stopPropagation();
            const id = parseInt(btn.getAttribute('data-id'));
            const transaction = transactions.find(t => t.id === id);
            if(transaction) {
                showConfirmModal("Delete Transaction", `Delete "${transaction.description}"?`, () => {
                    const index = transactions.findIndex(t => t.id === id);
                    if ( index !== -1 ) {
                        deleteTransaction( index );
                        showAlertModal( "Deleted", "Transaction removed." );
                    }
                });
            }
        });
    });
}