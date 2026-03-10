export type ReportPeriodOption = {
    key: string;
    label: string;
    days: number;
};

export type ReportCategoryTrend = {
    direction: 'up' | 'down' | 'neutral';
    value: number;
};

export type ReportCategoryBreakdown = {
    id: number;
    name: string;
    color: string;
    icon: string;
    total: number;
    previous_total: number;
    share: number;
    transactions_count: number;
    average_transaction: number;
    trend: ReportCategoryTrend;
    last_transaction_at_label: string | null;
};

export type ReportInsight = {
    id: string;
    title: string;
    description: string;
    tone: 'positive' | 'warning' | 'critical' | 'neutral';
};

export type ReportCashflowPoint = {
    label: string;
    income: number;
    expense: number;
    net: number;
};

export type ReportsOverviewCard = {
    slug: string;
    title: string;
    description: string;
    status: 'ready' | 'coming-soon';
    href: string | null;
    accentColor: string;
    metrics: Array<{
        label: string;
        value: string | number;
    }>;
};

export type ReportsPageProps = {
    activePeriod: string;
    periodOptions: ReportPeriodOption[];
    summary: {
        income: number;
        expense: number;
        net: number;
        cashBalance: number;
        availableCredit: number;
        topCategory: ReportCategoryBreakdown | null;
        activeReports: number;
        comingSoonReports: number;
    };
    reports: ReportsOverviewCard[];
};

export type ReportCategoriesPageProps = {
    activePeriod: string;
    periodOptions: ReportPeriodOption[];
    summary: {
        totalExpense: number;
        averageTransaction: number;
        categoriesCount: number;
        transactionsCount: number;
        topCategory: ReportCategoryBreakdown | null;
    };
    categories: ReportCategoryBreakdown[];
    insights: ReportInsight[];
};

export type ReportCashflowPageProps = {
    activePeriod: string;
    periodOptions: ReportPeriodOption[];
    summary: {
        income: number;
        expense: number;
        net: number;
        averageNet: number;
        positiveIntervals: number;
        negativeIntervals: number;
        bestInterval: ReportCashflowPoint | null;
        worstInterval: ReportCashflowPoint | null;
    };
    series: ReportCashflowPoint[];
    insights: ReportInsight[];
};

export type ReportAccountHealthItem = {
    id: number;
    name: string;
    type: string;
    type_label: string;
    color: string;
    current_balance: number;
    initial_balance: number;
    credit_limit: number;
    available_credit: number;
    income: number;
    expense: number;
    net: number;
    share_of_balance: number;
    credit_usage_percentage: number;
    transactions_count: number;
};

export type ReportAccountsPageProps = {
    activePeriod: string;
    periodOptions: ReportPeriodOption[];
    summary: {
        totalCashBalance: number;
        totalAvailableCredit: number;
        accountsCount: number;
        cashAccountsCount: number;
        creditAccountsCount: number;
        topCashAccount: ReportAccountHealthItem | null;
        mostPressuredCard: ReportAccountHealthItem | null;
    };
    accounts: ReportAccountHealthItem[];
    insights: ReportInsight[];
};
