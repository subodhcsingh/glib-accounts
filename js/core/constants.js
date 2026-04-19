// ============ CONSTANTS ============
const TRANSACTION_TYPES = {
    INCOME: 'income',
    EXPENSE: 'expense',
    TRANSFER: 'transfer',
    EQUITY: 'equity',
    LIABILITY: 'liability',
    ASSET: 'asset',
    ADJUSTMENT: 'adjustment'
};

const TYPE_LABELS = {
    [TRANSACTION_TYPES.INCOME]: 'Income',
    [TRANSACTION_TYPES.EXPENSE]: 'Expense',
    [TRANSACTION_TYPES.TRANSFER]: 'Transfer',
    [TRANSACTION_TYPES.EQUITY]: 'Owner\'s Equity',
    [TRANSACTION_TYPES.LIABILITY]: 'Liability',
    [TRANSACTION_TYPES.ASSET]: 'Asset',
    [TRANSACTION_TYPES.ADJUSTMENT]: 'Adjustment'
};

const TYPE_ICONS = {
    [TRANSACTION_TYPES.INCOME]: '💰',
    [TRANSACTION_TYPES.EXPENSE]: '💸',
    [TRANSACTION_TYPES.TRANSFER]: '🔄',
    [TRANSACTION_TYPES.EQUITY]: '👤',
    [TRANSACTION_TYPES.LIABILITY]: '🏦',
    [TRANSACTION_TYPES.ASSET]: '📦',
    [TRANSACTION_TYPES.ADJUSTMENT]: '⚙️'
};

const STORAGE_KEY = "ledgercore_transactions";