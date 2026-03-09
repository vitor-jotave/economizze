import { motion } from 'motion/react';
import type { ReactElement } from 'react';

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

export default function Topbar({
    isNotificationsOpen,
    onToggleNotifications,
    title,
}: {
    isNotificationsOpen: boolean;
    onToggleNotifications: () => void;
    title: string;
}): ReactElement {
    return (
        <header className="fixed top-0 right-0 left-0 z-20 border-b border-[#171C24] bg-[rgba(5,8,12,0.9)] backdrop-blur-xl xl:left-[280px]">
            <div className="flex flex-col gap-5 px-7 py-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4 text-[#818793]">
                    <AppIcon>
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="m12 3 8 4.5-8 4.5L4 7.5 12 3Z" />
                            <path d="m4 12 8 4.5 8-4.5" />
                            <path d="m4 16.5 8 4.5 8-4.5" />
                        </svg>
                    </AppIcon>
                    <AppIcon>
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="m12 3 2.8 5.7L21 9.6l-4.5 4.4 1 6.2L12 17.2l-5.5 3 1-6.2L3 9.6l6.2-.9L12 3Z" />
                        </svg>
                    </AppIcon>
                    <div className="flex items-center gap-3 text-[18px]">
                        <span className="text-[#4E5662]">Finance</span>
                        <span className="text-[#5C636E]">/</span>
                        <span className="font-medium text-white">{title}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <AppIcon>
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M19 15.5A8 8 0 1 1 8.5 5a6 6 0 0 0 10.5 10.5Z" />
                        </svg>
                    </AppIcon>
                    <AppIcon>
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path d="M3 12a9 9 0 1 0 3-6.7" />
                            <path d="M3 4v4h4" />
                        </svg>
                    </AppIcon>
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
                    <AppIcon>
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <circle cx="12" cy="12" r="8.5" />
                            <path d="M3.5 12h17" />
                            <path d="M12 3.5a14.6 14.6 0 0 1 3 8.5 14.6 14.6 0 0 1-3 8.5 14.6 14.6 0 0 1-3-8.5 14.6 14.6 0 0 1 3-8.5Z" />
                        </svg>
                    </AppIcon>
                </div>
            </div>
        </header>
    );
}
