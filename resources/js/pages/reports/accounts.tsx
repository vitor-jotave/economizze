import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    CircleAlert,
    Sparkles,
} from 'lucide-react';
import type { ReactElement } from 'react';
import { formatBrazilianCurrency } from '@/lib/utils';
import { accounts as reportAccounts } from '@/routes/reports';
import type {
    ReportAccountHealthItem,
    ReportAccountsPageProps,
    ReportInsight,
} from '@/types/reports';
import Layout from '../layout';

function insightToneClasses(tone: ReportInsight['tone']): string {
    return {
        positive: 'border-[#24411E] bg-[rgba(68,160,87,0.12)] text-[#B9F7B5]',
        warning: 'border-[#3C3419] bg-[rgba(181,249,85,0.12)] text-[#E7F5C4]',
        critical: 'border-[#47211C] bg-[rgba(255,107,73,0.12)] text-[#FFD4C8]',
        neutral: 'border-[#26313C] bg-[#121821] text-[#D6DDE5]',
    }[tone];
}

function netTone(account: ReportAccountHealthItem): string {
    if (account.net > 0) {
        return 'text-[#B6F955]';
    }

    if (account.net < 0) {
        return 'text-[#F95555]';
    }

    return 'text-[#98A1AD]';
}

export default function ReportAccounts({
    activePeriod,
    periodOptions,
    summary,
    accounts,
    insights,
}: ReportAccountsPageProps): ReactElement {
    return (
        <>
            <Head title="Saúde das contas" />

            <Layout currentPage="reports-accounts" title="Saúde das contas">
                <div className="space-y-6">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden rounded-[30px] border border-[#1B212C] bg-[linear-gradient(135deg,#0F1220_0%,#10161F_40%,#121A14_100%)] p-7"
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                            <div className="max-w-[760px]">
                                <span className="inline-flex rounded-full border border-[#303A5C] bg-[rgba(124,140,255,0.12)] px-3 py-1 text-[12px] font-medium tracking-[0.14em] text-[#A8B2FF] uppercase">
                                    Report ativo
                                </span>
                                <h1 className="mt-5 font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                                    Saúde das contas
                                </h1>
                                <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#9AA3AF]">
                                    Entenda onde o seu saldo está concentrado,
                                    quais contas estão recebendo ou drenando
                                    caixa e quais estruturas parecem
                                    subutilizadas.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 xl:max-w-[340px] xl:justify-end">
                                {periodOptions.map((option) => (
                                    <motion.button
                                        key={option.key}
                                        type="button"
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() =>
                                            router.visit(
                                                reportAccounts.url({
                                                    query: {
                                                        period: option.key,
                                                    },
                                                }),
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                },
                                            )
                                        }
                                        className={[
                                            'rounded-full border px-4 py-2 text-[13px] transition',
                                            activePeriod === option.key
                                                ? 'border-[#B5F955] bg-[#B5F955] text-[#11150C]'
                                                : 'border-[#232A35] text-[#D5DCE6] hover:border-[#303948]',
                                        ].join(' ')}
                                    >
                                        {option.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <div className="grid gap-4 lg:grid-cols-4">
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.04 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Saldo total
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                                {formatBrazilianCurrency(summary.totalBalance)}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.08 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Contas positivas
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-[#B6F955]">
                                {summary.positiveAccounts}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.12 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Contas negativas
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-[#F95555]">
                                {summary.negativeAccounts}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.16 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Total de contas
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                                {summary.accountsCount}
                            </p>
                        </motion.article>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_380px]">
                        <motion.section
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.05 }}
                            className="rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="rounded-[24px] border border-[#171C24] bg-[#10161D] p-5">
                                    <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                        Maior saldo
                                    </p>
                                    <p className="mt-3 text-[24px] font-medium tracking-[-0.04em] text-white">
                                        {summary.topBalanceAccount?.name ??
                                            'Sem dados'}
                                    </p>
                                    <p className="mt-2 text-[15px] text-[#A4ACB8]">
                                        {summary.topBalanceAccount
                                            ? `${summary.topBalanceAccount.share_of_balance}% do caixa • ${formatBrazilianCurrency(summary.topBalanceAccount.current_balance)}`
                                            : 'Nenhuma conta encontrada'}
                                    </p>
                                </div>
                                <div className="rounded-[24px] border border-[#171C24] bg-[#10161D] p-5">
                                    <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                        Maior pressão
                                    </p>
                                    <p className="mt-3 text-[24px] font-medium tracking-[-0.04em] text-white">
                                        {summary.worstNetAccount?.name ??
                                            'Sem dados'}
                                    </p>
                                    <p className="mt-2 text-[15px] text-[#A4ACB8]">
                                        {summary.worstNetAccount
                                            ? formatBrazilianCurrency(
                                                  summary.worstNetAccount.net,
                                              )
                                            : 'Nenhuma conta encontrada'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <AnimatePresence mode="wait">
                                    {accounts.length === 0 ? (
                                        <motion.div
                                            key="empty-state"
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -12 }}
                                            transition={{ duration: 0.22 }}
                                            className="px-6 py-12 text-center text-[15px] text-[#7F8794]"
                                        >
                                            Nenhuma conta encontrada para esse
                                            período.
                                        </motion.div>
                                    ) : (
                                        accounts.map((account, index) => (
                                            <motion.article
                                                key={account.id}
                                                initial={{ opacity: 0, y: 14 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{
                                                    duration: 0.24,
                                                    delay: 0.12 + index * 0.04,
                                                }}
                                                whileHover={{
                                                    backgroundColor:
                                                        'rgba(18, 24, 32, 0.72)',
                                                }}
                                                className="rounded-[24px] border border-[#171C24] bg-[#10151C] p-5 transition-colors duration-200"
                                            >
                                                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                                    <div className="flex min-w-0 items-center gap-4">
                                                        <span
                                                            className="flex h-14 w-14 items-center justify-center rounded-[20px] text-white"
                                                            style={{
                                                                backgroundColor:
                                                                    account.color,
                                                            }}
                                                        >
                                                            {account.name
                                                                .slice(0, 1)
                                                                .toUpperCase()}
                                                        </span>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <p className="truncate text-[20px] font-medium text-white">
                                                                    {
                                                                        account.name
                                                                    }
                                                                </p>
                                                                <span className="rounded-full border border-[#222A35] bg-[#131921] px-3 py-1 text-[12px] text-[#9DA5B1]">
                                                                    {
                                                                        account.type_label
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#141A22]">
                                                                <motion.div
                                                                    initial={{
                                                                        width: 0,
                                                                    }}
                                                                    animate={{
                                                                        width: `${Math.min(account.share_of_balance, 100)}%`,
                                                                    }}
                                                                    transition={{
                                                                        duration: 0.55,
                                                                        delay:
                                                                            0.18 +
                                                                            index *
                                                                                0.04,
                                                                    }}
                                                                    className="h-full rounded-full"
                                                                    style={{
                                                                        backgroundColor:
                                                                            account.color,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="grid gap-3 text-right sm:grid-cols-2 xl:min-w-[520px] xl:grid-cols-5">
                                                        <div>
                                                            <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                                Saldo
                                                            </p>
                                                            <p className="mt-2 text-[18px] font-medium text-white">
                                                                {formatBrazilianCurrency(
                                                                    account.current_balance,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                                Entradas
                                                            </p>
                                                            <p className="mt-2 text-[18px] font-medium text-[#B6F955]">
                                                                {formatBrazilianCurrency(
                                                                    account.income,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                                Saídas
                                                            </p>
                                                            <p className="mt-2 text-[18px] font-medium text-[#F95555]">
                                                                {formatBrazilianCurrency(
                                                                    account.expense,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                                Líquido
                                                            </p>
                                                            <p
                                                                className={[
                                                                    'mt-2 inline-flex items-center justify-end gap-1 text-[18px] font-medium',
                                                                    netTone(
                                                                        account,
                                                                    ),
                                                                ].join(' ')}
                                                            >
                                                                {account.net >
                                                                0 ? (
                                                                    <ArrowUpRight className="h-4 w-4" />
                                                                ) : account.net <
                                                                  0 ? (
                                                                    <ArrowDownRight className="h-4 w-4" />
                                                                ) : null}
                                                                {formatBrazilianCurrency(
                                                                    account.net,
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                                Movimentos
                                                            </p>
                                                            <p className="mt-2 text-[18px] font-medium text-white">
                                                                {
                                                                    account.transactions_count
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.article>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.section>

                        <motion.aside
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.08 }}
                            className="rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#303A5C] bg-[rgba(124,140,255,0.12)] text-[#A8B2FF]">
                                    <Sparkles className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-[20px] font-medium text-white">
                                        Leitura estrutural
                                    </p>
                                    <p className="mt-1 text-[14px] text-[#7F8794]">
                                        Oportunidades para distribuir melhor o
                                        seu caixa.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-5 space-y-3">
                                {insights.map((insight, index) => (
                                    <motion.article
                                        key={insight.id}
                                        initial={{ opacity: 0, y: 14 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.22,
                                            delay: 0.12 + index * 0.05,
                                        }}
                                        className={[
                                            'rounded-[22px] border p-4',
                                            insightToneClasses(insight.tone),
                                        ].join(' ')}
                                    >
                                        <div className="flex items-start gap-3">
                                            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                                            <div>
                                                <p className="text-[15px] font-medium">
                                                    {insight.title}
                                                </p>
                                                <p className="mt-2 text-[14px] leading-6 opacity-90">
                                                    {insight.description}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.article>
                                ))}
                            </div>
                        </motion.aside>
                    </div>
                </div>
            </Layout>
        </>
    );
}
