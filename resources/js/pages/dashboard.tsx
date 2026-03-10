import { Head, router, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import type { ReactElement } from 'react';
import { useState } from 'react';
import AppButton from '@/components/app-button';
import CategoryIconGlyph from '@/components/category-icon-glyph';
import { formatBrazilianCurrency } from '@/lib/utils';
import { home } from '@/routes';
import { categories as reportCategories } from '@/routes/reports';
import type {
    DashboardCategoryBreakdown,
    DashboardPageProps,
    DashboardPeriodOption,
    DashboardSeriesPoint,
} from '@/types/dashboard';
import Layout from './layout';

function buildAreaPath(series: DashboardSeriesPoint[]): string {
    if (series.length === 0) {
        return '';
    }

    const width = 360;
    const height = 170;
    const maxValue = Math.max(...series.map((point) => point.net), 1);

    return series
        .map((point, index) => {
            const x =
                series.length === 1
                    ? width / 2
                    : (index / (series.length - 1)) * width;
            const y = height - (Math.max(point.net, 0) / maxValue) * height;

            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ');
}

function buildAreaFill(series: DashboardSeriesPoint[]): string {
    if (series.length === 0) {
        return '';
    }

    const width = 360;
    const height = 170;
    const linePath = buildAreaPath(series);

    return `${linePath} L ${width} ${height} L 0 ${height} Z`;
}

function buildDonutGradient(categories: DashboardCategoryBreakdown[]): string {
    if (categories.length === 0) {
        return 'conic-gradient(#24303B 0 100%)';
    }

    let start = 0;

    return `conic-gradient(${categories
        .map((category) => {
            const end = start + Math.max(category.share, 3);
            const segment = `${category.color} ${start}% ${end}%`;

            start = end;

            return segment;
        })
        .join(', ')})`;
}

function getDonutValueClass(value: string): string {
    const visibleLength = value.replace(/\s/g, '').length;

    if (visibleLength >= 14) {
        return 'text-[22px]';
    }

    if (visibleLength >= 12) {
        return 'text-[26px]';
    }

    if (visibleLength >= 10) {
        return 'text-[30px]';
    }

    if (visibleLength >= 8) {
        return 'text-[36px]';
    }

    return 'text-[44px]';
}

function TrendPill({
    direction,
    value,
}: {
    direction: 'up' | 'down' | 'neutral';
    value: number;
}): ReactElement {
    const tone =
        direction === 'up'
            ? 'text-[#A9F15F]'
            : direction === 'down'
              ? 'text-[#FFB6B6]'
              : 'text-[#9AA3AF]';
    const icon =
        direction === 'down' ? (
            <path d="M13 6 7 12l6 6" />
        ) : (
            <path d="m7 14 5-5 5 5" />
        );

    return (
        <div
            className={`flex items-center gap-2 text-[13px] font-medium ${tone}`}
        >
            <span className="inline-flex h-4 w-4 items-center justify-center">
                {direction === 'neutral' ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                ) : (
                    <svg
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        {icon}
                    </svg>
                )}
            </span>
            {value.toFixed(1)}%
        </div>
    );
}

function MetricCard({
    title,
    value,
    trend,
    delay,
}: {
    title: string;
    value: string;
    trend: {
        direction: 'up' | 'down' | 'neutral';
        value: number;
    };
    delay: number;
}): ReactElement {
    return (
        <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay }}
            className="rounded-[24px] border border-[#1B212C] bg-[#171C25] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
        >
            <p className="text-[14px] text-[#C6CDD8]">{title}</p>
            <h3 className="mt-4 text-[28px] font-semibold tracking-[-0.04em] text-white">
                {value}
            </h3>
            <div className="mt-4">
                <TrendPill direction={trend.direction} value={trend.value} />
            </div>
        </motion.section>
    );
}

export default function Dashboard(): ReactElement {
    const {
        summary,
        trends,
        activePeriod,
        periodOptions,
        expenseByCategory,
        topAccounts,
        recentTransactions,
        monthlySeries,
    } = usePage<DashboardPageProps>().props;
    const [isPeriodMenuOpen, setIsPeriodMenuOpen] = useState(false);
    const areaPath = buildAreaPath(monthlySeries);
    const fillPath = buildAreaFill(monthlySeries);
    const donutGradient = buildDonutGradient(expenseByCategory);
    const totalExpenseLabel = formatBrazilianCurrency(summary.totalExpense);
    const activePeriodLabel =
        periodOptions.find((option) => option.key === activePeriod)?.label ??
        '30 dias';

    const visitPeriod = (periodKey: DashboardPeriodOption['key']): void => {
        setIsPeriodMenuOpen(false);
        router.visit(
            home.url({
                query: {
                    period: periodKey,
                },
            }),
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    };

    return (
        <>
            <Head title="Overview" />

            <Layout currentPage="dashboard" title="Overview">
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div>
                            <h1 className="font-mono text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                                Overview
                            </h1>
                            <p className="mt-3 max-w-155 text-[16px] leading-6 text-[#8B93A0]">
                                Panorama financeiro sobre suas contas,
                                categorias e transações.
                            </p>
                        </div>
                        <div className="relative">
                            <AppButton
                                type="button"
                                variant="dark"
                                className="min-w-[148px] px-5 text-[14px]"
                                onClick={() =>
                                    setIsPeriodMenuOpen((current) => !current)
                                }
                            >
                                {activePeriodLabel}
                            </AppButton>
                            <AnimatePresence>
                                {isPeriodMenuOpen ? (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 10,
                                            scale: 0.98,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute top-[calc(100%+12px)] right-0 z-20 w-[200px] rounded-[22px] border border-[#1B212C] bg-[#11161D]/96 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl"
                                    >
                                        {periodOptions.map((option) => (
                                            <button
                                                key={option.key}
                                                type="button"
                                                onClick={() =>
                                                    visitPeriod(option.key)
                                                }
                                                className={[
                                                    'flex w-full items-center justify-between rounded-[16px] px-4 py-3 text-left text-[14px] font-medium transition-colors duration-200',
                                                    option.key === activePeriod
                                                        ? 'bg-[#B5F955] text-[#11150C]'
                                                        : 'text-[#D6DCE5] hover:bg-[#171E27]',
                                                ].join(' ')}
                                            >
                                                <span>{option.label}</span>
                                                {option.key === activePeriod ? (
                                                    <span className="text-[12px] uppercase">
                                                        ativo
                                                    </span>
                                                ) : null}
                                            </button>
                                        ))}
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <section className="grid gap-4 xl:grid-cols-4">
                        <MetricCard
                            title="Saldo atual"
                            value={formatBrazilianCurrency(
                                summary.currentBalance,
                            )}
                            trend={trends.balance}
                            delay={0.04}
                        />
                        <MetricCard
                            title="Total de receitas"
                            value={formatBrazilianCurrency(summary.totalIncome)}
                            trend={trends.income}
                            delay={0.08}
                        />
                        <MetricCard
                            title="Total de despesas"
                            value={formatBrazilianCurrency(
                                summary.totalExpense,
                            )}
                            trend={trends.expense}
                            delay={0.12}
                        />
                        <MetricCard
                            title="Resultado do período"
                            value={formatBrazilianCurrency(summary.netResult)}
                            trend={trends.netResult}
                            delay={0.16}
                        />
                    </section>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_340px]">
                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.18 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#252B35] p-6"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-['Space_Grotesk'] text-[26px] font-medium tracking-[-0.04em] text-white">
                                        Distribuição de Despesas
                                    </h2>
                                    <p className="mt-2 text-[14px] text-[#9CA5B1]">
                                        Categorias que mais pesam neste período.
                                    </p>
                                </div>
                                <div className="rounded-full border border-[#39414D] px-3 py-1 text-[12px] tracking-[0.14em] text-[#B7BEC9] uppercase">
                                    {summary.categoriesCount} categorias
                                </div>
                            </div>

                            <div className="mt-7 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                                <div className="flex items-center justify-center">
                                    <motion.div
                                        initial={{ scale: 0.94, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: 0.24,
                                        }}
                                        className="relative h-[250px] w-[250px] rounded-full p-[28px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]"
                                        style={{ background: donutGradient }}
                                    >
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#252B35]">
                                            <p
                                                className={[
                                                    'max-w-[172px] text-center leading-none font-semibold tracking-[-0.05em] text-white',
                                                    getDonutValueClass(
                                                        totalExpenseLabel,
                                                    ),
                                                ].join(' ')}
                                            >
                                                {totalExpenseLabel}
                                            </p>
                                            <p className="mt-2 text-[18px] text-[#B7BEC9]">
                                                Gasto total
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <div className="grid gap-y-5 pt-2 text-[17px] text-white sm:grid-cols-2">
                                        {expenseByCategory.length === 0 ? (
                                            <p className="text-[15px] text-[#9CA5B1]">
                                                Ainda não existem despesas para
                                                distribuir.
                                            </p>
                                        ) : (
                                            expenseByCategory.map(
                                                (category, index) => (
                                                    <motion.div
                                                        key={category.name}
                                                        initial={{
                                                            opacity: 0,
                                                            x: 14,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            x: 0,
                                                        }}
                                                        transition={{
                                                            duration: 0.24,
                                                            delay:
                                                                0.26 +
                                                                index * 0.05,
                                                        }}
                                                        className="space-y-1"
                                                    >
                                                        <div className="flex items-center gap-3 text-[#D8DEE6]">
                                                            <span
                                                                className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                                                                style={{
                                                                    backgroundColor:
                                                                        category.color,
                                                                }}
                                                            >
                                                                <CategoryIconGlyph
                                                                    icon={
                                                                        category.icon
                                                                    }
                                                                    className="h-3.5 w-3.5"
                                                                />
                                                            </span>
                                                            {category.name}
                                                        </div>
                                                        <p className="pl-10 text-[20px] font-medium text-white">
                                                            {formatBrazilianCurrency(
                                                                category.total,
                                                            )}
                                                        </p>
                                                        <p className="pl-10 text-[13px] text-[#98A2AE]">
                                                            {category.share.toFixed(
                                                                1,
                                                            )}
                                                            % do total
                                                        </p>
                                                    </motion.div>
                                                ),
                                            )
                                        )}
                                    </div>
                                    {expenseByCategory.length > 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.24,
                                                delay: 0.42,
                                            }}
                                            className="mt-6"
                                        >
                                            <AppButton
                                                type="button"
                                                variant="dark"
                                                className="w-full sm:w-auto"
                                                onClick={() =>
                                                    router.visit(
                                                        reportCategories.url(),
                                                    )
                                                }
                                            >
                                                Ver mais categorias
                                            </AppButton>
                                        </motion.div>
                                    ) : null}
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid gap-4">
                            <motion.section
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.28, delay: 0.22 }}
                                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2"
                            >
                                {[
                                    [
                                        'Contas ativas',
                                        String(summary.accountsCount),
                                    ],
                                    [
                                        'Transações',
                                        String(summary.transactionCount),
                                    ],
                                ].map(([label, value], index) => (
                                    <div
                                        key={label}
                                        className="rounded-[22px] border border-[#1B212C] bg-[#232933] p-5"
                                    >
                                        <p className="text-[13px] text-[#9FA6B2]">
                                            {label}
                                        </p>
                                        <p className="mt-2 text-[22px] font-semibold text-white">
                                            {value}
                                        </p>
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{
                                                duration: 0.4,
                                                delay: 0.28 + index * 0.06,
                                            }}
                                            className="mt-4 h-2 origin-left rounded-full bg-[#B5F955]"
                                        />
                                    </div>
                                ))}
                            </motion.section>

                            <motion.section
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.28 }}
                                className="overflow-hidden rounded-[24px] border border-[#1B212C] bg-[#131920] p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[14px] text-[#9FA6B2]">
                                            Tendência líquida
                                        </p>
                                        <p className="mt-1 text-[26px] font-semibold text-white">
                                            {formatBrazilianCurrency(
                                                summary.netResult,
                                            )}
                                        </p>
                                    </div>
                                    <TrendPill
                                        direction={trends.netResult.direction}
                                        value={trends.netResult.value}
                                    />
                                </div>

                                <div className="mt-6">
                                    <svg
                                        viewBox="0 0 360 190"
                                        className="h-[190px] w-full"
                                    >
                                        <defs>
                                            <linearGradient
                                                id="dashboard-fill"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="0%"
                                                    stopColor="#3CE47A"
                                                    stopOpacity="0.58"
                                                />
                                                <stop
                                                    offset="100%"
                                                    stopColor="#3CE47A"
                                                    stopOpacity="0"
                                                />
                                            </linearGradient>
                                        </defs>
                                        <motion.path
                                            d={fillPath}
                                            fill="url(#dashboard-fill)"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                duration: 0.35,
                                                delay: 0.34,
                                            }}
                                        />
                                        <motion.path
                                            d={areaPath}
                                            fill="none"
                                            stroke="#6EF37C"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{
                                                duration: 0.8,
                                                delay: 0.36,
                                            }}
                                        />
                                    </svg>
                                    <div className="mt-2 grid grid-cols-4 gap-2 text-[12px] text-[#7F8794] sm:grid-cols-8">
                                        {monthlySeries.map((point) => (
                                            <span key={point.label}>
                                                {point.label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_380px]">
                        <motion.section
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#0C1016]"
                        >
                            <div className="border-b border-[#171C24] px-6 py-5">
                                <h2 className="font-['Space_Grotesk'] text-[28px] font-medium tracking-[-0.04em] text-white">
                                    Transações Recentes
                                </h2>
                            </div>

                            <div className="divide-y divide-[#171C24]">
                                {recentTransactions.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-[15px] text-[#7F8794]">
                                        Nenhuma transação registrada ainda.
                                    </div>
                                ) : (
                                    recentTransactions.map(
                                        (transaction, index) => (
                                            <motion.article
                                                key={transaction.id}
                                                initial={{ opacity: 0, x: -14 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    duration: 0.24,
                                                    delay: 0.34 + index * 0.05,
                                                }}
                                                className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span
                                                        className="flex h-12 w-12 items-center justify-center rounded-[18px] text-white"
                                                        style={{
                                                            backgroundColor:
                                                                transaction
                                                                    .category
                                                                    .color ??
                                                                '#B5F955',
                                                        }}
                                                    >
                                                        <CategoryIconGlyph
                                                            icon={
                                                                transaction
                                                                    .category
                                                                    .icon ??
                                                                'receipt'
                                                            }
                                                        />
                                                    </span>
                                                    <div>
                                                        <p className="text-[18px] font-medium text-white">
                                                            {
                                                                transaction
                                                                    .category
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="mt-1 text-[14px] text-[#7D848F]">
                                                            {
                                                                transaction
                                                                    .account
                                                                    .name
                                                            }{' '}
                                                            •{' '}
                                                            {
                                                                transaction.transacted_at_label
                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-left sm:text-right">
                                                    <p className="text-[18px] font-medium text-white">
                                                        {formatBrazilianCurrency(
                                                            transaction.amount,
                                                        )}
                                                    </p>
                                                    <p className="mt-1 text-[13px] text-[#98A2AE]">
                                                        {transaction.type_label}
                                                    </p>
                                                </div>
                                            </motion.article>
                                        ),
                                    )
                                )}
                            </div>
                        </motion.section>

                        <motion.section
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.36 }}
                            className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#11161D]"
                        >
                            <div className="border-b border-[#171C24] px-6 py-5">
                                <h2 className="font-mono text-[28px] font-medium tracking-[-0.04em] text-white">
                                    Contas
                                </h2>
                            </div>

                            <div className="space-y-4 px-6 py-6">
                                {topAccounts.map((account, index) => (
                                    <motion.div
                                        key={account.id}
                                        initial={{ opacity: 0, x: 14 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            duration: 0.24,
                                            delay: 0.4 + index * 0.05,
                                        }}
                                        className="rounded-[22px] border border-[#1B212C] bg-[#151B23] p-4"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="h-10 w-10 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            account.color,
                                                    }}
                                                />
                                                <div>
                                                    <p className="text-[16px] font-medium text-white">
                                                        {account.name}
                                                    </p>
                                                    <p className="mt-1 text-[13px] text-[#7D848F]">
                                                        {account.type_label}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[16px] font-medium text-white">
                                                {formatBrazilianCurrency(
                                                    account.current_balance,
                                                )}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </section>
                </div>
            </Layout>
        </>
    );
}
