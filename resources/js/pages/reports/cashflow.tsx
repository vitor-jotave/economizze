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
import { cashflow as reportCashflow } from '@/routes/reports';
import type { ReportCashflowPageProps, ReportInsight } from '@/types/reports';
import Layout from '../layout';

function insightToneClasses(tone: ReportInsight['tone']): string {
    return {
        positive: 'border-[#24411E] bg-[rgba(68,160,87,0.12)] text-[#B9F7B5]',
        warning: 'border-[#3C3419] bg-[rgba(181,249,85,0.12)] text-[#E7F5C4]',
        critical: 'border-[#47211C] bg-[rgba(255,107,73,0.12)] text-[#FFD4C8]',
        neutral: 'border-[#26313C] bg-[#121821] text-[#D6DDE5]',
    }[tone];
}

export default function ReportCashflow({
    activePeriod,
    periodOptions,
    summary,
    series,
    insights,
}: ReportCashflowPageProps): ReactElement {
    const maxMagnitude = Math.max(
        1,
        ...series.map((point) =>
            Math.max(Math.abs(point.income), Math.abs(point.expense)),
        ),
    );

    return (
        <>
            <Head title="Fluxo por período" />

            <Layout currentPage="reports-cashflow" title="Fluxo por período">
                <div className="space-y-6">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden rounded-[30px] border border-[#1B212C] bg-[linear-gradient(135deg,#0D1218_0%,#10161F_44%,#0E1A18_100%)] p-7"
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                            <div className="max-w-[760px]">
                                <span className="inline-flex rounded-full border border-[#24423B] bg-[rgba(91,226,176,0.12)] px-3 py-1 text-[12px] font-medium tracking-[0.14em] text-[#5BE2B0] uppercase">
                                    Report ativo
                                </span>
                                <h1 className="mt-5 font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                                    Fluxo por período
                                </h1>
                                <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#9AA3AF]">
                                    Compare o ritmo de entradas e saídas ao
                                    longo do tempo para identificar janelas de
                                    pressão, intervalos saudáveis e momentos em
                                    que o caixa respira melhor.
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
                                                reportCashflow.url({
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
                                Entradas
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-[#B6F955]">
                                {formatBrazilianCurrency(summary.income)}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.08 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Saídas
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-[#F95555]">
                                {formatBrazilianCurrency(summary.expense)}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.12 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Resultado
                            </p>
                            <p
                                className={[
                                    'mt-4 text-[32px] font-semibold tracking-[-0.05em]',
                                    summary.net >= 0
                                        ? 'text-[#B6F955]'
                                        : 'text-[#F95555]',
                                ].join(' ')}
                            >
                                {formatBrazilianCurrency(summary.net)}
                            </p>
                            <p className="mt-2 text-[14px] text-[#6E7683]">
                                Média por faixa:{' '}
                                {formatBrazilianCurrency(summary.averageNet)}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.24, delay: 0.16 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Faixas
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                                {series.length}
                            </p>
                            <p className="mt-2 text-[14px] text-[#6E7683]">
                                {summary.positiveIntervals} positivas •{' '}
                                {summary.negativeIntervals} negativas
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
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[24px] font-medium tracking-[-0.04em] text-white">
                                        Leitura temporal do caixa
                                    </p>
                                    <p className="mt-2 text-[15px] text-[#7F8794]">
                                        Verde mostra entradas, vermelho mostra
                                        saídas. O contraste entre as barras
                                        deixa claro onde o caixa respirou ou
                                        apertou.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4">
                                {series.map((point, index) => {
                                    const incomeWidth =
                                        (Math.abs(point.income) /
                                            maxMagnitude) *
                                        100;
                                    const expenseWidth =
                                        (Math.abs(point.expense) /
                                            maxMagnitude) *
                                        100;

                                    return (
                                        <motion.article
                                            key={point.label}
                                            initial={{ opacity: 0, y: 14 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.24,
                                                delay: 0.1 + index * 0.04,
                                            }}
                                            className="rounded-[24px] border border-[#171C24] bg-[#10151C] p-4"
                                        >
                                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                                <div className="xl:min-w-[140px]">
                                                    <p className="text-[16px] font-medium text-white">
                                                        {point.label}
                                                    </p>
                                                    <p
                                                        className={[
                                                            'mt-1 inline-flex items-center gap-1 text-[14px]',
                                                            point.net >= 0
                                                                ? 'text-[#B6F955]'
                                                                : 'text-[#F95555]',
                                                        ].join(' ')}
                                                    >
                                                        {point.net >= 0 ? (
                                                            <ArrowUpRight className="h-4 w-4" />
                                                        ) : (
                                                            <ArrowDownRight className="h-4 w-4" />
                                                        )}
                                                        {formatBrazilianCurrency(
                                                            point.net,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="grid flex-1 gap-3 xl:grid-cols-2">
                                                    <div>
                                                        <div className="mb-2 flex items-center justify-between text-[13px] text-[#8B93A0]">
                                                            <span>
                                                                Entradas
                                                            </span>
                                                            <span className="text-[#B6F955]">
                                                                {formatBrazilianCurrency(
                                                                    point.income,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="h-3 overflow-hidden rounded-full bg-[#141A22]">
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${incomeWidth}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    delay:
                                                                        0.18 +
                                                                        index *
                                                                            0.04,
                                                                }}
                                                                className="h-full rounded-full bg-[#B6F955]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="mb-2 flex items-center justify-between text-[13px] text-[#8B93A0]">
                                                            <span>Saídas</span>
                                                            <span className="text-[#F95555]">
                                                                {formatBrazilianCurrency(
                                                                    point.expense,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="h-3 overflow-hidden rounded-full bg-[#141A22]">
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${expenseWidth}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 0.5,
                                                                    delay:
                                                                        0.2 +
                                                                        index *
                                                                            0.04,
                                                                }}
                                                                className="h-full rounded-full bg-[#F95555]"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.article>
                                    );
                                })}
                            </div>
                        </motion.section>

                        <motion.aside
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.08 }}
                            className="rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#24423B] bg-[rgba(91,226,176,0.12)] text-[#5BE2B0]">
                                    <Sparkles className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-[20px] font-medium text-white">
                                        O que o fluxo está dizendo
                                    </p>
                                    <p className="mt-1 text-[14px] text-[#7F8794]">
                                        Recomendações automáticas a partir das
                                        oscilações do período.
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

                            <div className="mt-6 rounded-[22px] border border-[#171C24] bg-[#10161D] p-4">
                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                    Melhor faixa
                                </p>
                                <p className="mt-3 text-[18px] font-medium text-[#B6F955]">
                                    {summary.bestInterval?.label ?? 'Sem dados'}
                                </p>
                                <p className="mt-1 text-[14px] text-[#A4ACB8]">
                                    {summary.bestInterval
                                        ? formatBrazilianCurrency(
                                              summary.bestInterval.net,
                                          )
                                        : 'Sem movimentação suficiente'}
                                </p>
                            </div>

                            <div className="mt-3 rounded-[22px] border border-[#171C24] bg-[#10161D] p-4">
                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                    Pior faixa
                                </p>
                                <p className="mt-3 text-[18px] font-medium text-[#F95555]">
                                    {summary.worstInterval?.label ??
                                        'Sem dados'}
                                </p>
                                <p className="mt-1 text-[14px] text-[#A4ACB8]">
                                    {summary.worstInterval
                                        ? formatBrazilianCurrency(
                                              summary.worstInterval.net,
                                          )
                                        : 'Sem movimentação suficiente'}
                                </p>
                            </div>
                        </motion.aside>
                    </div>

                    <motion.section
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.12 }}
                        className="rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6"
                    >
                        <p className="text-[24px] font-medium tracking-[-0.04em] text-white">
                            Diagnóstico rápido
                        </p>
                        <div className="mt-5 grid gap-4 md:grid-cols-3">
                            <div className="rounded-[22px] border border-[#171C24] bg-[#10161D] p-4">
                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                    Faixas positivas
                                </p>
                                <p className="mt-3 text-[28px] font-semibold text-[#B6F955]">
                                    {summary.positiveIntervals}
                                </p>
                            </div>
                            <div className="rounded-[22px] border border-[#171C24] bg-[#10161D] p-4">
                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                    Faixas negativas
                                </p>
                                <p className="mt-3 text-[28px] font-semibold text-[#F95555]">
                                    {summary.negativeIntervals}
                                </p>
                            </div>
                            <div className="rounded-[22px] border border-[#171C24] bg-[#10161D] p-4">
                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                    Média líquida
                                </p>
                                <p
                                    className={[
                                        'mt-3 text-[28px] font-semibold',
                                        summary.averageNet >= 0
                                            ? 'text-[#B6F955]'
                                            : 'text-[#F95555]',
                                    ].join(' ')}
                                >
                                    {formatBrazilianCurrency(
                                        summary.averageNet,
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.section>
                </div>
            </Layout>
        </>
    );
}
