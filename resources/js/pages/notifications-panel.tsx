import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import type {
    NotificationCenterActivity,
    NotificationCenterItem,
} from '@/types/notification-center';

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
                                    {recentNotifications.length === 0 ? (
                                        <div className="rounded-[24px] border border-[#171C24] bg-[#0D1218] px-5 py-6 text-[15px] leading-7 text-[#7D848F]">
                                            Seus alertas de sistema vao aparecer
                                            aqui quando alguma categoria se
                                            aproximar ou ultrapassar o limite
                                            mensal.
                                        </div>
                                    ) : (
                                        recentNotifications.map(
                                            (
                                                { id, title, body, time, tone },
                                                index,
                                            ) => (
                                                <motion.div
                                                    key={id}
                                                    className="flex gap-4"
                                                    initial={{
                                                        opacity: 0,
                                                        x: 14,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    exit={{ opacity: 0, x: 10 }}
                                                    transition={{
                                                        delay:
                                                            0.08 + index * 0.04,
                                                        duration: 0.22,
                                                    }}
                                                >
                                                    <div
                                                        className={[
                                                            'mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-white',
                                                            tone,
                                                        ].join(' ')}
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="h-5 w-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="1.8"
                                                        >
                                                            <path d="M12 9v4" />
                                                            <path d="M12 17h.01" />
                                                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[18px] leading-[1.2] text-white">
                                                            {title}
                                                        </p>
                                                        <p className="mt-2 text-[15px] leading-6 text-[#A4ACB8]">
                                                            {body}
                                                        </p>
                                                        <p className="mt-1 text-[15px] text-[#6F7682]">
                                                            {time}
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ),
                                        )
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
