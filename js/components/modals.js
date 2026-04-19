// ============ MODAL FUNCTIONS ============
let confirmCallback = null;

        const confirmModal = document.getElementById( 'confirmModal' );
        const alertModal = document.getElementById( 'alertModal' );
        const transactionModal = document.getElementById( 'transactionModal' );

function showConfirmModal(title, message, onConfirm) {
    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMessage').innerHTML = message;
    document.getElementById('confirmModal').classList.add('active');
    confirmCallback = onConfirm;
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.remove('active');
    confirmCallback = null;
}

function showAlertModal(title, message) {
    document.getElementById('alertTitle').innerText = title;
    document.getElementById('alertMessage').innerHTML = message;
    document.getElementById('alertModal').classList.add('active');
}

function closeAlertModal() {
    document.getElementById('alertModal').classList.remove('active');
}

function showReport(title, html, csv) {
    window.currentReportData = csv;
    window.currentReportType = title;
    document.getElementById('reportModalTitle').innerText = title;
    document.getElementById('reportModalBody').innerHTML = html;
    document.getElementById('reportModal').classList.add('active');
}

function exportReportToCSV() {
    if ( !window.currentReportData ) {
        showAlertModal( "No Report", "Please generate a report first." );
        return;
    }
    const blob = new Blob( [ window.currentReportData ], { type: "text/csv;charset=utf-8;" } );
    const link = document.createElement( "a" );
    const url = URL.createObjectURL( blob );
    link.href = url;
    link.setAttribute( "download", `${window.currentReportType}_${new Date().toISOString().slice( 0, 19 )}.csv` );
    document.body.appendChild( link );
    link.click();
    document.body.removeChild( link );
    URL.revokeObjectURL( url );
    showAlertModal( "Export Complete", "Report exported successfully." );
}