import type { ReactElement } from 'react';

export type SidebarPage =
    | 'dashboard'
    | 'accounts'
    | 'categories'
    | 'transactions'
    | 'reports';

export type NavigationItem = {
    label: string;
    href?: string;
    icon: ReactElement;
    active?: boolean;
    dimmed?: boolean;
};

export type NavigationSection = {
    title: string;
    items: NavigationItem[];
};
