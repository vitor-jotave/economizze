import { motion } from 'motion/react';
import type { ReactElement } from 'react';

export default function AppToast({ title }: { title: string }): ReactElement {
    return (
        <motion.div
            initial={{ opacity: 0, x: 84, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 84, scale: 0.96 }}
            transition={{
                type: 'spring',
                stiffness: 280,
                damping: 26,
            }}
            className="pointer-events-auto overflow-hidden rounded-[22px] border border-[#284319] bg-[linear-gradient(180deg,rgba(181,249,85,0.16),rgba(10,14,10,0.96))] p-4 shadow-[-12px_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl"
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D8FFD0] text-[#3B9140]">
                    <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <path d="m6 12 4 4 8-8" />
                    </svg>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[12px] tracking-[0.14em] text-[#B8D88F] uppercase">
                        Notificação
                    </p>
                    <p className="mt-1 text-[15px] leading-6 text-white">
                        {title}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
