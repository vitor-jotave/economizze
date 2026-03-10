import { useForm, usePage } from '@inertiajs/react';
import { useDeferredValue, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
    destroy as destroyTransaction,
    store as storeTransaction,
    update as updateTransaction,
} from '@/actions/App/Http/Controllers/TransactionController';
import AppButton from '@/components/app-button';
import CategoryIconGlyph from '@/components/category-icon-glyph';
import { formatBrazilianCurrency } from '@/lib/utils';
import type {
    Transaction,
    TransactionFormData,
    TransactionsPageProps,
} from '@/types/transactions';
import Layout from './layout';
import TransactionComposerModal from './transaction-composer-modal';

const defaultForm: TransactionFormData = {
    type: 'expense',
    amount: '',
    transacted_at: new Date().toISOString().slice(0, 10),
    account_id: '',
    category_id: '',
};

export default function Transactions(): ReactElement {
    const { transactions, transactionTypes, accounts, categories, summary } =
        usePage<TransactionsPageProps>().props;
    const [search, setSearch] = useState('');
    const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | string>(
        'all',
    );
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const deferredSearch = useDeferredValue(search);
    const form = useForm<TransactionFormData>(defaultForm);

    const filteredTransactions = useMemo(() => {
        const normalizedSearch = deferredSearch.trim().toLowerCase();

        return transactions.filter((transaction) => {
            const matchesType =
                activeTypeFilter === 'all' ||
                transaction.type === activeTypeFilter;

            if (!matchesType) {
                return false;
            }

            if (normalizedSearch.length === 0) {
                return true;
            }

            return [
                transaction.account.name ?? '',
                transaction.category.name ?? '',
            ]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch);
        });
    }, [activeTypeFilter, deferredSearch, transactions]);

    function resetForm(closeComposer = false): void {
        setEditingTransaction(null);
        form.reset();
        form.setData(defaultForm);
        form.clearErrors();

        if (closeComposer) {
            setIsComposerOpen(false);
        }
    }

    function openCreateFlow(): void {
        resetForm();
        setIsComposerOpen(true);
    }

    function fillForEdit(transaction: Transaction): void {
        setEditingTransaction(transaction);
        setIsComposerOpen(true);
        form.setData({
            type: transaction.type,
            amount: transaction.amount.toFixed(2),
            transacted_at:
                transaction.transacted_at ?? defaultForm.transacted_at,
            account_id: transaction.account.id
                ? String(transaction.account.id)
                : '',
            category_id: transaction.category.id
                ? String(transaction.category.id)
                : '',
        });
    }

    function submitForm(): void {
        form.submit(
            editingTransaction
                ? updateTransaction(editingTransaction.id)
                : storeTransaction(),
            {
                preserveScroll: true,
                onSuccess: () => resetForm(true),
            },
        );
    }

    function removeTransaction(transaction: Transaction): void {
        if (pendingDeleteId !== transaction.id) {
            setPendingDeleteId(transaction.id);

            window.setTimeout(() => {
                setPendingDeleteId((current) =>
                    current === transaction.id ? null : current,
                );
            }, 3200);

            return;
        }

        form.submit(destroyTransaction(transaction.id), {
            preserveScroll: true,
            onSuccess: () => {
                setPendingDeleteId(null);

                if (editingTransaction?.id === transaction.id) {
                    resetForm(true);
                }
            },
        });
    }

    return (
        <Layout currentPage="transactions" title="Transactions">
            <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                            Transacoes
                        </h1>
                        <p className="mt-3 max-w-[620px] text-[16px] leading-6 text-[#8B93A0]">
                            Registre entradas e saidas com contexto completo
                            para atualizar automaticamente os saldos das suas
                            contas.
                        </p>
                    </div>

                    <AppButton
                        type="button"
                        onClick={openCreateFlow}
                        variant="lime"
                        className="px-5 text-[14px]"
                    >
                        Nova Transacao
                    </AppButton>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <article className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6">
                        <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                            Entradas
                        </p>
                        <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                            {formatBrazilianCurrency(summary.income)}
                        </p>
                    </article>
                    <article className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6">
                        <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                            Saidas
                        </p>
                        <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                            {formatBrazilianCurrency(summary.expense)}
                        </p>
                    </article>
                    <article className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6">
                        <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                            Resultado
                        </p>
                        <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                            {formatBrazilianCurrency(
                                summary.income - summary.expense,
                            )}
                        </p>
                        <p className="mt-2 text-[14px] text-[#6E7683]">
                            {summary.count} transacao(oes)
                        </p>
                    </article>
                </div>

                <section className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#0C1016]">
                    <div className="flex flex-col gap-4 border-b border-[#171C24] px-6 py-5">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveTypeFilter('all')}
                                    className={[
                                        'rounded-full border px-4 py-2 text-[13px] transition',
                                        activeTypeFilter === 'all'
                                            ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                            : 'border-[#232A35] text-[#D5DCE6] hover:border-[#303948]',
                                    ].join(' ')}
                                >
                                    Tudo
                                </button>
                                {transactionTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() =>
                                            setActiveTypeFilter(type.value)
                                        }
                                        className={[
                                            'rounded-full border px-4 py-2 text-[13px] transition',
                                            activeTypeFilter === type.value
                                                ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                : 'border-[#232A35] text-[#D5DCE6] hover:border-[#303948]',
                                        ].join(' ')}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>

                            <div className="relative w-full lg:max-w-[280px]">
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
                                <input
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(event.target.value)
                                    }
                                    placeholder="Pesquisar..."
                                    className="h-12 w-full rounded-2xl border border-[#181D25] bg-[#13171E] pr-4 pl-11 text-[15px] text-white outline-none placeholder:text-[#727986]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-[#171C24]">
                        {filteredTransactions.length === 0 ? (
                            <div className="px-6 py-12 text-center text-[15px] text-[#7F8794]">
                                Nenhuma transacao encontrada com esse filtro.
                            </div>
                        ) : (
                            filteredTransactions.map((transaction) => {
                                const isPendingDelete =
                                    pendingDeleteId === transaction.id;

                                return (
                                    <article
                                        key={transaction.id}
                                        className="flex flex-col gap-5 px-6 py-5 xl:flex-row xl:items-center xl:justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span
                                                className="flex h-14 w-14 items-center justify-center rounded-[20px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
                                                style={{
                                                    backgroundColor:
                                                        transaction.category
                                                            .color ?? '#B5F955',
                                                }}
                                            >
                                                <CategoryIconGlyph
                                                    icon={
                                                        transaction.category
                                                            .icon ?? 'receipt'
                                                    }
                                                    className="h-6 w-6"
                                                />
                                            </span>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="text-[20px] font-medium text-white">
                                                        {
                                                            transaction.category
                                                                .name
                                                        }
                                                    </p>
                                                    <span className="rounded-full border border-[#232A35] px-3 py-1 text-[12px] tracking-[0.12em] text-[#A4ACB8] uppercase">
                                                        {transaction.type_label}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-[14px] text-[#7D848F]">
                                                    {transaction.account.name} •{' '}
                                                    {
                                                        transaction.transacted_at_label
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-8">
                                            <div className="text-left xl:text-right">
                                                <p className="text-[18px] font-medium text-white">
                                                    {formatBrazilianCurrency(
                                                        transaction.amount,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2 xl:justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        fillForEdit(transaction)
                                                    }
                                                    className="rounded-full border border-[#23303D] px-3 py-2 text-[13px] text-[#D7DCE4] transition hover:border-[#38495D]"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeTransaction(
                                                            transaction,
                                                        )
                                                    }
                                                    className={[
                                                        'rounded-full border px-3 py-2 text-[13px] transition',
                                                        isPendingDelete
                                                            ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                            : 'border-[#3D2323] text-[#FFB6B6] hover:border-[#6A3434]',
                                                    ].join(' ')}
                                                >
                                                    {isPendingDelete
                                                        ? 'Confirmar'
                                                        : 'Excluir'}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </section>
            </div>

            <TransactionComposerModal
                isOpen={isComposerOpen}
                editingTransaction={
                    editingTransaction
                        ? {
                              id: editingTransaction.id,
                          }
                        : null
                }
                transactionTypes={transactionTypes}
                accounts={accounts}
                categories={categories}
                data={form.data}
                errors={form.errors}
                processing={form.processing}
                onClose={() => resetForm(true)}
                onSubmit={submitForm}
                setField={(field, value) =>
                    form.setData(
                        field,
                        value as TransactionFormData[typeof field],
                    )
                }
            />
        </Layout>
    );
}
