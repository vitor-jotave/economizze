import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import type {
    NotificationCenterActivity,
    NotificationCenterItem,
} from '@/types/notification-center';

const notifications = [
    ['56 New users registered.', 'Just now'],
    ['132 Orders placed.', '59 Minutes ago'],
    ['Funds have been withdrawn.', '12 Hours ago'],
    ['5 Unread messages.', 'Today, 11:59 PM'],
] as const;

export default function NotificationsPanel({
    isOpen,
    onClose,
    recentNotifications,
    activities,
}: {
    isOpen: boolean;
    onClose: () => void;
    recentNotifications: NotificationCenterItem[];
    activities: NotificationCenterActivity[];
}): ReactElement {
    const combinedNotifications = [
        ...recentNotifications.map(({ title, time }) => [title, time] as const),
        ...notifications,
    ];

    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.button
                        type="button"
                        aria-label="Fechar Notificações"
                        className="fixed inset-0 z-40 bg-[rgba(3,6,10,0.52)] backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />
                    <motion.aside
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-90 overflow-y-auto border-l border-[#171C24] bg-[rgba(5,8,12,0.98)] px-7 py-8 shadow-[-24px_0_80px_rgba(0,0,0,0.35)]"
                        initial={{ x: '100%', opacity: 0.7 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0.7 }}
                        transition={{
                            type: 'spring',
                            stiffness: 280,
                            damping: 28,
                        }}
                    >
                        <div className="space-y-9">
                            <motion.section
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.06, duration: 0.22 }}
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="font-mono text-[28px] font-medium tracking-[-0.04em] text-white">
                                        Notificações
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1C212B] bg-[#0E1218] text-[#DDE3EB]"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path d="M6 6 18 18" />
                                            <path d="M18 6 6 18" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="mt-6 space-y-5">
                                    {combinedNotifications.map(
                                        ([title, time], index) => (
                                            <motion.div
                                                key={`${title}-${time}-${index}`}
                                                className="flex gap-4"
                                                initial={{ opacity: 0, x: 14 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{
                                                    delay: 0.08 + index * 0.04,
                                                    duration: 0.22,
                                                }}
                                            >
                                                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D8FFD0] text-[#3B9140]">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="8"
                                                            r="3"
                                                        />
                                                        <path d="M6 19a6 6 0 0 1 12 0" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-[18px] leading-[1.2] text-white">
                                                        {title}
                                                    </p>
                                                    <p className="mt-1 text-[15px] text-[#6F7682]">
                                                        {time}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            </motion.section>

                            <motion.div
                                className="border-t border-[#171C24]"
                                initial={{ opacity: 0, scaleX: 0.96 }}
                                animate={{ opacity: 1, scaleX: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.16, duration: 0.2 }}
                            />

                            <motion.section
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.18, duration: 0.22 }}
                            >
                                <h2 className="font-mono text-[28px] font-medium tracking-[-0.04em] text-white">
                                    Atividades
                                </h2>
                                <div className="relative mt-6 space-y-6 before:absolute before:top-3 before:bottom-3 before:left-4.5 before:w-px before:bg-[#27303A]">
                                    {activities.map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            className="relative flex gap-4"
                                            initial={{ opacity: 0, x: 14 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            transition={{
                                                delay: 0.22 + index * 0.04,
                                                duration: 0.22,
                                            }}
                                        >
                                            <div
                                                className={[
                                                    'relative z-10 mt-1 h-9 w-9 shrink-0 rounded-full bg-linear-to-br',
                                                    activity.tone,
                                                ].join(' ')}
                                            />
                                            <div>
                                                <p className="text-[17px] leading-tight text-white">
                                                    {activity.title}
                                                </p>
                                                <p className="mt-1 text-[15px] text-[#6F7682]">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        </div>
                    </motion.aside>
                </>
            ) : null}
        </AnimatePresence>
    );
}
