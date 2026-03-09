import { motion } from 'motion/react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AppButtonVariant = 'dark' | 'lime';

type AppButtonProps = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onDrag' | 'onDragStart' | 'onDragEnd'
> & {
    children: ReactNode;
    loading?: boolean;
    loadingLabel?: string;
    variant?: AppButtonVariant;
    className?: string;
};

const variantClasses: Record<AppButtonVariant, string> = {
    dark: 'border border-[#24303B] bg-[#11161D] text-[#E8EDF4] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] enabled:hover:border-[#3A4958] enabled:hover:bg-[#171E27]',
    lime: 'border border-[#B5F955] bg-[#B5F955] text-[#11150C] shadow-[0_16px_32px_rgba(181,249,85,0.16)] enabled:hover:border-[#C6FF6D] enabled:hover:bg-[#C6FF6D]',
};

export default function AppButton({
    children,
    loading = false,
    loadingLabel,
    variant = 'dark',
    className,
    disabled,
    type = 'button',
    ...props
}: AppButtonProps): ReactElement {
    const isDisabled = disabled || loading;

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={cn(
                'group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full px-5 text-[15px] font-semibold transition-all duration-300 ease-out focus-visible:ring-2 focus-visible:ring-[#B5F955]/60 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70',
                'enabled:hover:-translate-y-0.5 enabled:hover:scale-[1.01] enabled:active:scale-[0.985]',
                variantClasses[variant],
                className,
            )}
            {...props}
        >
            <motion.span
                aria-hidden="true"
                className={cn(
                    'pointer-events-none absolute inset-0 rounded-full',
                    variant === 'lime'
                        ? 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_55%)]'
                        : 'bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]',
                )}
                animate={{
                    opacity: loading ? [0.35, 0.6, 0.35] : 1,
                    scale: loading ? [1, 1.015, 1] : 1,
                }}
                transition={{
                    duration: 1.1,
                    ease: 'easeInOut',
                    repeat: loading ? Infinity : 0,
                }}
            />
            <span className="relative flex items-center gap-2.5">
                {loading ? (
                    <motion.span
                        aria-hidden="true"
                        className="inline-flex items-center gap-1.5"
                    >
                        {[0, 1, 2].map((index) => (
                            <motion.span
                                key={index}
                                className={cn(
                                    'h-1.5 w-1.5 rounded-full',
                                    variant === 'lime'
                                        ? 'bg-[#11150C]'
                                        : 'bg-[#E8EDF4]',
                                )}
                                animate={{
                                    opacity: [0.35, 1, 0.35],
                                    y: [0, -2, 0],
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: index * 0.12,
                                }}
                            />
                        ))}
                    </motion.span>
                ) : null}
                {!loading ? <span>{children}</span> : null}
            </span>
        </button>
    );
}
