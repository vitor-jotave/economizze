import { useForm, usePage } from '@inertiajs/react';
import type { ReactElement } from 'react';
import { useDeferredValue, useMemo, useState } from 'react';
import {
    destroy as destroyAccount,
    store as storeAccount,
    update as updateAccount,
} from '@/actions/App/Http/Controllers/AccountController';
import AppButton from '@/components/app-button';
import { formatBrazilianCurrency } from '@/lib/utils';
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
    const { accounts, accountTypes } = usePage<AccountsPageProps>().props;
    const [search, setSearch] = useState('');
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [isComposerOpen, setIsComposerOpen] = useState(false);
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

    function resetForm(closeComposer = false): void {
        setEditingAccount(null);
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

    function fillForEdit(account: Account): void {
        setEditingAccount(account);
        setIsComposerOpen(true);
        form.setData({
            name: account.name,
            type: account.type,
            institution: account.institution ?? '',
            currency: account.currency,
            initial_balance: account.initial_balance.toFixed(2),
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
        const action = destroyAccount(account.id);

        if (!window.confirm(`Remover a conta "${account.name}"?`)) {
            return;
        }

        form.submit(action, {
            preserveScroll: true,
            onSuccess: () => {
                if (editingAccount?.id === account.id) {
                    resetForm(true);
                }
            },
        });
    }

    return (
        <Layout currentPage="accounts" title="Accounts">
            <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                        <h1 className="font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
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
                </div>

                <section className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#0C1016]">
                    <div className="flex flex-col gap-4 border-b border-[#171C24] px-6 py-5 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="mt-1 text-[14px] text-[#6E7683]">
                                {filteredAccounts.length} conta(s) listada(s)
                            </p>
                        </div>

                        <div className="relative w-full md:max-w-[280px]">
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

                    <div className="grid grid-cols-[minmax(0,1.2fr)_150px_150px_130px] border-b border-[#171C24] px-6 py-4 text-[13px] tracking-[0.12em] text-[#7F8794] uppercase">
                        <div>Conta</div>
                        <div>Tipo</div>
                        <div>Saldo</div>
                        <div className="text-right">Ações</div>
                    </div>

                    <div className="divide-y divide-[#171C24]">
                        {filteredAccounts.length === 0 ? (
                            <div className="px-6 py-12 text-center text-[15px] text-[#7F8794]">
                                Nenhuma conta encontrada com esse filtro.
                            </div>
                        ) : (
                            filteredAccounts.map((account) => (
                                <div
                                    key={account.id}
                                    className="grid grid-cols-[minmax(0,1.2fr)_150px_150px_130px] items-center px-6 py-5"
                                >
                                    <div className="flex items-center gap-4">
                                        <span
                                            className="h-11 w-11 rounded-full"
                                            style={{
                                                backgroundColor: account.color,
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
                                            {formatBrazilianCurrency(
                                                account.current_balance,
                                            )}
                                        </p>
                                        <p className="text-[13px] text-[#6E7683]">
                                            Inicial:{' '}
                                            {formatBrazilianCurrency(
                                                account.initial_balance,
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fillForEdit(account)}
                                            className="rounded-full border border-[#23303D] px-3 py-2 text-[13px] text-[#D7DCE4]"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeAccount(account)
                                            }
                                            className="rounded-full border border-[#3D2323] px-3 py-2 text-[13px] text-[#FFB6B6]"
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
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
