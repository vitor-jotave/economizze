import { router, useForm, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
    destroy as destroyAccount,
    store as storeAccount,
    update as updateAccount,
} from '@/actions/App/Http/Controllers/AccountController';
import AppButton from '@/components/app-button';
import { formatBrazilianCurrency } from '@/lib/utils';
import { index as accountsIndex } from '@/routes/accounts';
import type {
    Account,
    AccountFormData,
    AccountsPageProps,
} from '@/types/accounts';
import AccountComposerModal from './account-composer-modal';
import Layout from './layout';

const defaultForm: AccountFormData = {
    name: '',
    type: '',
    institution: '',
    currency: 'BRL',
    initial_balance: '0.00',
    color: '#B5F955',
};

export default function Accounts(): ReactElement {
    const page = usePage<AccountsPageProps>();
    const { accounts, accountTypes } = page.props;
    const [search, setSearch] = useState(
        () =>
            new URLSearchParams(page.url.split('?')[1] ?? '').get('search') ??
            '',
    );
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
    const deferredSearch = useDeferredValue(search);

    const form = useForm<AccountFormData>(defaultForm);

    const filteredAccounts = useMemo(() => {
        const normalizedSearch = deferredSearch.trim().toLowerCase();

        if (normalizedSearch.length === 0) {
            return accounts;
        }

        return accounts.filter((account) =>
            [
                account.name,
                account.type_label,
                account.institution ?? '',
                account.currency,
            ]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch),
        );
    }, [accounts, deferredSearch]);

    useEffect(() => {
        const query = new URLSearchParams(page.url.split('?')[1] ?? '');
        const composer = query.get('composer');
        const nextSearch = query.get('search') ?? '';

        setSearch((current) => (current === nextSearch ? current : nextSearch));

        if (composer === 'create' && !isComposerOpen) {
            openCreateFlow();
        }
    }, [isComposerOpen, page.url]);

    function resetForm(closeComposer = false): void {
        setEditingAccount(null);
        form.reset();
        form.setData(defaultForm);
        form.clearErrors();

        if (closeComposer) {
            setIsComposerOpen(false);

            const composer = new URLSearchParams(
                page.url.split('?')[1] ?? '',
            ).get('composer');

            if (composer === 'create') {
                router.visit(accountsIndex.url(), {
                    preserveScroll: true,
                    preserveState: false,
                    replace: true,
                });
            }
        }
    }

    function openCreateFlow(): void {
        resetForm();
        setIsComposerOpen(true);
    }

    function fillForEdit(account: Account): void {
        setEditingAccount(account);
        setIsComposerOpen(true);
        form.setData({
            name: account.name,
            type: account.type,
            institution: account.institution ?? '',
            currency: account.currency,
            initial_balance:
                account.type === 'credit_card'
                    ? account.credit_limit.toFixed(2)
                    : account.initial_balance.toFixed(2),
            color: account.color,
        });
    }

    function submitForm(): void {
        form.submit(
            editingAccount ? updateAccount(editingAccount.id) : storeAccount(),
            {
                preserveScroll: true,
                onSuccess: () => {
                    resetForm(true);
                },
            },
        );
    }

    function removeAccount(account: Account): void {
        if (pendingDeleteId !== account.id) {
            setPendingDeleteId(account.id);

            window.setTimeout(() => {
                setPendingDeleteId((current) =>
                    current === account.id ? null : current,
                );
            }, 3200);

            return;
        }

        form.submit(destroyAccount(account.id), {
            preserveScroll: true,
            onSuccess: () => {
                setPendingDeleteId(null);

                if (editingAccount?.id === account.id) {
                    resetForm(true);
                }
            },
        });
    }

    function primaryAmount(account: Account): number {
        return account.type === 'credit_card'
            ? account.available_credit
            : account.current_balance;
    }

    function primaryAmountLabel(account: Account): string {
        return account.type === 'credit_card' ? 'Disponível' : 'Saldo';
    }

    function secondaryAmountLabel(account: Account): string {
        return account.type === 'credit_card' ? 'Limite' : 'Inicial';
    }

    function secondaryAmount(account: Account): number {
        return account.type === 'credit_card'
            ? account.credit_limit
            : account.initial_balance;
    }

    return (
        <Layout currentPage="accounts" title="Accounts">
            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28 }}
                    className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
                >
                    <div>
                        <h1 className="hidden font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white md:block">
                            Contas
                        </h1>
                        <p className="mt-3 max-w-[620px] text-[16px] leading-6 text-[#8B93A0]">
                            Cadastre as carteiras e contas que concentram seu
                            saldo.
                        </p>
                    </div>

                    <AppButton
                        type="button"
                        onClick={openCreateFlow}
                        variant="lime"
                        className="px-5 text-[14px]"
                    >
                        Nova Conta
                    </AppButton>
                </motion.div>

                <motion.section
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.32, delay: 0.06 }}
                    className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#0C1016]"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.24, delay: 0.12 }}
                        className="flex flex-col gap-4 border-b border-[#171C24] px-6 py-5 md:flex-row md:items-center md:justify-between"
                    >
                        <div>
                            <p className="mt-1 text-[14px] text-[#6E7683]">
                                {filteredAccounts.length} conta(s) listada(s)
                            </p>
                        </div>

                        <motion.div
                            layout
                            className="relative w-full md:max-w-[280px]"
                        >
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
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.22, delay: 0.16 }}
                        className="grid grid-cols-[minmax(0,1.2fr)_150px_150px_130px] border-b border-[#171C24] px-6 py-4 text-[13px] tracking-[0.12em] text-[#7F8794] uppercase"
                    >
                        <div>Conta</div>
                        <div>Tipo</div>
                        <div>Saldo / Limite</div>
                        <div className="text-right">Ações</div>
                    </motion.div>

                    <div className="divide-y divide-[#171C24]">
                        <AnimatePresence mode="wait">
                            {filteredAccounts.length === 0 ? (
                                <motion.div
                                    key="empty-state"
                                    initial={{ opacity: 0, y: 18 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22 }}
                                    className="px-6 py-12 text-center text-[15px] text-[#7F8794]"
                                >
                                    Nenhuma conta encontrada com esse filtro.
                                </motion.div>
                            ) : (
                                filteredAccounts.map((account, index) => {
                                    const isPendingDelete =
                                        pendingDeleteId === account.id;

                                    return (
                                        <motion.div
                                            key={account.id}
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                duration: 0.24,
                                                delay: 0.18 + index * 0.04,
                                            }}
                                            whileHover={{
                                                backgroundColor:
                                                    'rgba(18, 24, 32, 0.72)',
                                            }}
                                            className="grid grid-cols-[minmax(0,1.2fr)_150px_150px_130px] items-center px-6 py-5 transition-colors duration-200"
                                        >
                                            <div className="flex items-center gap-4">
                                                <motion.span
                                                    initial={{
                                                        scale: 0.88,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        scale: 1,
                                                        opacity: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.22,
                                                        delay:
                                                            0.22 + index * 0.04,
                                                    }}
                                                    className="h-11 w-11 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            account.color,
                                                    }}
                                                />
                                                <div>
                                                    <p className="text-[18px] font-medium text-white">
                                                        {account.name}
                                                    </p>
                                                    <p className="text-[14px] text-[#7D848F]">
                                                        {account.institution ??
                                                            'Sem instituicao'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-[15px] text-[#D7DCE4]">
                                                {account.type_label}
                                            </div>
                                            <div>
                                                <p className="text-[16px] font-medium text-white">
                                                    {primaryAmountLabel(
                                                        account,
                                                    )}
                                                    :{' '}
                                                    {formatBrazilianCurrency(
                                                        primaryAmount(account),
                                                    )}
                                                </p>
                                                <p className="text-[13px] text-[#6E7683]">
                                                    {secondaryAmountLabel(
                                                        account,
                                                    )}
                                                    :{' '}
                                                    {formatBrazilianCurrency(
                                                        secondaryAmount(
                                                            account,
                                                        ),
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-end gap-2">
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ y: -1 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() =>
                                                        fillForEdit(account)
                                                    }
                                                    className="rounded-full border border-[#23303D] px-3 py-2 text-[13px] text-[#D7DCE4] transition-colors duration-200 hover:border-[#34475A] hover:bg-[#121821]"
                                                >
                                                    Editar
                                                </motion.button>
                                                <motion.button
                                                    type="button"
                                                    whileHover={{ y: -1 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() =>
                                                        removeAccount(account)
                                                    }
                                                    className={[
                                                        'rounded-full border px-3 py-2 text-[13px] transition-colors duration-200',
                                                        isPendingDelete
                                                            ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                            : 'border-[#3D2323] text-[#FFB6B6] hover:border-[#5A3030] hover:bg-[#1A1010]',
                                                    ].join(' ')}
                                                >
                                                    {isPendingDelete
                                                        ? 'Confirmar'
                                                        : 'Excluir'}
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </motion.section>
            </div>

            <AccountComposerModal
                isOpen={isComposerOpen}
                editingAccount={
                    editingAccount
                        ? {
                              id: editingAccount.id,
                              name: editingAccount.name,
                          }
                        : null
                }
                accountTypes={accountTypes}
                data={form.data}
                errors={form.errors}
                processing={form.processing}
                onClose={() => resetForm(true)}
                onSubmit={submitForm}
                setField={(field, value) =>
                    form.setData(field, value as AccountFormData[typeof field])
                }
            />
        </Layout>
    );
}
