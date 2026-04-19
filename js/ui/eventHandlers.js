// ============ EVENT HANDLER FACTORY ============
// function createButtonHandler(id, action, condition = null) {
//     const btn = document.getElementById(id);
//     if (btn) {
//         const newBtn = btn.cloneNode(true);
//         btn.parentNode.replaceChild(newBtn, btn);
//         newBtn.addEventListener('click', (e) => {
//             e.preventDefault();
//             if (condition && !condition()) return;
//             action();
//         });
//     }
// }


function resetAllData() {
    transactions = [];
    saveToLocal();
    renderAll();
    showAlertModal("Reset", "All data cleared.");
}

function createButtonHandler(buttonId, action, condition = null) {
    const element = document.getElementById(buttonId);
    if (element) {
        // Remove old listener by cloning
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        newElement.addEventListener('click', () => {
            if (condition && !condition()) return;
            action();
        });
    }
}

// Create a button handler factory
function createButtonHandler(buttonId, action, condition = null) {
    const element = document.getElementById(buttonId);
    if (element) {
        const handler = () => {
            if (condition && !condition()) return;
            action();
        };
        element.addEventListener('click', handler);
        return handler;
    }
    return null;
}

// Create a modal handler factory
function createModalHandler(modalId, closeFunction) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const handler = (e) => {
            if (e.target === modal) closeFunction();
        };
        modal.addEventListener('click', handler);
        return handler;
    }
    return null;
}

function bindGlobalEvents() {
    console.log("Initializing event handlers...");
    
    // Main buttons
    createButtonHandler('addEntryBtn', () => openTransactionModal(-1));
    createButtonHandler('exportDataBtn', exportToCSV);
    createButtonHandler('importDataBtn', () => document.getElementById('importFileInput').click());
    createButtonHandler('downloadTemplateBtn', downloadTemplate);
    createButtonHandler('resetAllBtn', () => {
        showConfirmModal("Reset Data", "Delete ALL transactions?", () => {
            transactions = [];
            saveToLocal();
            renderAll();
            showAlertModal("Reset", "All data cleared.");
        });
    } );
    
    // // Add this inside bindGlobalEvents()
    // createButtonHandler( 'generateSampleBtn', () => {
    //     if ( typeof generateAndImportSamples === 'function' ) {
    //         generateAndImportSamples();
    //     } else {
    //         console.warn( "generateAndImportSamples not loaded - test data feature unavailable" );
    //     }
    // } );
    
    // Modal buttons
    createButtonHandler('modalSaveBtn', saveTransactionFromModal);
    createButtonHandler('modalCancelBtn', closeTransactionModal);
    createButtonHandler('confirmYesBtn', () => { if(confirmCallback) confirmCallback(); closeConfirmModal(); });
    createButtonHandler('confirmNoBtn', closeConfirmModal);
    createButtonHandler('alertOkBtn', closeAlertModal);
    createButtonHandler('closeReportBtn', () => document.getElementById('reportModal').classList.remove('active'));
    createButtonHandler( 'exportReportBtn', exportReportToCSV );
    createButtonHandler('reportJournalEntriesBtn', () => showReportByType('journal')); 
    
    // Report buttons
    const reportActions = {
        'reportBalanceSheetBtn': () => showReportByType('balance'),
        'reportProfitLossBtn': () => showReportByType('pnl'),
        'reportLedgerBtn': () => showReportByType('ledger'),
        'reportCategoryBtn': () => showReportByType('category'),
        'reportIndividualLedgerBtn': showIndividualLedgerSelector,
        'reportJournalEntriesBtn': () => showReportByType('journal') 
    };
    
    Object.entries(reportActions).forEach(([id, action]) => {
        createButtonHandler(id, action, () => {
            if (transactions.length === 0) {
                showAlertModal("No Data", "Add transactions first.");
                return false;
            }
            return true;
        });
    });
    
    // Individual Ledger modal buttons
    createButtonHandler('viewLedgerBtn', handleViewLedger);
    createButtonHandler('closeAccountSelectBtn', () => {
        document.getElementById('accountSelectModal').classList.remove('active');
    });
    
    // Dropdown handler
    const txnType = document.getElementById('txnType');
    if (txnType) {
        txnType.addEventListener('change', (e) => handleTransactionTypeChange(e.target.value));
    }
    
    // File input
    const fileInput = document.getElementById('importFileInput');
    if (fileInput) fileInput.addEventListener('change', handleFileSelect);
    
    // Modal overlays
    const modals = ['transactionModal', 'confirmModal', 'alertModal', 'reportModal', 'accountSelectModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    if (modalId === 'transactionModal') closeTransactionModal();
                    else if (modalId === 'confirmModal') closeConfirmModal();
                    else if (modalId === 'alertModal') closeAlertModal();
                    else if (modalId === 'reportModal') document.getElementById('reportModal').classList.remove('active');
                    else if (modalId === 'accountSelectModal') document.getElementById('accountSelectModal').classList.remove('active');
                }
            });
        }
    });
    
    console.log("Event handlers initialized");
}