// 2. Export/Import Component
const dataIOConfig = {
    elements: {
        'click': ['exportDataBtn', 'importDataBtn', 'downloadTemplateBtn']
    },
    events: {
        'click': (e) => {
            switch(e.target.id) {
                case 'exportDataBtn': exportToCSV(); break;
                case 'importDataBtn': document.getElementById('importFileInput').click(); break;
                case 'downloadTemplateBtn': downloadTemplate(); break;
            }
        }
    }
};

// 3. File Input Component
const fileInputConfig = {
    elements: {
        'change': ['importFileInput']
    },
    events: {
        'change': (e) => {
            if (e.target.id === 'importFileInput') handleFileSelect(e);
        }
    }
};

// 4. Reset Component
const resetConfig = {
    elements: {
        'click': ['resetAllBtn']
    },
    events: {
        'click': () => handleReset()
    }
};

// 5. Report Buttons Component
const reportButtonsConfig = {
    elements: {
        'click': [
            'reportBalanceSheetBtn', 'reportProfitLossBtn', 
            'reportLedgerBtn', 'reportCategoryBtn', 'reportIndividualLedgerBtn',
            'reportJournalEntriesBtn'
        ]
    },
    events: {
        'click': (e) => {
            const reportMap = {
                'reportBalanceSheetBtn': 'balance',
                'reportProfitLossBtn': 'pnl',
                'reportLedgerBtn': 'ledger',
                'reportCategoryBtn': 'category',
                'reportIndividualLedgerBtn': 'individual',
                'reportJournalEntriesBtn': 'journal'
            };
            
            const reportType = reportMap[e.target.id];
            if (reportType === 'individual') {
                showIndividualLedgerSelector();
            } else if (reportType) {
                showReportByType(reportType);
            }
        }
    }
};

// 6. Modal Dialog Components (Confirm, Alert, Report)
const modalComponents = ['confirmModal', 'alertModal', 'reportModal', 'accountSelectModal'];
const modalConfig = {
    elements: {
        'click': ['confirmYesBtn', 'confirmNoBtn', 'alertOkBtn', 'closeReportBtn', 'exportReportBtn', 'viewLedgerBtn', 'closeAccountSelectBtn']
    },
    events: {
        'click': (e) => {
            const modalHandlers = {
                'confirmYesBtn': () => { if(confirmCallback) confirmCallback(); closeConfirmModal(); },
                'confirmNoBtn': () => closeConfirmModal(),
                'alertOkBtn': () => closeAlertModal(),
                'closeReportBtn': () => document.getElementById('reportModal').classList.remove('active'),
                'exportReportBtn': () => exportReportToCSV(),
                'viewLedgerBtn': () => handleViewLedger(),
                'closeAccountSelectBtn': () => document.getElementById('accountSelectModal').classList.remove('active')
            };
            
            if (modalHandlers[e.target.id]) {
                modalHandlers[e.target.id]();
            }
        }
    }
};

// 7. Modal Overlay Component (handles closing when clicking outside)
const overlayConfig = {
    elements: {
        'click': modalComponents
    },
    events: {
        'click': (e) => {
            const modal = e.target;
            const modalId = modal.id;
            const closeHandlers = {
                'transactionModal': closeTransactionModal,
                'confirmModal': closeConfirmModal,
                'alertModal': closeAlertModal,
                'reportModal': () => document.getElementById('reportModal').classList.remove('active'),
                'accountSelectModal': () => document.getElementById('accountSelectModal').classList.remove('active')
            };
            
            if (closeHandlers[modalId]) {
                closeHandlers[modalId]();
            }
        }
    }
};
