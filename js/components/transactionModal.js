
// 1. Transaction Modal Component
const transactionModalConfig = {
    elements: {
        'click': ['addEntryBtn', 'modalSaveBtn', 'modalCancelBtn'],
        'change': ['txnType']
    },
    events: {
        'click': (e) => {
            const id = e.target.id;
            if (id === 'addEntryBtn') openTransactionModal(-1);
            if (id === 'modalSaveBtn') saveTransactionFromModal();
            if (id === 'modalCancelBtn') closeTransactionModal();
        },
        'change': (e) => {
            if (e.target.id === 'txnType') {
                handleTransactionTypeChange(e.target.value);
            }
        }
    },
    onInit: () => {
        console.log('Transaction modal initialized');
    }
};

function openTransactionModal( editIdx = -1 ) {
    currentEditIndex = editIdx;
    const form = document.getElementById('transactionForm');
    form.reset();
    document.getElementById('editIndex').value = -1;
    
    // Hide conditional fields initially
    document.getElementById('secondAccountGroup').style.display = 'none';
    document.getElementById('referenceGroup').style.display = 'none';
    
    const modalTitleElem = document.getElementById('modalTitle');
    if(editIdx !== -1 && transactions[editIdx]) {
        modalTitleElem.innerText = "✏️ Edit Transaction";
        const t = transactions[editIdx];
        document.getElementById('txnDate').value = t.date;
        document.getElementById('txnDesc').value = t.description;
        document.getElementById('txnCategory').value = t.category || '';
        document.getElementById('txnType').value = t.type;
        document.getElementById('txnAmount').value = t.amount;
        document.getElementById('txnSecondAccount').value = t.secondAccount || '';
        document.getElementById('txnReference').value = t.reference || '';
        document.getElementById('editIndex').value = editIdx;
        
        // Show appropriate fields based on type
        if (t.type === 'transfer') {
            document.getElementById('secondAccountGroup').style.display = 'block';
            document.getElementById('referenceGroup').style.display = 'block';
        } else if (t.type === 'equity' || t.type === 'liability' || t.type === 'asset') {
            document.getElementById('referenceGroup').style.display = 'block';
        }
    } else {
        modalTitleElem.innerText = "➕ Add Transaction";
        const today = new Date().toISOString().slice(0,10);
        document.getElementById('txnDate').value = today;
    }
    transactionModal.classList.add('active');
}

        function closeTransactionModal() {
            transactionModal.classList.remove( 'active' );
            currentEditIndex = -1;
        }

function saveTransactionFromModal() {
    const date = document.getElementById('txnDate').value.trim();
    const description = document.getElementById('txnDesc').value.trim();
    let category = document.getElementById('txnCategory').value.trim();
    const type = document.getElementById('txnType').value;
    const amountRaw = document.getElementById('txnAmount').value;
    const secondAccount = document.getElementById('txnSecondAccount').value.trim();
    const reference = document.getElementById('txnReference').value.trim();

    if(!date) { showAlertModal("Missing Field", "Please select a valid date."); return; }
    if(!description) { showAlertModal("Missing Field", "Description is required."); return; }
    if(!amountRaw || isNaN(parseFloat(amountRaw)) || parseFloat(amountRaw) <= 0) {
        showAlertModal("Invalid Amount", "Amount must be a positive number (minimum 0.01).");
        return;
    }
    
    // Validate second account for transfer type
    if(type === 'transfer' && !secondAccount) {
        showAlertModal("Missing Field", "Transfer transactions require a secondary account.");
        return;
    }
    
    const amount = parseFloat(amountRaw);
    const editIdxRaw = document.getElementById('editIndex').value;
    const editIndex = (editIdxRaw !== "-1" && editIdxRaw !== "") ? parseInt(editIdxRaw) : -1;
    if(category === "") category = "Uncategorized";

    const txnData = {
        id: (editIndex !== -1 && transactions[editIndex]) ? transactions[editIndex].id : generateId(),
        date: date,
        description: description,
        category: category,
        type: type,
        amount: amount,
        secondAccount: secondAccount || "",
        reference: reference || ""
    };

    if(editIndex !== -1 && transactions[editIndex]) {
        updateTransaction(editIndex, txnData);
        showAlertModal("Updated", "Transaction updated successfully.");
    } else {
        addTransaction(txnData);
        showAlertModal("Added", "New transaction has been recorded.");
    }
    closeTransactionModal();
}

// Handle transaction type dropdown changes
function handleTransactionTypeChange(type) {
    const secondAccountGroup = document.getElementById('secondAccountGroup');
    const referenceGroup = document.getElementById('referenceGroup');
    const secondAccountInput = document.getElementById('txnSecondAccount');
    
    // Define behavior for each type
    const typeBehaviors = {
        transfer: { showSecond: true, showReference: true, secondRequired: true },
        equity: { showSecond: false, showReference: true, secondRequired: false },
        liability: { showSecond: false, showReference: true, secondRequired: false },
        asset: { showSecond: false, showReference: true, secondRequired: false },
        default: { showSecond: false, showReference: false, secondRequired: false }
    };
    
    const behavior = typeBehaviors[type] || typeBehaviors.default;
    
    secondAccountGroup.style.display = behavior.showSecond ? 'block' : 'none';
    referenceGroup.style.display = behavior.showReference ? 'block' : 'none';
    if (secondAccountInput) secondAccountInput.required = behavior.secondRequired;
}

        // transaction modal open for add/edit
        let currentEditIndex = -1;

