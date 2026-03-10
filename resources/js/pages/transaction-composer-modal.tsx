import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import AppButton from '@/components/app-button';
import CategoryIconGlyph from '@/components/category-icon-glyph';
import { formatBrazilianCurrency } from '@/lib/utils';
import type {
    TransactionAccountOption,
    TransactionCategoryOption,
    TransactionFormData,
    TransactionTypeOption,
} from '@/types/transactions';

type TransactionFormErrors = Partial<Record<keyof TransactionFormData, string>>;
type TransactionFormValue = TransactionFormData[keyof TransactionFormData];

type EditingTransaction = {
    id: number;
};

export default function TransactionComposerModal({
    isOpen,
    editingTransaction,
    transactionTypes,
    accounts,
    categories,
    data,
    errors,
    processing,
    onClose,
    onSubmit,
    setField,
}: {
    isOpen: boolean;
    editingTransaction: EditingTransaction | null;
    transactionTypes: TransactionTypeOption[];
    accounts: TransactionAccountOption[];
    categories: TransactionCategoryOption[];
    data: TransactionFormData;
    errors: TransactionFormErrors;
    processing: boolean;
    onClose: () => void;
    onSubmit: () => void;
    setField: (
        field: keyof TransactionFormData,
        value: TransactionFormValue,
    ) => void;
}): ReactElement {
    const [isExitPromptOpen, setIsExitPromptOpen] = useState(false);
    const selectedType = transactionTypes.find(
        (type) => type.value === data.type,
    );
    const selectedAccount = accounts.find(
        (account) => String(account.id) === data.account_id,
    );
    const filteredCategories = useMemo(
        () =>
            categories.filter(
                (category) =>
                    category.type === 'both' || category.type === data.type,
            ),
        [categories, data.type],
    );
    const selectedCategory = filteredCategories.find(
        (category) => String(category.id) === data.category_id,
    );
    const previewAmount = Number.parseFloat(data.amount || '0');

    useEffect(() => {
        if (!isOpen) {
            setIsExitPromptOpen(false);
        }
    }, [isOpen]);

    useEffect(() => {
        if (
            !data.category_id ||
            filteredCategories.some(
                (category) => String(category.id) === data.category_id,
            )
        ) {
            return;
        }

        setField('category_id', '');
    }, [data.category_id, filteredCategories, setField]);

    function requestClose(): void {
        setIsExitPromptOpen(true);
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
                        aria-label="Close transaction modal"
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
                            className="relative w-full max-w-275 overflow-hidden rounded-[34px] border border-[#1B212C] bg-[#11161D] shadow-[0_40px_120px_rgba(0,0,0,0.48)]"
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
                                                    desta transação? Os dados
                                                    atuais serao descartados.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <AppButton
                                                    type="button"
                                                    onClick={() =>
                                                        setIsExitPromptOpen(
                                                            false,
                                                        )
                                                    }
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

                            <div className="grid gap-0 lg:grid-cols-[390px_minmax(0,1fr)]">
                                <div className="relative overflow-hidden border-b border-[#1B212C] p-6 sm:p-8 lg:border-r lg:border-b-0">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(181,249,85,0.18),transparent_52%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
                                    <div className="relative space-y-6">
                                        <div>
                                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                {editingTransaction
                                                    ? 'Editando transação'
                                                    : 'Nova transação'}
                                            </p>
                                            <h2 className="mt-3 font-mono text-[32px] leading-none font-medium tracking-[-0.05em] text-white">
                                                {editingTransaction
                                                    ? 'Editar transação'
                                                    : 'Gasto ou receita? 🤔'}
                                            </h2>
                                            <p className="mt-3 max-w-70 text-[15px] leading-6 text-[#A4ACB8]">
                                                Relacione valor, conta e
                                                categoria para atualizar
                                                automaticamente o saldo das suas
                                                contas.
                                            </p>
                                        </div>

                                        <div className="rounded-[30px] border border-white/8 bg-[linear-gradient(145deg,rgba(181,249,85,0.22),rgba(17,22,29,0.28))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
                                            <div className="space-y-8">
                                                <div className="flex items-center justify-between">
                                                    <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] tracking-[0.14em] text-white/85 uppercase">
                                                        {selectedType?.label ??
                                                            'Transação'}
                                                    </span>
                                                    <span className="text-[12px] tracking-[0.18em] text-white/70 uppercase">
                                                        Preview
                                                    </span>
                                                </div>

                                                <div>
                                                    <p className="text-[38px] leading-none font-semibold tracking-[-0.05em] text-white">
                                                        {formatBrazilianCurrency(
                                                            previewAmount,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="space-y-3 text-[14px] text-white/75">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span>Conta</span>
                                                        <span className="text-right text-white">
                                                            {selectedAccount?.name ??
                                                                'Selecione'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span>Categoria</span>
                                                        <span className="text-right text-white">
                                                            {selectedCategory?.name ??
                                                                'Selecione'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between gap-3">
                                                        <span>Data</span>
                                                        <span className="text-right text-white">
                                                            {data.transacted_at ||
                                                                'Selecione'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 sm:p-8">
                                    <div className="grid gap-5">
                                        <div>
                                            <label className="mb-3 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                Tipo
                                            </label>
                                            <div className="grid gap-3 sm:grid-cols-2">
                                                {transactionTypes.map(
                                                    (type) => {
                                                        const isActive =
                                                            data.type ===
                                                            type.value;

                                                        return (
                                                            <button
                                                                key={type.value}
                                                                type="button"
                                                                onClick={() =>
                                                                    setField(
                                                                        'type',
                                                                        type.value,
                                                                    )
                                                                }
                                                                className={[
                                                                    'rounded-[22px] border px-4 py-4 text-left transition',
                                                                    isActive
                                                                        ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                                        : 'border-[#232A35] bg-[#141922] text-[#D5DCE6] hover:border-[#303948] hover:bg-[#171D27]',
                                                                ].join(' ')}
                                                            >
                                                                <p className="text-[16px] font-medium">
                                                                    {type.label}
                                                                </p>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            {errors.type ? (
                                                <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                    {errors.type}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div>
                                            <div>
                                                <label className="mb-2 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                    Valor
                                                </label>
                                                <input
                                                    value={data.amount}
                                                    onChange={(event) =>
                                                        setField(
                                                            'amount',
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="0.00"
                                                    inputMode="decimal"
                                                    className="h-13 w-full rounded-[20px] border border-[#232A35] bg-[#141922] px-4 text-[15px] text-white outline-none placeholder:text-[#69717E]"
                                                />
                                                {errors.amount ? (
                                                    <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                        {errors.amount}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="grid gap-5 lg:grid-cols-2">
                                            <div>
                                                <label className="mb-2 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                    Data
                                                </label>
                                                <input
                                                    type="date"
                                                    value={data.transacted_at}
                                                    onChange={(event) =>
                                                        setField(
                                                            'transacted_at',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="h-13 w-full rounded-[20px] border border-[#232A35] bg-[#141922] px-4 text-[15px] text-white outline-none"
                                                />
                                                {errors.transacted_at ? (
                                                    <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                        {errors.transacted_at}
                                                    </p>
                                                ) : null}
                                            </div>

                                            <div>
                                                <label className="mb-2 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                    Conta
                                                </label>
                                                <select
                                                    value={data.account_id}
                                                    onChange={(event) =>
                                                        setField(
                                                            'account_id',
                                                            event.target.value,
                                                        )
                                                    }
                                                    className="h-13 w-full rounded-[20px] border border-[#232A35] bg-[#141922] px-4 text-[15px] text-white outline-none"
                                                >
                                                    <option value="">
                                                        Selecione
                                                    </option>
                                                    {accounts.map((account) => (
                                                        <option
                                                            key={account.id}
                                                            value={account.id}
                                                        >
                                                            {account.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.account_id ? (
                                                    <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                        {errors.account_id}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-3 block text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                                Categoria
                                            </label>
                                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                                {filteredCategories.map(
                                                    (category) => {
                                                        const isActive =
                                                            String(
                                                                category.id,
                                                            ) ===
                                                            data.category_id;

                                                        return (
                                                            <button
                                                                key={
                                                                    category.id
                                                                }
                                                                type="button"
                                                                onClick={() =>
                                                                    setField(
                                                                        'category_id',
                                                                        String(
                                                                            category.id,
                                                                        ),
                                                                    )
                                                                }
                                                                className={[
                                                                    'rounded-[22px] border px-4 py-4 text-left transition',
                                                                    isActive
                                                                        ? 'border-[#B5F955] bg-[#18210D] text-white shadow-[0_16px_32px_rgba(181,249,85,0.12)]'
                                                                        : 'border-[#232A35] bg-[#141922] text-[#D5DCE6] hover:border-[#303948] hover:bg-[#171D27]',
                                                                ].join(' ')}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span
                                                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white"
                                                                        style={{
                                                                            backgroundColor:
                                                                                category.color,
                                                                        }}
                                                                    >
                                                                        <CategoryIconGlyph
                                                                            icon={
                                                                                category.icon
                                                                            }
                                                                        />
                                                                    </span>
                                                                    <div>
                                                                        <p className="text-[15px] font-medium">
                                                                            {
                                                                                category.name
                                                                            }
                                                                        </p>
                                                                        <p className="text-[12px] text-current/70">
                                                                            {
                                                                                category.type_label
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </div>
                                            {errors.category_id ? (
                                                <p className="mt-2 text-[13px] text-[#FFB6B6]">
                                                    {errors.category_id}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="flex flex-col-reverse gap-3 border-t border-[#1B212C] pt-6 sm:flex-row sm:items-center sm:justify-end">
                                            <AppButton
                                                type="button"
                                                onClick={requestClose}
                                                variant="lime"
                                                className="px-5"
                                            >
                                                Fechar
                                            </AppButton>
                                            <AppButton
                                                type="button"
                                                onClick={onSubmit}
                                                loading={processing}
                                                variant="dark"
                                                className="px-5"
                                            >
                                                {editingTransaction
                                                    ? 'Salvar'
                                                    : 'Criar transação'}
                                            </AppButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
}
