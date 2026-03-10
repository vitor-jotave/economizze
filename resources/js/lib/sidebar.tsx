import { DollarSign, Tags } from 'lucide-react';
import { home, reports } from '@/routes';
import { index as accountsIndex } from '@/routes/accounts';
import {
    accounts as reportAccounts,
    cashflow as reportCashflow,
    categories as reportCategories,
} from '@/routes/reports';
import { index as transactionsIndex } from '@/routes/transactions';
import type { NavigationSection, SidebarPage } from '@/types/navigation';
import { index as categoriesIndex } from '@/routes/categories';

export function getSidebarSections(
    currentPage: SidebarPage,
): NavigationSection[] {
    return [
        {
            title: 'Finanças',
            items: [
                {
                    label: 'Dashboard',
                    href: home.url(),
                    active: currentPage === 'dashboard',
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                        >
                            <rect
                                x="3"
                                y="3"
                                width="7"
                                height="7"
                                rx="2"
                                fill="currentColor"
                            />
                            <rect
                                x="14"
                                y="3"
                                width="7"
                                height="7"
                                rx="2"
                                fill="currentColor"
                            />
                            <rect
                                x="3"
                                y="14"
                                width="7"
                                height="7"
                                rx="2"
                                fill="currentColor"
                            />
                            <rect
                                x="14"
                                y="14"
                                width="7"
                                height="7"
                                rx="2"
                                fill="currentColor"
                            />
                        </svg>
                    ),
                },
                {
                    label: 'Contas',
                    href: accountsIndex.url(),
                    active: currentPage === 'accounts',
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="3" />
                            <path d="M3 10h18" />
                        </svg>
                    ),
                },
                {
                    label: 'Transações',
                    href: transactionsIndex.url(),
                    active: currentPage === 'transactions',
                    icon: <DollarSign className="h-4 w-4" strokeWidth={1.8} />,
                },
                {
                    label: 'Categorias',
                    href: categoriesIndex.url(),
                    active: currentPage === 'categories',
                    icon: <Tags className="h-4 w-4" strokeWidth={1.8} />,
                },
            ],
        },
        {
            title: 'Análises',
            items: [
                {
                    label: 'Hub',
                    breadcrumbLabel: 'Hub',
                    href: reports.url(),
                    active: currentPage === 'reports',
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="currentColor"
                        >
                            <rect x="4" y="11" width="3" height="9" rx="1.5" />
                            <rect
                                x="10.5"
                                y="7"
                                width="3"
                                height="13"
                                rx="1.5"
                            />
                            <rect x="17" y="4" width="3" height="16" rx="1.5" />
                        </svg>
                    ),
                },
                {
                    label: 'Gastos p/ Categoria',
                    breadcrumbLabel: 'Categorias',
                    href: reportCategories.url(),
                    active: currentPage === 'reports-categories',
                    icon: <Tags className="h-4 w-4" strokeWidth={1.8} />,
                },
                {
                    label: 'Fluxo p/ Período',
                    breadcrumbLabel: 'Fluxo',
                    href: reportCashflow.url(),
                    active: currentPage === 'reports-cashflow',
                    icon: <DollarSign className="h-4 w-4" strokeWidth={1.8} />,
                },
                {
                    label: 'Saúde das Contas',
                    breadcrumbLabel: 'Contas',
                    href: reportAccounts.url(),
                    active: currentPage === 'reports-accounts',
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <rect x="3" y="5" width="18" height="14" rx="3" />
                            <path d="M3 10h18" />
                        </svg>
                    ),
                },
            ],
        },
    ];
}

export function getSidebarBreadcrumb(currentPage: SidebarPage): {
    section: string;
    page: string;
} {
    const sections = getSidebarSections(currentPage);

    for (const section of sections) {
        const activeItem = section.items.find((item) => item.active);

        if (activeItem) {
            return {
                section: section.title,
                page: activeItem.breadcrumbLabel ?? activeItem.label,
            };
        }
    }

    return {
        section: 'Finanças',
        page: 'Dashboard',
    };
}
