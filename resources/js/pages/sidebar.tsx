import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import SidebarGroup from '@/components/sidebar-group';
import { getSidebarSections } from '@/lib/sidebar';
import type { Auth } from '@/types';
import type { SidebarPage } from '@/types/navigation';

export default function Sidebar({
    currentPage,
    isMobileOpen = false,
    onClose,
}: {
    currentPage: SidebarPage;
    isMobileOpen?: boolean;
    onClose?: () => void;
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

    const content = (
        <>
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
                        onNavigate={onClose}
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
        </>
    );

    return (
        <>
            <aside className="hidden flex-col border-b border-[#171C24] px-6 py-7 xl:fixed xl:inset-y-0 xl:left-0 xl:z-30 xl:flex xl:h-screen xl:w-70 xl:overflow-y-auto xl:border-r xl:border-b-0 xl:bg-[rgba(5,8,12,0.96)]">
                {content}
            </aside>

            <AnimatePresence>
                {isMobileOpen ? (
                    <>
                        <motion.button
                            key="mobile-sidebar-backdrop"
                            type="button"
                            aria-label="Fechar menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="fixed inset-0 z-[39] bg-[rgba(3,6,9,0.72)] xl:hidden"
                            onClick={onClose}
                        />
                        <motion.aside
                            key="mobile-sidebar-panel"
                            initial={{ opacity: 0, y: 32, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 28, scale: 0.96 }}
                            transition={{ duration: 0.24, ease: 'easeOut' }}
                            className="fixed right-4 bottom-24 left-4 z-40 flex max-h-[min(78vh,680px)] flex-col overflow-hidden rounded-[30px] border border-[#1B212B] bg-[rgba(8,11,15,0.97)] px-6 py-6 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl xl:hidden"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <p className="text-[12px] font-semibold tracking-[0.24em] text-[#6C7380] uppercase">
                                    Menu
                                </p>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[#20252F] bg-[#10151C] text-[#E4EBF3] transition hover:border-[#2C3340] hover:bg-[#131922]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="m6 6 12 12" />
                                        <path d="m18 6-12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div
                                className="overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                                style={{ msOverflowStyle: 'none' }}
                            >
                                {content}
                            </div>
                        </motion.aside>
                    </>
                ) : null}
            </AnimatePresence>
        </>
    );
}
