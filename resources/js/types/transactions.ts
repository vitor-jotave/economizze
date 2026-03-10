export type Transaction = {
    id: number;
    type: string;
    type_label: string;
    amount: number;
    transacted_at: string | null;
    transacted_at_label: string | null;
    account: {
        id: number | null;
        name: string | null;
        color: string | null;
    };
    category: {
        id: number | null;
        name: string | null;
        color: string | null;
        icon: string | null;
    };
    updated_at: string | null;
};

export type TransactionTypeOption = {
    value: string;
    label: string;
};

export type TransactionAccountOption = {
    id: number;
    name: string;
    type: string;
    type_label: string;
    color: string;
    currency: string;
};

export type TransactionCategoryOption = {
    id: number;
    name: string;
    type: string;
    type_label: string;
    color: string;
    icon: string;
};

export type TransactionsSummary = {
    income: number;
    expense: number;
    count: number;
};

export type TransactionsPageProps = {
    transactions: Transaction[];
    transactionTypes: TransactionTypeOption[];
    accounts: TransactionAccountOption[];
    categories: TransactionCategoryOption[];
    summary: TransactionsSummary;
    flash: {
        success?: {
            id: string;
            message: string;
        } | null;
    };
};

export type TransactionFormData = {
    type: string;
    amount: string;
    transacted_at: string;
    account_id: string;
    category_id: string;
};
