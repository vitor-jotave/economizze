import { Head } from '@inertiajs/react';
import type { ReactElement } from 'react';
import Layout from './layout';

type MetricCard = {
    title: string;
    value: string;
    trend: string;
    trendLabel: string;
    accent?: 'neutral' | 'green';
};

const metrics: MetricCard[] = [
    {
        title: 'Current balance',
        value: '$3,131,021',
        trend: '0.4%',
        trendLabel: 'vs last month',
    },
    {
        title: 'Total income',
        value: '$1,511,121',
        trend: '32%',
        trendLabel: 'vs last quarter',
    },
    {
        title: 'Savings target',
        value: '71%',
        trend: 'Goal: $1.1M',
        trendLabel: '',
        accent: 'neutral',
    },
    {
        title: 'New transactions',
        value: '18,221',
        trend: '11%',
        trendLabel: 'vs last quarter',
    },
];

const customers = [
    {
        name: 'Danny Liu',
        email: 'danny@gmail.com',
        deals: '1,023',
        total: '$37,431',
        tone: 'from-fuchsia-500 to-rose-400',
    },
    {
        name: 'Bella Deviant',
        email: 'bella@gmail.com',
        deals: '963',
        total: '$30,423',
        tone: 'from-orange-400 to-amber-300',
    },
    {
        name: 'Darrell Steward',
        email: 'darrel@gmail.com',
        deals: '843',
        total: '$28,549',
        tone: 'from-lime-500 to-emerald-400',
    },
];

function MetricCard({
    title,
    value,
    trend,
    trendLabel,
    accent = 'green',
}: MetricCard): ReactElement {
    const isGoal = accent === 'neutral';

    return (
        <section className="rounded-[24px] border border-[#1B212C] bg-[#171C25] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
            <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                    <p className="text-[14px] text-[#C6CDD8]">{title}</p>
                    <h3 className="text-[26px] font-semibold tracking-[-0.03em] text-white">
                        {value}
                    </h3>
                    {isGoal ? (
                        <div className="space-y-1">
                            <p className="text-[13px] font-medium text-[#89919D]">
                                {trend}
                            </p>
                        </div>
                    ) : (
                        <p className="flex items-center gap-2 text-[13px] font-medium text-[#A9F15F]">
                            <span className="inline-flex h-4 w-4 items-center justify-center">
                                <svg
                                    viewBox="0 0 16 16"
                                    className="h-4 w-4"
                                    fill="none"
                                >
                                    <path
                                        d="M3 10.5 6.4 7l2.3 2.3L13 5"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9.8 5H13v3.2"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                            {trend}
                            <span className="text-[#808894]">{trendLabel}</span>
                        </p>
                    )}
                </div>
                {isGoal ? (
                    <div className="relative mt-2 h-24 w-24 shrink-0">
                        <div className="absolute inset-0 rounded-full border-[12px] border-[#2B3139]" />
                        <div className="absolute inset-0 rotate-[18deg] rounded-full border-[12px] border-transparent border-t-[#117A47] border-l-[#1AB96A]" />
                        <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6E757D]" />
                        <div className="absolute top-1/2 left-1/2 h-8 w-[2px] origin-bottom -translate-x-1/2 -translate-y-full rotate-[22deg] rounded-full bg-[#5E646D]" />
                    </div>
                ) : null}
            </div>
        </section>
    );
}

function MiniStat({
    title,
    value,
    meta,
    icon,
}: {
    title: string;
    value: string;
    meta: string;
    icon: ReactElement;
}): ReactElement {
    return (
        <section className="rounded-[22px] border border-[#1B212C] bg-[#232933] p-5">
            <div className="mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#B5F955] text-[#0E120B]">
                {icon}
            </div>
            <p className="text-[13px] text-[#9FA6B2]">{title}</p>
            <p className="mt-1 text-[18px] font-semibold text-white">{value}</p>
            <p className="mt-1 text-[13px] text-[#79808C]">{meta}</p>
        </section>
    );
}

export default function Dashboard(): ReactElement {
    return (
        <>
            <Head title="Overview"></Head>

            <Layout currentPage="dashboard" title="Overview">
                <div className="space-y-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <h1 className="font-['Space_Grotesk'] text-[42px] leading-none font-medium tracking-[-0.05em] text-white">
                            Overview
                        </h1>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 self-start rounded-full border border-[#1B212C] bg-[#11161D] px-4 py-2 text-[14px] text-[#DFE5EC]"
                        >
                            Today
                            <svg
                                viewBox="0 0 20 20"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path d="m5 7 5 5 5-5" />
                            </svg>
                        </button>
                    </div>

                    <section className="grid gap-4 xl:grid-cols-4">
                        {metrics.map((metric) => (
                            <MetricCard key={metric.title} {...metric} />
                        ))}
                    </section>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_340px]">
                        <div className="rounded-[26px] border border-[#1B212C] bg-[#252B35] p-6">
                            <div className="flex items-start justify-between gap-4">
                                <h2 className="font-['Space_Grotesk'] text-[26px] font-medium tracking-[-0.04em] text-white">
                                    Sales Overview
                                </h2>
                                <button
                                    type="button"
                                    className="text-[#949BA6]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                    >
                                        <circle cx="12" cy="5" r="1.8" />
                                        <circle cx="12" cy="12" r="1.8" />
                                        <circle cx="12" cy="19" r="1.8" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-7 grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
                                <div className="flex items-center justify-center">
                                    <div className="relative h-[250px] w-[250px] rounded-full bg-[conic-gradient(#EEF4D8_0_51%,#78D400_51%_74%,#4F8600_74%_88%,#A6F548_88%_100%)] p-[30px] shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-[#252B35]">
                                            <p className="text-[52px] font-semibold tracking-[-0.05em] text-white">
                                                102k
                                            </p>
                                            <p className="mt-1 text-[20px] text-[#B7BEC9]">
                                                Weekly Visits
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center">
                                    <div className="flex items-center gap-4 border-b border-[#39414D] pb-6">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#3D5B29] text-[#A2F04E]">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-7 w-7"
                                                fill="currentColor"
                                            >
                                                <path d="M10.3 3.8 6.2 20.2h3l1-3.9h5.7l1.1 3.9h3L15.7 3.8h-5.4Zm.6 9.8 2.1-7.6h.2l2.1 7.6h-4.4Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[14px] text-[#B8BEC9]">
                                                Number of Sales
                                            </p>
                                            <p className="mt-1 text-[24px] font-semibold text-white">
                                                $71,020
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-y-5 pt-6 text-[17px] text-white sm:grid-cols-2">
                                        {[
                                            [
                                                'Electronic',
                                                '$55,640',
                                                '#EEF4D8',
                                            ],
                                            ['Furniture', '$11,420', '#8AE500'],
                                            ['Clothes', '$1,840', '#A9F15F'],
                                            ['Shoes', '$2,120', '#4F8600'],
                                        ].map(([label, amount, color]) => (
                                            <div
                                                key={label}
                                                className="space-y-1"
                                            >
                                                <div className="flex items-center gap-3 text-[#D8DEE6]">
                                                    <span
                                                        className="h-3 w-3 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                    {label}
                                                </div>
                                                <p className="pl-6 text-[20px] font-medium text-white">
                                                    {amount}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
                                <MiniStat
                                    title="New customers:"
                                    value="862"
                                    meta="Last Week"
                                    icon={
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M8 12h8" />
                                            <path d="M12 8v8" />
                                            <circle cx="12" cy="12" r="9" />
                                        </svg>
                                    }
                                />
                                <MiniStat
                                    title="Total profit:"
                                    value="$25.6k"
                                    meta="Weekly Profit"
                                    icon={
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                            fill="currentColor"
                                        >
                                            <rect
                                                x="4"
                                                y="10"
                                                width="4"
                                                height="8"
                                                rx="2"
                                            />
                                            <rect
                                                x="10"
                                                y="6"
                                                width="4"
                                                height="12"
                                                rx="2"
                                            />
                                            <rect
                                                x="16"
                                                y="3"
                                                width="4"
                                                height="15"
                                                rx="2"
                                            />
                                        </svg>
                                    }
                                />
                            </div>

                            <section className="relative overflow-hidden rounded-[22px] border border-[#1B212C] bg-[#12171E] p-5">
                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(90,255,146,0.02),rgba(90,255,146,0.12))]" />
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />
                                <div className="relative">
                                    <p className="font-['Space_Grotesk'] text-[20px] font-medium text-white">
                                        Total Profit:
                                    </p>
                                    <p className="mt-1 text-[12px] tracking-[0.15em] text-[#7C828B] uppercase">
                                        February, 2024
                                    </p>
                                    <p className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-white">
                                        $136,755.77
                                    </p>
                                </div>
                                <svg
                                    viewBox="0 0 340 160"
                                    className="relative mt-4 h-[165px] w-full"
                                    preserveAspectRatio="none"
                                >
                                    <defs>
                                        <linearGradient
                                            id="profit-fill"
                                            x1="0"
                                            x2="0"
                                            y1="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#1BEA6E"
                                                stopOpacity="0.55"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#1BEA6E"
                                                stopOpacity="0"
                                            />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M0 142 C20 145, 28 138, 42 126 S70 124, 88 134 S114 144, 132 136 S156 86, 178 92 S206 111, 226 100 S246 142, 266 92 S300 34, 320 48 S336 78, 340 74 L340 160 L0 160 Z"
                                        fill="url(#profit-fill)"
                                    />
                                    <path
                                        d="M0 142 C20 145, 28 138, 42 126 S70 124, 88 134 S114 144, 132 136 S156 86, 178 92 S206 111, 226 100 S246 142, 266 92 S300 34, 320 48 S336 78, 340 74"
                                        fill="none"
                                        stroke="#2EF475"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    <circle
                                        cx="42"
                                        cy="126"
                                        r="6"
                                        fill="#E4FFE7"
                                    />
                                    <circle
                                        cx="42"
                                        cy="126"
                                        r="12"
                                        fill="none"
                                        stroke="#6DFFA1"
                                        strokeOpacity="0.4"
                                    />
                                </svg>
                            </section>
                        </div>
                    </section>

                    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_340px]">
                        <div className="overflow-hidden rounded-[26px] border border-[#1B212C] bg-[#090D13]">
                            <div className="flex items-center justify-between border-b border-[#171C24] px-6 py-5">
                                <h2 className="font-['Space_Grotesk'] text-[26px] font-medium tracking-[-0.04em] text-white">
                                    Customer list
                                </h2>
                                <button
                                    type="button"
                                    className="text-[#949BA6]"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-5 w-5"
                                        fill="currentColor"
                                    >
                                        <circle cx="12" cy="5" r="1.8" />
                                        <circle cx="12" cy="12" r="1.8" />
                                        <circle cx="12" cy="19" r="1.8" />
                                    </svg>
                                </button>
                            </div>

                            <div className="grid grid-cols-[minmax(0,1.2fr)_150px_190px] border-b border-[#171C24] px-6 py-4 text-[14px] text-[#BFC6D1]">
                                <div className="flex items-center gap-2">
                                    Name
                                    <svg
                                        viewBox="0 0 16 16"
                                        className="h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="m4 6 4-4 4 4" />
                                        <path d="m4 10 4 4 4-4" />
                                    </svg>
                                </div>
                                <div className="flex items-center gap-2">
                                    Deals
                                    <svg
                                        viewBox="0 0 16 16"
                                        className="h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="m4 6 4-4 4 4" />
                                        <path d="m4 10 4 4 4-4" />
                                    </svg>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    Total Deal Value
                                    <svg
                                        viewBox="0 0 16 16"
                                        className="h-3 w-3"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    >
                                        <path d="m4 6 4-4 4 4" />
                                        <path d="m4 10 4 4 4-4" />
                                    </svg>
                                </div>
                            </div>

                            <div className="divide-y divide-[#171C24]">
                                {customers.map((customer) => (
                                    <div
                                        key={customer.email}
                                        className="grid grid-cols-[minmax(0,1.2fr)_150px_190px] items-center px-6 py-5"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div
                                                className={[
                                                    'h-14 w-14 rounded-full bg-gradient-to-br',
                                                    customer.tone,
                                                ].join(' ')}
                                            />
                                            <div>
                                                <p className="text-[18px] font-medium text-white">
                                                    {customer.name}
                                                </p>
                                                <p className="text-[15px] text-[#7D848F]">
                                                    {customer.email}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-[18px] text-[#E3E7EC]">
                                            {customer.deals}
                                        </p>
                                        <p className="text-right text-[18px] text-[#E3E7EC]">
                                            {customer.total}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <section className="relative overflow-hidden rounded-[26px] border border-[#2C4E1D] bg-[linear-gradient(180deg,#0E2B12_0%,#1D7336_58%,#2F8F38_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                            <div className="absolute inset-0 opacity-40">
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(176,255,136,0.35),transparent_45%)]" />
                                <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.08)_45%,transparent_46%,transparent_56%,rgba(255,255,255,0.08)_57%,transparent_58%)] bg-[size:26px_26px]" />
                            </div>
                            <div className="relative flex h-full flex-col">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.24)] bg-[rgba(255,255,255,0.14)] px-3 py-2 text-[14px] text-white">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#84FF4A] text-[#09300A]">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-3.5 w-3.5"
                                                fill="currentColor"
                                            >
                                                <path d="M11 2 5 13h5l-1 9 10-13h-6l3-7h-5Z" />
                                            </svg>
                                        </span>
                                        Premium Plane
                                    </div>
                                    <button
                                        type="button"
                                        className="text-white/80"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="currentColor"
                                        >
                                            <circle cx="12" cy="5" r="1.8" />
                                            <circle cx="12" cy="12" r="1.8" />
                                            <circle cx="12" cy="19" r="1.8" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-7 flex items-start gap-3">
                                    <span className="font-['Space_Grotesk'] text-[90px] leading-[0.9] font-medium tracking-[-0.08em] text-white">
                                        $30
                                    </span>
                                    <span className="mt-5 text-[21px] leading-[1.15] text-[#D7F6CB]">
                                        Per Month
                                        <br />
                                        Per User
                                    </span>
                                </div>

                                <p className="mt-7 max-w-[280px] text-[20px] leading-[1.35] text-[#E6F5DC]">
                                    Improve your workplace, view and analyze
                                    your profits and losses
                                </p>

                                <div className="mt-auto flex items-center gap-4 pt-8">
                                    <button
                                        type="button"
                                        className="flex-1 rounded-full bg-[#B5F955] px-7 py-4 text-[22px] font-medium text-[#10130B] shadow-[0_12px_24px_rgba(181,249,85,0.25)]"
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        type="button"
                                        className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(181,249,85,0.3)] text-white"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-5 w-5"
                                            fill="currentColor"
                                        >
                                            <path d="m12 3 2.8 5.7L21 9.6l-4.5 4.4 1 6.2L12 17.2l-5.5 3 1-6.2L3 9.6l6.2-.9L12 3Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </section>
                </div>
            </Layout>
        </>
    );
}
