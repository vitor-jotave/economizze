import { usePage } from '@inertiajs/react';
import type { ReactElement } from 'react';
import SidebarGroup from '@/components/sidebar-group';
import { getSidebarSections } from '@/lib/sidebar';
import type { Auth } from '@/types';
import type { SidebarPage } from '@/types/navigation';

export default function Sidebar({
    currentPage,
}: {
    currentPage: SidebarPage;
}): ReactElement {
    const { auth } = usePage<{ auth: Auth }>().props;
    const sections = getSidebarSections(currentPage);
    const userName = auth.user?.name ?? 'Conta Kattana';
    const userSubtitle = auth.user?.email ?? 'Identidade global';
    const userInitials = userName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((chunk) => chunk[0]?.toUpperCase())
        .join('');

    return (
        <aside className="flex flex-col border-b border-[#171C24] px-6 py-7 xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:h-screen xl:w-70 xl:overflow-y-auto xl:border-r xl:border-b-0 xl:bg-[rgba(5,8,12,0.96)]">
            <div className="flex items-center">
                <img
                    src="/images/logo.png"
                    alt="App logo"
                    className="w-45 object-contain"
                />
            </div>

            <div className="mt-10 flex-1 space-y-9">
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
                        {userInitials || 'K'}
                    </div>
                </div>
                <div>
                    <p className="text-[17px] font-semibold tracking-[-0.03em] text-[#F5F7FA]">
                        {userName}
                    </p>
                    <p className="text-[13px] text-[#727986]">{userSubtitle}</p>
                </div>
            </div>
        </aside>
    );
}
