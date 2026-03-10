import { home } from '@/routes';
import { index as accountsIndex } from '@/routes/accounts';
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
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M7 7h10" />
                            <path d="M7 12h6" />
                            <path d="M7 17h10" />
                        </svg>
                    ),
                },
                {
                    label: 'Categorias',
                    href: categoriesIndex.url(),
                    active: currentPage === 'categories',
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M4 7h7" />
                            <path d="M13 7h7" />
                            <path d="M4 17h7" />
                            <path d="M13 17h7" />
                        </svg>
                    ),
                },
            ],
        },
        {
            title: 'Workspace',
            items: [
                {
                    label: 'Reports',
                    dimmed: true,
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
                    label: 'Settings',
                    dimmed: true,
                    icon: (
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5Z" />
                            <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.2a1 1 0 0 0-.7-1 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.2a1 1 0 0 0 1-.7 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.2a1 1 0 0 0 .7 1 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.2a1 1 0 0 0-1 .7Z" />
                        </svg>
                    ),
                },
            ],
        },
    ];
}
