import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';

const notifications = [
    ['56 New users registered.', 'Just now'],
    ['132 Orders placed.', '59 Minutes ago'],
    ['Funds have been withdrawn.', '12 Hours ago'],
    ['5 Unread messages.', 'Today, 11:59 PM'],
] as const;

const activities = [
    ['Changed the style.', 'Just now', 'from-pink-400 to-fuchsia-200'],
    ['177 New products added.', '47 Minutes ago', 'from-red-300 to-rose-100'],
    [
        '11 Products have been archived.',
        '1 Days ago',
        'from-amber-300 to-orange-100',
    ],
    [
        'Page "Toys" has been removed.',
        'Feb 2, 2024',
        'from-stone-300 to-orange-50',
    ],
] as const;

const managers = [
    ['Daniel Craig', false, 'from-amber-400 to-yellow-200'],
    ['Kate Morrison', false, 'from-orange-500 to-rose-300'],
    ['Nataniel Donowan', true, 'from-fuchsia-500 to-orange-300'],
    ['Elisabeth Wayne', false, 'from-sky-400 to-blue-200'],
    ['Felicia Raspet', false, 'from-emerald-500 to-teal-300'],
] as const;

export default function NotificationsPanel({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}): ReactElement {
    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close notifications"
                        className="fixed inset-0 z-40 bg-[rgba(3,6,10,0.52)] backdrop-blur-[2px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />
                    <motion.aside
                        className="fixed inset-y-0 right-0 z-50 w-full max-w-[360px] overflow-y-auto border-l border-[#171C24] bg-[rgba(5,8,12,0.98)] px-7 py-8 shadow-[-24px_0_80px_rgba(0,0,0,0.35)]"
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
                                    <h2 className="font-['Space_Grotesk'] text-[28px] font-medium tracking-[-0.04em] text-white">
                                        Notifications
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
                                    {notifications.map(
                                        ([title, time], index) => (
                                            <motion.div
                                                key={title}
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
                                <h2 className="font-['Space_Grotesk'] text-[28px] font-medium tracking-[-0.04em] text-white">
                                    Activities
                                </h2>
                                <div className="relative mt-6 space-y-6 before:absolute before:top-3 before:bottom-3 before:left-[18px] before:w-px before:bg-[#27303A]">
                                    {activities.map(
                                        ([title, time, tone], index) => (
                                            <motion.div
                                                key={title}
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
                                                        'relative z-10 mt-1 h-9 w-9 shrink-0 rounded-full bg-gradient-to-br',
                                                        tone,
                                                    ].join(' ')}
                                                />
                                                <div>
                                                    <p className="text-[17px] leading-[1.25] text-white">
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
                                transition={{ delay: 0.28, duration: 0.2 }}
                            />

                            <motion.section
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ delay: 0.3, duration: 0.22 }}
                            >
                                <h2 className="font-['Space_Grotesk'] text-[28px] font-medium tracking-[-0.04em] text-white">
                                    Contacts of your managers
                                </h2>
                                <div className="mt-6 space-y-3">
                                    {managers.map(
                                        ([name, active, tone], index) => (
                                            <motion.div
                                                key={name}
                                                className={[
                                                    'flex items-center gap-4 rounded-[18px] px-4 py-3 transition',
                                                    active
                                                        ? 'bg-[#B5F955] text-[#0D100B]'
                                                        : 'text-white hover:bg-[#13171E]',
                                                ].join(' ')}
                                                initial={{ opacity: 0, x: 14 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{
                                                    delay: 0.34 + index * 0.04,
                                                    duration: 0.22,
                                                }}
                                            >
                                                <div
                                                    className={[
                                                        'h-11 w-11 rounded-full bg-gradient-to-br',
                                                        tone,
                                                    ].join(' ')}
                                                />
                                                <span className="flex-1 text-[18px] font-medium">
                                                    {name}
                                                </span>
                                                {active ? (
                                                    <div className="flex items-center gap-4 text-[#0D100B]">
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="h-4 w-4"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M4 6h16v11H7l-3 3V6Z" />
                                                        </svg>
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="h-4 w-4"
                                                            fill="currentColor"
                                                        >
                                                            <path d="M6.6 10.8c1.5 3 3.9 5.4 6.9 6.9l2.3-2.3c.3-.3.8-.4 1.2-.3 1 .3 2.1.4 3.2.4.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C10.7 21.3 2.7 13.3 2.7 3.3 2.7 2.6 3.3 2 4 2h3.3c.7 0 1.3.6 1.3 1.3 0 1.1.1 2.2.4 3.2.1.4 0 .8-.3 1.2l-2.1 2.1Z" />
                                                        </svg>
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="text-[#7E8590]"
                                                    >
                                                        <svg
                                                            viewBox="0 0 24 24"
                                                            className="h-5 w-5"
                                                            fill="currentColor"
                                                        >
                                                            <circle
                                                                cx="12"
                                                                cy="5"
                                                                r="1.7"
                                                            />
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="1.7"
                                                            />
                                                            <circle
                                                                cx="12"
                                                                cy="19"
                                                                r="1.7"
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                            </motion.div>
                                        ),
                                    )}
                                </div>
                            </motion.section>
                        </div>
                    </motion.aside>
                </>
            ) : null}
        </AnimatePresence>
    );
}
