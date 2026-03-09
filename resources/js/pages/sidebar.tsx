import type { ReactElement } from 'react';
import SidebarGroup from '@/components/sidebar-group';
import { getSidebarSections } from '@/lib/sidebar';
import type { SidebarPage } from '@/types/navigation';

export default function Sidebar({
    currentPage,
}: {
    currentPage: SidebarPage;
}): ReactElement {
    const sections = getSidebarSections(currentPage);

    return (
        <aside className="flex flex-col border-b border-[#171C24] px-6 py-7 xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:h-screen xl:w-70 xl:overflow-y-auto xl:border-r xl:border-b-0 xl:bg-[rgba(5,8,12,0.96)]">
            <div className="flex items-center">
                <img
                    src="/images/logo.png"
                    alt="App logo"
                    className="w-45 object-contain"
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
                    className="h-12 w-full rounded-2xl border border-[#181D25] bg-[#13171E] pr-16 pl-11 text-[15px] text-[#727986] outline-none"
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-[#232832] px-2.5 py-1 text-[12px] font-medium text-[#A4ABB7]">
                    ⌘ K
                </span>
            </div>

            <div className="mt-8 flex-1 space-y-9">
                {sections.map((section) => (
                    <SidebarGroup
                        key={section.title}
                        title={section.title}
                        items={section.items}
                    />
                ))}
            </div>

            <div className="mt-10 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[radial-gradient(circle_at_50%_25%,#F2F0A0,#97EE3E_45%,#283D14_100%)] p-0.5">
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
