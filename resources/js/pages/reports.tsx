import { Head, router } from '@inertiajs/react';
import { motion } from 'motion/react';
import type { ReactElement } from 'react';
import { formatBrazilianCurrency } from '@/lib/utils';
import { reports as reportsIndex } from '@/routes';
import type { ReportsPageProps } from '@/types/reports';
import Layout from './layout';

export default function Reports({
    activePeriod,
    periodOptions,
    reports,
    summary,
}: ReportsPageProps): ReactElement {
    return (
        <>
            <Head title="Relatórios" />

            <Layout currentPage="reports" title="Relatórios">
                <div className="space-y-6">
                    <motion.section
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden rounded-[30px] border border-[#1B212C] bg-[linear-gradient(135deg,#10161F_0%,#0D1218_52%,#121B11_100%)] p-7"
                    >
                        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
                            <div className="max-w-[760px]">
                                <span className="inline-flex rounded-full border border-[#2E3E22] bg-[rgba(181,249,85,0.12)] px-3 py-1 text-[12px] font-medium tracking-[0.14em] text-[#B5F955] uppercase">
                                    Reports
                                </span>
                                <h1 className="mt-5 font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                                    Análises para enxergar melhor seus hábitos
                                </h1>
                                <p className="mt-4 max-w-[620px] text-[16px] leading-7 text-[#9AA3AF]">
                                    Esta área concentra relatórios que mostram
                                    onde o dinheiro acelera, quais padrões estão
                                    crescendo e onde existe espaço real para
                                    gastar menos sem perder clareza.
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
                                                reportsIndex.url({
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

                    <div className="grid gap-4 lg:grid-cols-3">
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.26, delay: 0.04 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Despesas do período
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-[#F95555]">
                                {formatBrazilianCurrency(summary.expense)}
                            </p>
                            <p className="mt-2 text-[14px] text-[#6E7683]">
                                Categoria líder:{' '}
                                {summary.topCategory?.name ?? 'Sem dados'}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.26, delay: 0.08 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Resultado do período
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
                                Entradas:{' '}
                                {formatBrazilianCurrency(summary.income)}
                            </p>
                        </motion.article>
                        <motion.article
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.26, delay: 0.12 }}
                            className="rounded-[26px] border border-[#1B212C] bg-[#0C1016] p-6"
                        >
                            <p className="text-[13px] tracking-[0.14em] text-[#7F8794] uppercase">
                                Cobertura analítica
                            </p>
                            <p className="mt-4 text-[32px] font-semibold tracking-[-0.05em] text-white">
                                {summary.activeReports}
                            </p>
                            <p className="mt-2 text-[14px] text-[#6E7683]">
                                {summary.comingSoonReports} relatórios em
                                construção
                            </p>
                        </motion.article>
                    </div>

                    <div className="grid gap-4 xl:grid-cols-3">
                        {reports.map((report, index) => {
                            const isReady = report.status === 'ready';

                            return (
                                <motion.article
                                    key={report.slug}
                                    initial={{ opacity: 0, y: 22 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.28,
                                        delay: 0.16 + index * 0.05,
                                    }}
                                    whileHover={{
                                        y: -3,
                                        borderColor: 'rgba(181,249,85,0.28)',
                                    }}
                                    className="group rounded-[28px] border border-[#1B212C] bg-[#0C1016] p-6 transition-colors duration-200"
                                >
                                    <div
                                        className="h-1.5 w-16 rounded-full"
                                        style={{
                                            backgroundColor: report.accentColor,
                                        }}
                                    />
                                    <div className="mt-5 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-[22px] font-medium tracking-[-0.04em] text-white">
                                                {report.title}
                                            </p>
                                            <p className="mt-3 text-[15px] leading-7 text-[#8B93A0]">
                                                {report.description}
                                            </p>
                                        </div>
                                        <span
                                            className={[
                                                'rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.14em] uppercase',
                                                isReady
                                                    ? 'border-[#2E3E22] bg-[rgba(181,249,85,0.1)] text-[#B5F955]'
                                                    : 'border-[#28313C] bg-[#141A22] text-[#98A1AD]',
                                            ].join(' ')}
                                        >
                                            {isReady
                                                ? 'Disponível'
                                                : 'Em breve'}
                                        </span>
                                    </div>

                                    <div className="mt-8 space-y-3">
                                        {report.metrics.map((metric) => (
                                            <div
                                                key={metric.label}
                                                className="flex items-center justify-between rounded-2xl border border-[#171C24] bg-[#10151C] px-4 py-3"
                                            >
                                                <span className="text-[13px] text-[#7F8794]">
                                                    {metric.label}
                                                </span>
                                                <span className="text-[14px] font-medium text-white">
                                                    {metric.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <motion.button
                                        type="button"
                                        whileHover={{ x: isReady ? 2 : 0 }}
                                        whileTap={{ scale: isReady ? 0.99 : 1 }}
                                        disabled={!isReady}
                                        onClick={() => {
                                            if (report.href) {
                                                router.visit(report.href);
                                            }
                                        }}
                                        className={[
                                            'mt-8 flex w-full items-center justify-between rounded-[20px] border px-4 py-3 text-left text-[14px] transition',
                                            isReady
                                                ? 'border-[#263520] bg-[#141D12] text-[#EAF2DB] hover:border-[#B5F955]'
                                                : 'cursor-not-allowed border-[#171C24] bg-[#0F141A] text-[#6B7380]',
                                        ].join(' ')}
                                    >
                                        <span>
                                            {isReady
                                                ? 'Abrir análise'
                                                : 'Aguardando próxima iteração'}
                                        </span>
                                        <span>→</span>
                                    </motion.button>
                                </motion.article>
                            );
                        })}
                    </div>
                </div>
            </Layout>
        </>
    );
}
