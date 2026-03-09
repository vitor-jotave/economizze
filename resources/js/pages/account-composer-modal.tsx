import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import AccountTypeSelectionCard, {
    accountTypeThemes,
} from '@/components/account-type-selection-card';
import AppButton from '@/components/app-button';
import { accountColorPresets } from '@/lib/accounts';
import {
    formatBrazilianCurrency,
    hexToRgb,
    normalizeHexColor,
} from '@/lib/utils';
import type { AccountFormData, AccountTypeOption } from '@/types/accounts';

type AccountFormErrors = Partial<Record<keyof AccountFormData, string>>;
type AccountFormValue = AccountFormData[keyof AccountFormData];

type EditingAccount = {
    id: number;
    name: string;
};

function Field({
    children,
    index,
}: {
    children: ReactElement;
    index: number;
}): ReactElement {
    return (
        <motion.div
            variants={{
                hidden: {
                    opacity: 0,
                    y: 12,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                },
            }}
            transition={{
                duration: 0.2,
                delay: index * 0.03,
            }}
        >
            {children}
        </motion.div>
    );
}

export default function AccountComposerModal({
    isOpen,
    editingAccount,
    accountTypes,
    data,
    errors,
    processing,
    onClose,
    onSubmit,
    setField,
}: {
    isOpen: boolean;
    editingAccount: EditingAccount | null;
    accountTypes: AccountTypeOption[];
    data: AccountFormData;
    errors: AccountFormErrors;
    processing: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setField: (field: keyof AccountFormData, value: AccountFormValue) => void;
}): ReactElement {
    const [activeTypeIndex, setActiveTypeIndex] = useState(0);
    const [isExitPromptOpen, setIsExitPromptOpen] = useState(false);
    const selectedTypeTheme =
        accountTypeThemes[data.type] ?? accountTypeThemes.checking;
    const selectedTypeLabel = accountTypes
        .find((type) => type.value === data.type)
        ?.label.toLowerCase();
    const activeType = accountTypes[activeTypeIndex] ?? accountTypes[0] ?? null;
    const activeTheme = activeType
        ? (accountTypeThemes[activeType.value] ?? accountTypeThemes.checking)
        : accountTypeThemes.checking;
    const previewBalance = Number.parseFloat(data.initial_balance || '0');
    const previewColor = normalizeHexColor(data.color);
    const previewColorRgb = hexToRgb(previewColor);

    useEffect(() => {
        if (!isOpen) {
            setIsExitPromptOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (accountTypes.length === 0) {
            return;
        }

        if (!data.type) {
            setActiveTypeIndex(0);

            return;
        }

        const index = accountTypes.findIndex(
            (type) => type.value === data.type,
        );

        if (index >= 0) {
            setActiveTypeIndex(index);
        }
    }, [accountTypes, data.type, isOpen]);

    function showPreviousType(): void {
        if (accountTypes.length === 0) {
            return;
        }

        setActiveTypeIndex((currentIndex) =>
            currentIndex === 0 ? accountTypes.length - 1 : currentIndex - 1,
        );
    }

    function showNextType(): void {
        if (accountTypes.length === 0) {
            return;
        }

        setActiveTypeIndex((currentIndex) =>
            currentIndex === accountTypes.length - 1 ? 0 : currentIndex + 1,
        );
    }

    function requestClose(): void {
        setIsExitPromptOpen(true);
    }

    function cancelClose(): void {
        setIsExitPromptOpen(false);
    }

    function confirmClose(): void {
        setIsExitPromptOpen(false);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.button
                        type="button"
                        aria-label="Close account modal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-[rgba(3,6,10,0.74)] backdrop-blur-md"
                        onClick={requestClose}
                    />

                    <div
                        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-6 sm:px-6 lg:py-10"
                        onClick={requestClose}
                    >
                        <motion.section
                            onClick={(event) => event.stopPropagation()}
                            initial={{ opacity: 0, y: 36, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 28, scale: 0.98 }}
                            transition={{
                                type: 'spring',
                                stiffness: 220,
                                damping: 24,
                            }}
                            layout
                            className={[
                                'relative w-full overflow-hidden rounded-[34px] border border-[#1B212C] bg-[#11161D] shadow-[0_40px_120px_rgba(0,0,0,0.48)]',
                                data.type ? 'max-w-[940px]' : 'max-w-[680px]',
                            ].join(' ')}
                        >
                            <AnimatePresence>
                                {isExitPromptOpen ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -14 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-b border-[#2A2121] bg-[linear-gradient(180deg,rgba(72,18,18,0.36),rgba(32,12,12,0.22))] px-6 py-4 sm:px-8"
                                    >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-[13px] tracking-[0.14em] text-[#F0B4B4] uppercase">
                                                    Sair do Cadastro
                                                </p>
                                                <p className="mt-2 text-[15px] text-[#F7DEDE]">
                                                    Deseja sair do cadastro
                                                    desta conta? Os dados atuais
                                                    serao descartados.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <AppButton
                                                    type="button"
                                                    onClick={cancelClose}
                                                    variant="dark"
                                                    className="h-11 px-4 text-[14px]"
                                                >
                                                    Continuar
                                                </AppButton>
                                                <AppButton
                                                    type="button"
                                                    onClick={confirmClose}
                                                    variant="lime"
                                                    className="h-11 px-4 text-[14px]"
                                                >
                                                    Fechar
                                                </AppButton>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>

                            <AnimatePresence mode="wait">
                                {!data.type ? (
                                    <motion.div
                                        key="step-01"
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -14 }}
                                        transition={{ duration: 0.24 }}
                                        className="p-6 sm:p-8"
                                    >
                                        <div className="space-y-5">
                                            <div className="flex items-center justify-between">
                                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                    Step 01
                                                </p>
                                                <p className="text-[13px] text-[#95A0AE]">
                                                    Select your account format
                                                </p>
                                            </div>

                                            {activeType ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            {accountTypes.map(
                                                                (
                                                                    type,
                                                                    index,
                                                                ) => (
                                                                    <button
                                                                        key={
                                                                            type.value
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setActiveTypeIndex(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className={[
                                                                            'h-2.5 rounded-full transition',
                                                                            index ===
                                                                            activeTypeIndex
                                                                                ? 'w-9 bg-[#B5F955]'
                                                                                : 'w-2.5 bg-[#2A313B]',
                                                                        ].join(
                                                                            ' ',
                                                                        )}
                                                                        aria-label={`Go to ${type.label}`}
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                        <p className="text-[13px] text-[#6E7683]">
                                                            {String(
                                                                activeTypeIndex +
                                                                    1,
                                                            ).padStart(2, '0')}
                                                            /
                                                            {String(
                                                                accountTypes.length,
                                                            ).padStart(2, '0')}
                                                        </p>
                                                    </div>

                                                    <div className="relative overflow-hidden rounded-[30px] pt-4">
                                                        <div
                                                            className={[
                                                                'absolute inset-0',
                                                            ].join(' ')}
                                                        />
                                                        <div className="relative flex items-center gap-3">
                                                            <motion.button
                                                                type="button"
                                                                whileTap={{
                                                                    scale: 0.95,
                                                                }}
                                                                whileHover={{
                                                                    scale: 1.03,
                                                                }}
                                                                onClick={
                                                                    showPreviousType
                                                                }
                                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#28303A] bg-[rgba(7,10,15,0.72)] text-[#DCE2EA]"
                                                            >
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                >
                                                                    <path d="m15 6-6 6 6 6" />
                                                                </svg>
                                                            </motion.button>

                                                            <AnimatePresence
                                                                initial={false}
                                                                mode="wait"
                                                            >
                                                                <motion.div
                                                                    key={
                                                                        activeType.value
                                                                    }
                                                                    initial={{
                                                                        opacity: 0,
                                                                        x: 50,
                                                                    }}
                                                                    animate={{
                                                                        opacity: 1,
                                                                        x: 0,
                                                                    }}
                                                                    exit={{
                                                                        opacity: 0,
                                                                        x: -50,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.26,
                                                                        ease: 'easeOut',
                                                                    }}
                                                                    className="flex-[1.15]"
                                                                >
                                                                    <AccountTypeSelectionCard
                                                                        activeType={
                                                                            activeType
                                                                        }
                                                                        activeTheme={
                                                                            activeTheme
                                                                        }
                                                                        onSelect={() =>
                                                                            setField(
                                                                                'type',
                                                                                activeType.value,
                                                                            )
                                                                        }
                                                                    />
                                                                </motion.div>
                                                            </AnimatePresence>

                                                            <motion.button
                                                                type="button"
                                                                whileTap={{
                                                                    scale: 0.95,
                                                                }}
                                                                whileHover={{
                                                                    scale: 1.03,
                                                                }}
                                                                onClick={
                                                                    showNextType
                                                                }
                                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#28303A] bg-[rgba(7,10,15,0.72)] text-[#DCE2EA]"
                                                            >
                                                                <svg
                                                                    viewBox="0 0 24 24"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="1.8"
                                                                >
                                                                    <path d="m9 6 6 6-6 6" />
                                                                </svg>
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="step-02"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.26 }}
                                        className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[minmax(0,1.1fr)_360px]"
                                    >
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-5"
                                        >
                                            <div
                                                className={[
                                                    'rounded-[28px] border border-white/8 p-5',
                                                    selectedTypeTheme.panel,
                                                ].join(' ')}
                                            >
                                                <p className="text-[13px] tracking-[0.14em] text-[#DBE5F1] uppercase">
                                                    Passo 02
                                                </p>
                                                <h3 className="mt-3 font-['Space_Grotesk'] text-[26px] font-medium tracking-tighter text-white">
                                                    Preencha as Informações
                                                </h3>
                                                <p className="mt-2 text-[14px] leading-6 text-[#D7E1EC]">
                                                    Preencha os detalhes para
                                                    concluir sua conta
                                                    {selectedTypeLabel
                                                        ? ` ${selectedTypeLabel}`
                                                        : ''}
                                                    .
                                                </p>
                                            </div>

                                            <motion.div
                                                initial="hidden"
                                                animate="visible"
                                                variants={{
                                                    hidden: {},
                                                    visible: {
                                                        transition: {
                                                            staggerChildren: 0.04,
                                                        },
                                                    },
                                                }}
                                                className="space-y-4"
                                            >
                                                <Field index={0}>
                                                    <div className="space-y-2">
                                                        <label className="text-[13px] tracking-[0.12em] text-[#7F8794] uppercase">
                                                            Nome da Conta
                                                        </label>
                                                        <input
                                                            value={data.name}
                                                            onChange={(event) =>
                                                                setField(
                                                                    'name',
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            className="h-12 w-full rounded-2xl border border-[#1F252F] bg-[#10151C] px-4 text-white outline-none"
                                                        />
                                                        {errors.name ? (
                                                            <p className="text-[13px] text-[#FF8C8C]">
                                                                {errors.name}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </Field>

                                                <Field index={1}>
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <label className="text-[13px] tracking-[0.12em] text-[#7F8794] uppercase">
                                                                Instituição
                                                            </label>
                                                            <input
                                                                value={
                                                                    data.institution
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    setField(
                                                                        'institution',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                className="h-12 w-full rounded-2xl border border-[#1F252F] bg-[#10151C] px-4 text-white outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[13px] tracking-[0.12em] text-[#7F8794] uppercase">
                                                                Moeda
                                                            </label>
                                                            <div className="flex h-12 items-center rounded-2xl border border-[#1F252F] bg-[#10151C] px-4 text-[15px] font-medium text-white">
                                                                R$
                                                            </div>
                                                            {errors.currency ? (
                                                                <p className="text-[13px] text-[#FF8C8C]">
                                                                    {
                                                                        errors.currency
                                                                    }
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </Field>

                                                <Field index={2}>
                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div className="space-y-2">
                                                            <label className="text-[13px] tracking-[0.12em] text-[#7F8794] uppercase">
                                                                Saldo / Limite
                                                            </label>
                                                            <input
                                                                value={
                                                                    data.initial_balance
                                                                }
                                                                onChange={(
                                                                    event,
                                                                ) =>
                                                                    setField(
                                                                        'initial_balance',
                                                                        event
                                                                            .target
                                                                            .value,
                                                                    )
                                                                }
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                className="h-12 w-full rounded-2xl border border-[#1F252F] bg-[#10151C] px-4 text-white outline-none"
                                                            />
                                                            {errors.initial_balance ? (
                                                                <p className="text-[13px] text-[#FF8C8C]">
                                                                    {
                                                                        errors.initial_balance
                                                                    }
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[13px] tracking-[0.12em] text-[#7F8794] uppercase">
                                                                Cor
                                                            </label>
                                                            <div className="space-y-3 rounded-[24px] border border-[#1F252F] bg-[#10151C] p-4">
                                                                <div className="flex flex-nowrap items-center gap-1.5 overflow-hidden">
                                                                    {accountColorPresets.map(
                                                                        (
                                                                            colorPreset,
                                                                        ) => (
                                                                            <motion.button
                                                                                key={
                                                                                    colorPreset
                                                                                }
                                                                                type="button"
                                                                                whileHover={{
                                                                                    scale: 1.08,
                                                                                }}
                                                                                whileTap={{
                                                                                    scale: 0.94,
                                                                                }}
                                                                                onClick={() =>
                                                                                    setField(
                                                                                        'color',
                                                                                        colorPreset,
                                                                                    )
                                                                                }
                                                                                className={[
                                                                                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition',
                                                                                    previewColor ===
                                                                                    colorPreset
                                                                                        ? 'border-white/70'
                                                                                        : 'border-white/10',
                                                                                ].join(
                                                                                    ' ',
                                                                                )}
                                                                                style={{
                                                                                    backgroundColor:
                                                                                        colorPreset,
                                                                                    boxShadow:
                                                                                        previewColor ===
                                                                                        colorPreset
                                                                                            ? `0 0 0 4px rgba(${hexToRgb(colorPreset)}, 0.14)`
                                                                                            : 'none',
                                                                                }}
                                                                            >
                                                                                {previewColor ===
                                                                                colorPreset ? (
                                                                                    <span className="h-2 w-2 rounded-full bg-[#08110A]" />
                                                                                ) : null}
                                                                            </motion.button>
                                                                        ),
                                                                    )}
                                                                </div>

                                                                <div className="flex h-12 items-center gap-3 rounded-2xl border border-[#28303A] bg-[#0D1218] px-4">
                                                                    <input
                                                                        value={
                                                                            previewColor
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            setField(
                                                                                'color',
                                                                                event.target.value.toUpperCase(),
                                                                            )
                                                                        }
                                                                        type="color"
                                                                        className="h-8 w-8 rounded-full border-0 bg-transparent p-0"
                                                                    />
                                                                    <input
                                                                        value={
                                                                            data.color
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                        ) =>
                                                                            setField(
                                                                                'color',
                                                                                event.target.value.toUpperCase(),
                                                                            )
                                                                        }
                                                                        className="w-full bg-transparent text-white outline-none placeholder:text-[#67707B]"
                                                                        placeholder="#B5F955"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {errors.color ? (
                                                                <p className="text-[13px] text-[#FF8C8C]">
                                                                    {
                                                                        errors.color
                                                                    }
                                                                </p>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                </Field>
                                            </motion.div>
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: 24 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 18 }}
                                            transition={{ duration: 0.24 }}
                                            className="space-y-4"
                                        >
                                            <div className="overflow-hidden rounded-[30px] border border-[#1D2430] bg-[#0E131A]">
                                                <div
                                                    className="relative min-h-[220px] overflow-hidden px-6 py-6"
                                                    style={{
                                                        backgroundImage: `linear-gradient(180deg, rgba(${previewColorRgb}, 0.3), rgba(${previewColorRgb}, 0.08))`,
                                                    }}
                                                >
                                                    <div
                                                        className="absolute -top-12 -right-8 h-44 w-44 rounded-full blur-3xl"
                                                        style={{
                                                            background:
                                                                previewColor,
                                                            opacity: 0.46,
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute inset-0 opacity-40"
                                                        style={{
                                                            backgroundImage: `radial-gradient(circle at 18% 20%, rgba(255,255,255,0.14), transparent 30%), linear-gradient(135deg, rgba(${previewColorRgb}, 0.05), transparent 55%)`,
                                                        }}
                                                    />
                                                    <div className="relative">
                                                        <div className="flex items-center justify-between">
                                                            <span className="rounded-full border border-white/10 bg-black/15 px-3 py-1 text-[12px] tracking-[0.12em] text-[#DDE7F4] uppercase">
                                                                Tipo Selecionado
                                                            </span>
                                                            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-black/15 text-white">
                                                                {
                                                                    selectedTypeTheme.icon
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="mt-8 text-[14px] text-[#DDE7F4]">
                                                            {
                                                                accountTypes.find(
                                                                    (type) =>
                                                                        type.value ===
                                                                        data.type,
                                                                )?.label
                                                            }
                                                        </p>
                                                        <p className="mt-3 font-['Space_Grotesk'] text-[34px] leading-none font-medium tracking-[-0.05em] text-white">
                                                            {data.name ||
                                                                'Principal'}
                                                        </p>
                                                        <p className="mt-3 text-[14px] text-[#D8E0EA]">
                                                            {data.institution ||
                                                                'Nome da Instituição'}
                                                        </p>
                                                        <p className="mt-10 text-[13px] tracking-[0.14em] text-[#DDE7F4] uppercase">
                                                            Saldo / Limite
                                                        </p>
                                                        <p className="mt-2 text-[26px] font-semibold text-white">
                                                            {formatBrazilianCurrency(
                                                                Number.isNaN(
                                                                    previewBalance,
                                                                )
                                                                    ? 0
                                                                    : previewBalance,
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded-[28px] border border-[#1D2430] bg-[#0E131A] p-5">
                                                <div className="mt- flex gap-3">
                                                    <AppButton
                                                        type="button"
                                                        onClick={onSubmit}
                                                        loading={processing}
                                                        loadingLabel="Salvando"
                                                        variant="dark"
                                                        className="flex-1"
                                                    >
                                                        {editingAccount
                                                            ? 'Salvar'
                                                            : 'Criar Conta'}
                                                    </AppButton>
                                                    <AppButton
                                                        type="button"
                                                        onClick={requestClose}
                                                        variant="lime"
                                                    >
                                                        Fechar
                                                    </AppButton>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.section>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
}
