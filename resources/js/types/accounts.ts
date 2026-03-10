export type Account = {
    id: number;
    name: string;
    type: string;
    type_label: string;
    institution: string | null;
    currency: string;
    initial_balance: number;
    current_balance: number;
    credit_limit: number;
    available_credit: number;
    color: string;
    updated_at: string | null;
};

export type AccountTypeOption = {
    value: string;
    label: string;
};

export type AccountsSummary = {
    totalBalance: number;
    activeAccounts: number;
    inactiveAccounts: number;
    institutions: number;
};

export type AccountsPageProps = {
    accounts: Account[];
    accountTypes: AccountTypeOption[];
    summary: AccountsSummary;
    flash: {
        success?: {
            id: string;
            message: string;
        } | null;
    };
};

export type AccountFormData = {
    name: string;
    type: string;
    institution: string;
    currency: string;
    initial_balance: string;
    color: string;
};
