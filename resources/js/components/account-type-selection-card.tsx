import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
} from 'motion/react';
import AppButton from '@/components/app-button';
import type { AccountTypeOption } from '@/types/accounts';
import type { PointerEvent as ReactPointerEvent, ReactElement } from 'react';

export const accountTypeThemes: Record<
    string,
    {
        glow: string;
        panel: string;
        accent: string;
        icon: ReactElement;
        description: string;
    }
> = {
    wallet: {
        glow: 'from-[#B5F955] to-[#6BE675]',
        panel: 'bg-[linear-gradient(180deg,rgba(181,249,85,0.22),rgba(181,249,85,0.04))]',
        accent: '181,249,85',
        description: 'Para dinheiro em maos e pequenos gastos do dia.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M4 8a3 3 0 0 1 3-3h10v14H7a3 3 0 0 1-3-3V8Z" />
                <path d="M17 9h3v6h-3" />
                <circle
                    cx="16.5"
                    cy="12"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                />
            </svg>
        ),
    },
    checking: {
        glow: 'from-[#3ED7A3] to-[#69E4C0]',
        panel: 'bg-[linear-gradient(180deg,rgba(62,215,163,0.22),rgba(62,215,163,0.04))]',
        accent: '62,215,163',
        description: 'Conta principal para recebimentos e pagamentos.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="M3 10h18" />
            </svg>
        ),
    },
    savings: {
        glow: 'from-[#8AE500] to-[#B5F955]',
        panel: 'bg-[linear-gradient(180deg,rgba(138,229,0,0.22),rgba(138,229,0,0.04))]',
        accent: '138,229,0',
        description: 'Reserva de seguranca e objetivos de medio prazo.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M12 4v16" />
                <path d="M16 8.5c0-1.7-1.8-3-4-3s-4 1.3-4 3 1.2 2.4 4 3 4 1.2 4 3-1.8 3-4 3-4-1.3-4-3" />
            </svg>
        ),
    },
    credit_card: {
        glow: 'from-[#F0C75E] to-[#F69753]',
        panel: 'bg-[linear-gradient(180deg,rgba(240,199,94,0.22),rgba(240,199,94,0.04))]',
        accent: '240,199,94',
        description: 'Cartão para consolidar fatura e limites mensais.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <rect x="2.5" y="5" width="19" height="14" rx="3" />
                <path d="M2.5 10h19" />
                <path d="M7 15h3" />
            </svg>
        ),
    },
    investment: {
        glow: 'from-[#8B8CFF] to-[#59B8FF]',
        panel: 'bg-[linear-gradient(180deg,rgba(104,139,255,0.22),rgba(104,139,255,0.04))]',
        accent: '104,139,255',
        description: 'Patrimonio investido para crescimento de capital.',
        icon: (
            <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            >
                <path d="M4 18h16" />
                <path d="m7 14 3-3 3 2 4-5" />
                <path d="M17 8h3v3" />
            </svg>
        ),
    },
};

export default function AccountTypeSelectionCard({
    activeType,
    activeTheme,
    onSelect,
}: {
    activeType: AccountTypeOption;
    activeTheme: (typeof accountTypeThemes)[keyof typeof accountTypeThemes];
    onSelect: () => void;
}): ReactElement {
    const pointerX = useMotionValue(50);
    const pointerY = useMotionValue(50);
    const rotateX = useSpring(useTransform(pointerY, [0, 100], [7, -7]), {
        stiffness: 180,
        damping: 18,
    });
    const rotateY = useSpring(useTransform(pointerX, [0, 100], [-7, 7]), {
        stiffness: 180,
        damping: 18,
    });
    const glowOpacity = useSpring(0, {
        stiffness: 220,
        damping: 22,
    });
    const borderGlow = useMotionTemplate`radial-gradient(340px circle at ${pointerX}% ${pointerY}%, rgba(${activeTheme.accent},0.2), rgba(${activeTheme.accent},0.06) 38%, transparent 72%)`;
    const surfaceGlow = useMotionTemplate`radial-gradient(460px circle at ${pointerX}% ${pointerY}%, rgba(${activeTheme.accent},0.09), rgba(${activeTheme.accent},0.03) 34%, transparent 74%)`;

    function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>): void {
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 100;
        const y = ((event.clientY - bounds.top) / bounds.height) * 100;

        pointerX.set(x);
        pointerY.set(y);
    }

    function handlePointerEnter(): void {
        glowOpacity.set(1);
    }

    function handlePointerLeave(): void {
        glowOpacity.set(0);
        pointerX.set(50);
        pointerY.set(50);
    }

    return (
        <motion.div
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
            }}
            className="relative flex-1"
        >
            <motion.div
                style={{
                    backgroundImage: borderGlow,
                    opacity: glowOpacity,
                }}
                className="pointer-events-none absolute -inset-px rounded-[28px]"
            />
            <div className="relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-5 py-5 sm:px-6 sm:py-6">
                <motion.div
                    style={{
                        backgroundImage: surfaceGlow,
                        opacity: glowOpacity,
                    }}
                    className="pointer-events-none absolute inset-0 rounded-[28px]"
                />
                <div
                    className={[
                        'absolute -top-16 -right-8 h-40 w-40 rounded-full bg-gradient-to-br blur-3xl',
                        activeTheme.glow,
                    ].join(' ')}
                />
                <div className="relative">
                    <div className="flex items-start justify-between gap-5">
                        <div className="flex h-13 w-13 items-center justify-center rounded-[20px] border border-white/10 bg-black/15 text-white">
                            {activeTheme.icon}
                        </div>
                        <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[11px] tracking-[0.12em] text-[#DDE6F1] uppercase">
                            {activeType.label}
                        </span>
                    </div>

                    <p className="mt-8 text-[12px] tracking-[0.16em] text-[#DDE6F1] uppercase">
                        Tipo de Conta
                    </p>
                    <p className="mt-3 font-['Space_Grotesk'] text-[34px] leading-none font-medium tracking-[-0.05em] text-white">
                        {activeType.label}
                    </p>
                    <p className="mt-4 max-w-[420px] text-[15px] leading-7 text-[#D2DAE5]">
                        {activeTheme.description}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <AppButton
                            type="button"
                            onClick={onSelect}
                            variant="lime"
                            className="h-11 px-5 text-[14px]"
                        >
                            Escolher
                        </AppButton>
                        <p className="text-[13px] text-[#93A0AF]">
                            Deslize pelas opções com as setas
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
