// ============ STORAGE FUNCTIONS ============
function saveToLocal() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function loadFromLocal() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch(e) {
            return [];
        }
    }
    return null;
}