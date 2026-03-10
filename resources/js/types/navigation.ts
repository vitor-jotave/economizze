import type { ReactElement } from 'react';

export type SidebarPage =
    | 'dashboard'
    | 'accounts'
    | 'categories'
    | 'transactions'
    | 'reports'
    | 'reports-accounts'
    | 'reports-cashflow'
    | 'reports-categories';

export type NavigationItem = {
    label: string;
    breadcrumbLabel?: string;
    href?: string;
    icon: ReactElement;
    active?: boolean;
    dimmed?: boolean;
};

export type NavigationSection = {
    title: string;
    items: NavigationItem[];
};
