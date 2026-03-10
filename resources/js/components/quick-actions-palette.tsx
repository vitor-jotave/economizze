import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'motion/react';
import {
    ArrowRight,
    CreditCard,
    FileBarChart2,
    LayoutDashboard,
    Search,
    Tag,
    Wallet,
} from 'lucide-react';
import type { ReactElement } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { home, reports } from '@/routes';
import { index as accountsIndex } from '@/routes/accounts';
import { index as categoriesIndex } from '@/routes/categories';
import {
    accounts as reportAccounts,
    cashflow as reportCashflow,
    categories as reportCategories,
} from '@/routes/reports';
import { index as transactionsIndex } from '@/routes/transactions';
import type { QuickSearchItem } from '@/types/quick-search';

type QuickActionsPaletteProps = {
    isOpen: boolean;
    onClose: () => void;
    searchItems: QuickSearchItem[];
};

type QuickActionItem = {
    id: string;
    kind: 'action';
    title: string;
    description: string;
    keywords: string[];
    icon: ReactElement;
    onSelect: () => void;
};

type QuickPaletteItem =
    | QuickActionItem
    | (QuickSearchItem & {
          description: string;
          icon: ReactElement;
          onSelect: () => void;
      });

export default function QuickActionsPalette({
    isOpen,
    onClose,
    searchItems,
}: QuickActionsPaletteProps): ReactElement {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const actions = useMemo<QuickActionItem[]>(
        () => [
            {
                id: 'new-account',
                kind: 'action',
                title: 'Nova conta',
                description: 'Abrir o fluxo de criação de conta',
                keywords: ['conta', 'carteira', 'nova conta', 'wallet'],
                icon: <Wallet className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () =>
                    router.visit(
                        accountsIndex.url({
                            query: {
                                composer: 'create',
                            },
                        }),
                    ),
            },
            {
                id: 'new-transaction',
                kind: 'action',
                title: 'Nova transação',
                description: 'Registrar uma entrada ou saída',
                keywords: ['transacao', 'movimento', 'despesa', 'receita'],
                icon: <CreditCard className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () =>
                    router.visit(
                        transactionsIndex.url({
                            query: {
                                composer: 'create',
                            },
                        }),
                    ),
            },
            {
                id: 'new-category',
                kind: 'action',
                title: 'Nova categoria',
                description: 'Criar uma nova categoria financeira',
                keywords: ['categoria', 'tag', 'nova categoria'],
                icon: <Tag className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () =>
                    router.visit(
                        categoriesIndex.url({
                            query: {
                                composer: 'create',
                            },
                        }),
                    ),
            },
            {
                id: 'go-dashboard',
                kind: 'action',
                title: 'Ir para dashboard',
                description: 'Visão geral das finanças',
                keywords: ['dashboard', 'overview', 'inicio', 'resumo'],
                icon: <LayoutDashboard className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(home.url()),
            },
            {
                id: 'go-accounts',
                kind: 'action',
                title: 'Ir para contas',
                description: 'Gerenciar contas e carteiras',
                keywords: ['contas', 'carteiras', 'accounts'],
                icon: <Wallet className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(accountsIndex.url()),
            },
            {
                id: 'go-transactions',
                kind: 'action',
                title: 'Ir para transações',
                description: 'Visualizar e filtrar transações',
                keywords: ['transacoes', 'movimentos', 'transactions'],
                icon: <CreditCard className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(transactionsIndex.url()),
            },
            {
                id: 'go-categories',
                kind: 'action',
                title: 'Ir para categorias',
                description: 'Organizar receitas e despesas',
                keywords: ['categorias', 'category', 'tags'],
                icon: <Tag className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(categoriesIndex.url()),
            },
            {
                id: 'go-reports',
                kind: 'action',
                title: 'Hub de relatórios',
                description: 'Abrir a área de análises',
                keywords: ['reports', 'relatorio', 'despesas', 'analises'],
                icon: <FileBarChart2 className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(reports.url()),
            },
            {
                id: 'go-report-categories',
                kind: 'action',
                title: 'Gastos por categoria',
                description: 'Abrir a análise detalhada por categoria',
                keywords: [
                    'reports',
                    'categorias',
                    'gastos',
                    'despesas por categoria',
                ],
                icon: <FileBarChart2 className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(reportCategories.url()),
            },
            {
                id: 'go-report-accounts',
                kind: 'action',
                title: 'Saúde das contas',
                description: 'Abrir a análise estrutural das suas contas',
                keywords: [
                    'reports',
                    'contas',
                    'saude das contas',
                    'saldo',
                    'cash structure',
                ],
                icon: <FileBarChart2 className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(reportAccounts.url()),
            },
            {
                id: 'go-report-cashflow',
                kind: 'action',
                title: 'Fluxo por período',
                description: 'Abrir a análise temporal de entradas e saídas',
                keywords: [
                    'reports',
                    'cashflow',
                    'fluxo',
                    'periodo',
                    'entradas e saidas',
                ],
                icon: <FileBarChart2 className="h-4 w-4" strokeWidth={1.9} />,
                onSelect: () => router.visit(reportCashflow.url()),
            },
        ],
        [],
    );

    const filteredItems = useMemo<QuickPaletteItem[]>(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (normalizedQuery.length === 0) {
            return actions;
        }

        const actionResults = actions.filter((action) =>
            [action.title, action.description, ...action.keywords]
                .join(' ')
                .toLowerCase()
                .includes(normalizedQuery),
        );

        const searchResults = searchItems
            .filter((item) =>
                [item.title, item.subtitle, ...item.keywords]
                    .join(' ')
                    .toLowerCase()
                    .includes(normalizedQuery),
            )
            .slice(0, 18)
            .map((item) => ({
                ...item,
                description: item.subtitle,
                icon:
                    item.kind === 'account' ? (
                        <Wallet className="h-4 w-4" strokeWidth={1.9} />
                    ) : item.kind === 'category' ? (
                        <Tag className="h-4 w-4" strokeWidth={1.9} />
                    ) : (
                        <CreditCard className="h-4 w-4" strokeWidth={1.9} />
                    ),
                onSelect: () => router.visit(item.target),
            }));

        return [...actionResults, ...searchResults];
    }, [actions, query, searchItems]);

    useEffect(() => {
        if (!isOpen) {
            setQuery('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    useEffect(() => {
        if (activeIndex <= filteredItems.length - 1) {
            return;
        }

        setActiveIndex(0);
    }, [activeIndex, filteredItems.length]);

    function runAction(index: number): void {
        const selectedAction = filteredItems[index];

        if (!selectedAction) {
            return;
        }

        onClose();
        selectedAction.onSelect();
    }

    return (
        <AnimatePresence>
            {isOpen ? (
                <>
                    <motion.button
                        type="button"
                        aria-label="Fechar quick actions"
                        className="fixed inset-0 z-40 bg-[rgba(3,6,10,0.72)] backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        onClick={onClose}
                    />

                    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:px-6">
                        <motion.section
                            initial={{ opacity: 0, y: 18, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 14, scale: 0.98 }}
                            transition={{
                                type: 'spring',
                                stiffness: 220,
                                damping: 24,
                            }}
                            className="w-full max-w-[760px] overflow-hidden rounded-[30px] border border-[#1B212C] bg-[#0E131A] shadow-[0_40px_120px_rgba(0,0,0,0.48)]"
                            onKeyDown={(event) => {
                                if (filteredItems.length === 0) {
                                    return;
                                }

                                if (event.key === 'ArrowDown') {
                                    event.preventDefault();
                                    setActiveIndex((current) =>
                                        current === filteredItems.length - 1
                                            ? 0
                                            : current + 1,
                                    );
                                }

                                if (event.key === 'ArrowUp') {
                                    event.preventDefault();
                                    setActiveIndex((current) =>
                                        current === 0
                                            ? filteredItems.length - 1
                                            : current - 1,
                                    );
                                }

                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    runAction(activeIndex);
                                }
                            }}
                        >
                            <div className="border-b border-[#171C24] px-5 py-4 sm:px-6">
                                <div className="relative">
                                    <Search
                                        className="absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-[#727986]"
                                        strokeWidth={1.9}
                                    />
                                    <input
                                        autoFocus
                                        value={query}
                                        onChange={(event) =>
                                            setQuery(event.target.value)
                                        }
                                        placeholder="Pesquisar ações rápidas..."
                                        className="h-12 w-full bg-transparent pr-18 pl-8 text-[18px] text-white outline-none placeholder:text-[#727986]"
                                    />
                                    <span className="absolute top-1/2 right-0 -translate-y-1/2 rounded-full border border-[#232832] px-2.5 py-1 text-[12px] font-medium text-[#A4ABB7]">
                                        ESC
                                    </span>
                                </div>
                            </div>

                            <div className="max-h-[420px] overflow-y-auto px-3 py-3">
                                {filteredItems.length === 0 ? (
                                    <div className="px-4 py-14 text-center text-[15px] text-[#7F8794]">
                                        Nenhuma ação encontrada para essa
                                        pesquisa.
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredItems.map((action, index) => (
                                            <motion.button
                                                key={action.id}
                                                type="button"
                                                initial={{
                                                    opacity: 0,
                                                    y: 10,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                }}
                                                transition={{
                                                    duration: 0.18,
                                                    delay: index * 0.03,
                                                }}
                                                whileHover={{ x: 2 }}
                                                onMouseEnter={() =>
                                                    setActiveIndex(index)
                                                }
                                                onClick={() => runAction(index)}
                                                className={[
                                                    'flex w-full items-center justify-between rounded-[22px] px-4 py-4 text-left transition-colors duration-200',
                                                    activeIndex === index
                                                        ? 'bg-[#141B24]'
                                                        : 'hover:bg-[#141B24]',
                                                ].join(' ')}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span
                                                        className={[
                                                            'flex h-11 w-11 items-center justify-center rounded-[16px] border text-[#D8DEE6]',
                                                            activeIndex ===
                                                            index
                                                                ? 'border-[#B5F955]/35 bg-[#18210F]'
                                                                : 'border-[#212835] bg-[#141A22]',
                                                        ].join(' ')}
                                                    >
                                                        {action.icon}
                                                    </span>
                                                    <div>
                                                        <p className="text-[16px] font-medium text-white">
                                                            {action.title}
                                                        </p>
                                                        <p className="mt-1 text-[13px] text-[#727986]">
                                                            {action.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <ArrowRight
                                                    className="h-4 w-4 text-[#67707C]"
                                                    strokeWidth={1.9}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#171C24] px-5 py-3 text-[12px] text-[#67707C] sm:px-6">
                                Use{' '}
                                <span className="text-[#D8DEE6]">
                                    Cmd/Ctrl + K
                                </span>{' '}
                                para abrir e{' '}
                                <span className="text-[#D8DEE6]">Esc</span> para
                                fechar.
                            </div>
                        </motion.section>
                    </div>
                </>
            ) : null}
        </AnimatePresence>
    );
}
