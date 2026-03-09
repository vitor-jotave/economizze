import type { ReactElement } from 'react';

type NavigationItem = {
    label: string;
    icon: ReactElement;
    active?: boolean;
    dimmed?: boolean;
};

const dashboardItems: NavigationItem[] = [
    {
        label: 'Overview',
        active: true,
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
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
        label: 'eCommerce',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M8 7V6a4 4 0 0 1 8 0v1" />
                <path d="M5 9h14l-1 10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 9Z" />
            </svg>
        ),
    },
    {
        label: 'Analytics',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <rect x="4" y="11" width="3" height="9" rx="1.5" />
                <rect x="10.5" y="7" width="3" height="13" rx="1.5" />
                <rect x="17" y="4" width="3" height="16" rx="1.5" />
            </svg>
        ),
    },
    {
        label: 'Customers',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M16 19v-1a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v1" />
                <circle cx="10" cy="8" r="3" />
                <path d="M20 19v-1a4 4 0 0 0-3-3.87" />
                <path d="M14 4.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
];

const settingsItems: NavigationItem[] = [
    {
        label: 'Messages',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M4 6h16v10H7l-3 3V6Z" />
            </svg>
        ),
    },
    {
        label: 'Customer Reviews',
        icon: (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="m12 2.5 2.9 5.88 6.5.95-4.7 4.58 1.1 6.47L12 17.33 6.2 20.4l1.1-6.47L2.6 9.33l6.5-.95L12 2.5Z" />
            </svg>
        ),
    },
    {
        label: 'Settings',
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
    {
        label: 'Help Centre',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <circle cx="12" cy="12" r="9" />
                <path d="M9.1 9a3 3 0 1 1 5.8 1c-.5 1-1.8 1.5-2.4 2.2-.4.4-.5.8-.5 1.8" />
                <circle
                    cx="12"
                    cy="17"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        ),
    },
];

function SidebarGroup({
    title,
    items,
}: {
    title: string;
    items: NavigationItem[];
}): ReactElement {
    return (
        <div className="space-y-3">
            <p className="px-2 text-[12px] font-semibold tracking-[0.22em] text-[#5E626B] uppercase">
                {title}
            </p>
            <div className="space-y-1">
                {items.map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className={[
                            'flex w-full items-center gap-3 rounded-[16px] px-4 py-3 text-left text-[15px] transition',
                            item.active
                                ? 'bg-[#B5F955] text-[#0A0D09] shadow-[0_8px_20px_rgba(181,249,85,0.22)]'
                                : 'text-[#777C85] hover:bg-[#13171E] hover:text-[#E8EDF3]',
                        ].join(' ')}
                    >
                        <span
                            className={[
                                'flex h-5 w-5 items-center justify-center',
                                item.active
                                    ? 'text-[#0A0D09]'
                                    : 'text-[#5E626B]',
                            ].join(' ')}
                        >
                            {item.icon}
                        </span>
                        <span className={item.dimmed ? 'opacity-70' : ''}>
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default function Sidebar(): ReactElement {
    return (
        <aside className="flex flex-col border-b border-[#171C24] px-6 py-7 xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:h-screen xl:w-[280px] xl:overflow-y-auto xl:border-r xl:border-b-0 xl:bg-[rgba(5,8,12,0.96)]">
            <div className="flex items-center">
                <img
                    src="/images/logo.png"
                    alt="App logo"
                    className="w-[180px] object-contain"
                />
            </div>

            <div className="relative mt-8">
                <svg
                    viewBox="0 0 24 24"
                    className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#727986]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <circle cx="11" cy="11" r="6" />
                    <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                    readOnly
                    value="Search..."
                    className="h-12 w-full rounded-[16px] border border-[#181D25] bg-[#13171E] pr-16 pl-11 text-[15px] text-[#727986] outline-none"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-[#232832] px-2.5 py-1 text-[12px] font-medium text-[#A4ABB7]">
                    ⌘ K
                </span>
            </div>

            <div className="mt-8 flex-1 space-y-9">
                <SidebarGroup title="Dashboards" items={dashboardItems} />
                <SidebarGroup title="Settings" items={settingsItems} />
            </div>

            <div className="mt-10 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_50%_25%,_#F2F0A0,_#97EE3E_45%,_#283D14_100%)] p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#10150E] text-[15px] font-semibold text-[#E6EDC4]">
                        G
                    </div>
                </div>
                <div>
                    <p className="text-[17px] font-semibold tracking-[-0.03em] text-[#F5F7FA]">
                        Guy Hawkins
                    </p>
                    <p className="text-[13px] text-[#727986]">
                        Personal finance
                    </p>
                </div>
            </div>
        </aside>
    );
}
