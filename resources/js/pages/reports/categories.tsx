import { Head, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowDownRight,
    ArrowUpRight,
    CircleAlert,
    Sparkles,
} from 'lucide-react';
import type { ReactElement } from 'react';
import CategoryIconGlyph from '@/components/category-icon-glyph';
import { formatBrazilianCurrency } from '@/lib/utils';
import { categories as reportCategories } from '@/routes/reports';
import type {
    ReportCategoriesPageProps,
    ReportCategoryBreakdown,
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

function trendToneClasses(category: ReportCategoryBreakdown): string {
    if (category.trend.direction === 'up') {
        return 'text-[#FF8A70]';
    }

    if (category.trend.direction === 'down') {
        return 'text-[#B5F955]';
    }

    return 'text-[#98A1AD]';
}

export default function ReportCategories({
    activePeriod,
    periodOptions,
    summary,
    categories,
    insights,
}: ReportCategoriesPageProps): ReactElement {
    return (
        <>
            <Head title="Gastos por categoria" />

            <Layout
                currentPage="reports-categories"
                title="Gastos por categoria"
            >
                <div className="space-y-6">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden rounded-[30px] border border-[#1B212C] bg-[linear-gradient(135deg,#0E131A_0%,#0D1218_48%,#141D12_100%)] p-7"
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                            <div className="max-w-[760px]">
                                <span className="inline-flex rounded-full border border-[#2E3E22] bg-[rgba(181,249,85,0.12)] px-3 py-1 text-[12px] font-medium tracking-[0.14em] text-[#B5F955] uppercase">
                                    Report ativo
                                </span>
                                <h1 className="mt-5 font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                                    Gasto por categoria
                                </h1>
                                <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#9AA3AF]">
                                    Veja quais categorias consomem mais caixa,
                                    quais cresceram em relação ao período
                                    anterior e onde existe margem prática para
                                    gastar menos.
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
                                                reportCategories.url({
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

                    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_380px]">
                        <motion.section
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.04 }}
                            className="rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div className="rounded-[24px] border border-[#171C24] bg-[#10161D] p-5">
                                    <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                        Total em despesas
                                    </p>
                                    <p className="mt-4 text-[30px] font-semibold tracking-[-0.05em] text-white">
                                        {formatBrazilianCurrency(
                                            summary.totalExpense,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-[24px] border border-[#171C24] bg-[#10161D] p-5">
                                    <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                        Ticket médio
                                    </p>
                                    <p className="mt-4 text-[30px] font-semibold tracking-[-0.05em] text-white">
                                        {formatBrazilianCurrency(
                                            summary.averageTransaction,
                                        )}
                                    </p>
                                </div>
                                <div className="rounded-[24px] border border-[#171C24] bg-[#10161D] p-5">
                                    <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                        Categorias ativas
                                    </p>
                                    <p className="mt-4 text-[30px] font-semibold tracking-[-0.05em] text-white">
                                        {summary.categoriesCount}
                                    </p>
                                </div>
                                <div className="rounded-[24px] border border-[#171C24] bg-[#10161D] p-5">
                                    <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                        Lançamentos
                                    </p>
                                    <p className="mt-4 text-[30px] font-semibold tracking-[-0.05em] text-white">
                                        {summary.transactionsCount}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-[24px] border border-[#1C2631] bg-[linear-gradient(135deg,#131A23_0%,#0F141A_100%)] p-5">
                                <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                    Categoria dominante
                                </p>
                                <div className="mt-4 flex items-center gap-4">
                                    <span
                                        className="flex h-14 w-14 items-center justify-center rounded-[20px] text-white"
                                        style={{
                                            backgroundColor:
                                                summary.topCategory?.color ??
                                                '#B5F955',
                                        }}
                                    >
                                        <CategoryIconGlyph
                                            icon={
                                                summary.topCategory?.icon ??
                                                'receipt'
                                            }
                                            className="h-6 w-6"
                                        />
                                    </span>
                                    <div>
                                        <p className="text-[24px] font-medium tracking-[-0.04em] text-white">
                                            {summary.topCategory?.name ??
                                                'Sem dados no período'}
                                        </p>
                                        <p className="mt-1 text-[15px] text-[#8E97A4]">
                                            {summary.topCategory
                                                ? `${summary.topCategory.share}% das despesas • ${formatBrazilianCurrency(summary.topCategory.total)}`
                                                : 'Cadastre mais transações para destravar esta leitura.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <motion.aside
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.28, delay: 0.08 }}
                            className="rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2E3E22] bg-[rgba(181,249,85,0.12)] text-[#B5F955]">
                                    <Sparkles className="h-5 w-5" />
                                </span>
                                <div>
                                    <p className="text-[20px] font-medium text-white">
                                        Oportunidades de economia
                                    </p>
                                    <p className="mt-1 text-[14px] text-[#7F8794]">
                                        Leitura automática baseada no período
                                        atual.
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

                    <motion.section
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.12 }}
                        className="overflow-hidden rounded-[28px] border border-[#1B212C] bg-[#0C1016]"
                    >
                        <div className="border-b border-[#171C24] px-6 py-5">
                            <p className="text-[24px] font-medium tracking-[-0.04em] text-white">
                                Breakdown das categorias
                            </p>
                            <p className="mt-2 text-[15px] text-[#7F8794]">
                                O peso de cada categoria, tendência versus o
                                período anterior e recorrência no seu fluxo.
                            </p>
                        </div>

                        <div className="divide-y divide-[#171C24]">
                            <AnimatePresence mode="wait">
                                {categories.length === 0 ? (
                                    <motion.div
                                        key="empty-state"
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.22 }}
                                        className="px-6 py-12 text-center text-[15px] text-[#7F8794]"
                                    >
                                        Nenhuma despesa encontrada no período
                                        selecionado.
                                    </motion.div>
                                ) : (
                                    categories.map((category, index) => (
                                        <motion.article
                                            key={category.id}
                                            initial={{ opacity: 0, y: 18 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                duration: 0.24,
                                                delay: 0.16 + index * 0.04,
                                            }}
                                            whileHover={{
                                                backgroundColor:
                                                    'rgba(18, 24, 32, 0.72)',
                                            }}
                                            className="px-6 py-5 transition-colors duration-200"
                                        >
                                            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <span
                                                        className="flex h-14 w-14 items-center justify-center rounded-[20px] text-white"
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    >
                                                        <CategoryIconGlyph
                                                            icon={category.icon}
                                                            className="h-6 w-6"
                                                        />
                                                    </span>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <p className="truncate text-[20px] font-medium text-white">
                                                                {category.name}
                                                            </p>
                                                            <span className="rounded-full border border-[#222A35] bg-[#131921] px-3 py-1 text-[12px] text-[#9DA5B1]">
                                                                {
                                                                    category.transactions_count
                                                                }{' '}
                                                                lançamento(s)
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#141A22]">
                                                            <motion.div
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${Math.min(category.share, 100)}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 0.55,
                                                                    delay:
                                                                        0.2 +
                                                                        index *
                                                                            0.04,
                                                                }}
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        category.color,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid gap-3 text-right sm:grid-cols-2 xl:min-w-[460px] xl:grid-cols-4">
                                                    <div>
                                                        <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                            Total
                                                        </p>
                                                        <p className="mt-2 text-[18px] font-medium text-white">
                                                            {formatBrazilianCurrency(
                                                                category.total,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                            Share
                                                        </p>
                                                        <p className="mt-2 text-[18px] font-medium text-white">
                                                            {category.share}%
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                            Ticket médio
                                                        </p>
                                                        <p className="mt-2 text-[18px] font-medium text-white">
                                                            {formatBrazilianCurrency(
                                                                category.average_transaction,
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] tracking-[0.14em] text-[#66707C] uppercase">
                                                            Tendência
                                                        </p>
                                                        <p
                                                            className={[
                                                                'mt-2 inline-flex items-center justify-end gap-1 text-[18px] font-medium',
                                                                trendToneClasses(
                                                                    category,
                                                                ),
                                                            ].join(' ')}
                                                        >
                                                            {category.trend
                                                                .direction ===
                                                            'up' ? (
                                                                <ArrowUpRight className="h-4 w-4" />
                                                            ) : category.trend
                                                                  .direction ===
                                                              'down' ? (
                                                                <ArrowDownRight className="h-4 w-4" />
                                                            ) : null}
                                                            {
                                                                category.trend
                                                                    .value
                                                            }
                                                            %
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
                </div>
            </Layout>
        </>
    );
}
