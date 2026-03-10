export type DashboardMetricTrend = {
    direction: 'up' | 'down' | 'neutral';
    value: number;
};

export type DashboardSummary = {
    currentBalance: number;
    totalIncome: number;
    totalExpense: number;
    netResult: number;
    transactionCount: number;
    accountsCount: number;
    categoriesCount: number;
};

export type DashboardCategoryBreakdown = {
    name: string;
    color: string;
    icon: string;
    total: number;
    share: number;
};

export type DashboardAccountSnapshot = {
    id: number;
    name: string;
    type_label: string;
    color: string;
    current_balance: number;
};

export type DashboardRecentTransaction = {
    id: number;
    type: string;
    type_label: string;
    amount: number;
    transacted_at_label: string | null;
    account: {
        name: string | null;
        color: string | null;
    };
    category: {
        name: string | null;
        color: string | null;
        icon: string | null;
    };
};

export type DashboardSeriesPoint = {
    label: string;
    net: number;
    income: number;
    expense: number;
};

export type DashboardPeriodOption = {
    key: string;
    label: string;
    days: number;
};

export type DashboardPageProps = {
    summary: DashboardSummary;
    trends: {
        balance: DashboardMetricTrend;
        income: DashboardMetricTrend;
        expense: DashboardMetricTrend;
        netResult: DashboardMetricTrend;
    };
    activePeriod: string;
    periodOptions: DashboardPeriodOption[];
    expenseByCategory: DashboardCategoryBreakdown[];
    topAccounts: DashboardAccountSnapshot[];
    recentTransactions: DashboardRecentTransaction[];
    monthlySeries: DashboardSeriesPoint[];
};
