// ============ APPLICATION ENTRY POINT ============
// This file must be loaded LAST

// Initialize the application
function initApp() {
    console.log("LedgerCore initializing...");
    loadData();
    bindGlobalEvents();
    console.log("LedgerCore ready!");
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// initialize
loadData();
bindGlobalEvents();