import { useRemember } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { getSidebarBreadcrumb } from '@/lib/sidebar';
import type { SidebarPage } from '@/types/navigation';

function AppIcon({
    children,
    onClick,
    active = false,
}: {
    children: ReactElement;
    onClick?: () => void;
    active?: boolean;
}): ReactElement {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            className={[
                'flex h-9 w-9 items-center justify-center rounded-full border text-[#DFE5EC] transition',
                active
                    ? 'border-[#244118] bg-[#B5F955] text-[#0A0D09]'
                    : 'border-[#1C212B] bg-[#0E1218] hover:border-[#2A303A]',
            ].join(' ')}
        >
            {children}
        </motion.button>
    );
}

type Breadcrumb = {
    section: string;
    page: string;
};

export default function Topbar({
    isNotificationsOpen,
    onOpenQuickActions,
    onToggleNotifications,
    currentPage,
}: {
    isNotificationsOpen: boolean;
    onOpenQuickActions: () => void;
    onToggleNotifications: () => void;
    currentPage: SidebarPage;
}): ReactElement {
    const currentBreadcrumb = getSidebarBreadcrumb(currentPage);
    const [rememberedBreadcrumb, setRememberedBreadcrumb] =
        useRemember<Breadcrumb>(
            currentBreadcrumb,
            'topbar.previous-breadcrumb',
        );
    const shouldDelaySwitch = useMemo(
        () =>
            rememberedBreadcrumb.section !== currentBreadcrumb.section ||
            rememberedBreadcrumb.page !== currentBreadcrumb.page,
        [currentBreadcrumb, rememberedBreadcrumb],
    );
    const [displayedBreadcrumb, setDisplayedBreadcrumb] =
        useState<Breadcrumb>(rememberedBreadcrumb);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        if (!shouldDelaySwitch) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setShouldAnimate(true);
            setDisplayedBreadcrumb(currentBreadcrumb);
            setRememberedBreadcrumb(currentBreadcrumb);
        }, 500);

        return () => window.clearTimeout(timeout);
    }, [
        currentBreadcrumb,
        rememberedBreadcrumb,
        setRememberedBreadcrumb,
        shouldDelaySwitch,
    ]);

    return (
        <header className="fixed top-0 right-0 left-0 z-20 border-b border-[#171C24] bg-[rgba(5,8,12,0.9)] backdrop-blur-xl xl:left-70">
            <div className="relative flex flex-col gap-5 px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4 text-[#818793] lg:min-w-0">
                    <div className="relative h-7 min-w-60 overflow-hidden">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={`${displayedBreadcrumb.section}-${displayedBreadcrumb.page}`}
                                initial={
                                    shouldAnimate
                                        ? { opacity: 0, y: 14 }
                                        : false
                                }
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -14 }}
                                transition={{ duration: 0.24, ease: 'easeOut' }}
                                onAnimationComplete={() => {
                                    if (shouldAnimate) {
                                        setShouldAnimate(false);
                                    }
                                }}
                                className="absolute inset-0 flex items-center gap-3 text-[18px]"
                            >
                                <span className="text-[#4E5662]">
                                    {displayedBreadcrumb.section}
                                </span>
                                <span className="text-[#5C636E]">/</span>
                                <span className="font-medium text-white">
                                    {displayedBreadcrumb.page}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex justify-center lg:absolute lg:top-1/2 lg:left-1/2 lg:w-full lg:max-w-[520px] lg:-translate-x-1/2 lg:-translate-y-1/2">
                    <div className="relative w-full max-w-[520px]">
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
                        <button
                            type="button"
                            onClick={onOpenQuickActions}
                            className="h-12 w-full rounded-2xl border border-[#181D25] bg-[#13171E] pr-16 pl-11 text-left text-[15px] text-[#727986] transition-colors duration-200 outline-none hover:border-[#26303B] hover:bg-[#151B23]"
                        >
                            Quick actions, pesquisa rapida...
                        </button>
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full border border-[#232832] px-2.5 py-1 text-[12px] font-medium text-[#A4ABB7]">
                            ⌘ K
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3 lg:ml-auto">
                    <AppIcon
                        onClick={onToggleNotifications}
                        active={isNotificationsOpen}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M12 4a4 4 0 0 1 4 4c0 4 2 5 2 5H6s2-1 2-5a4 4 0 0 1 4-4Z" />
                            <path d="M10 18a2 2 0 0 0 4 0" />
                        </svg>
                    </AppIcon>
                </div>
            </div>
        </header>
    );
}
