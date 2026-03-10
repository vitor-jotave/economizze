<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class ReportsController extends Controller
{
    public function index(Request $request): Response
    {
        $period = $this->resolvePeriod(
            $request->string('period')->toString(),
        );
        $currentWindow = $this->periodBounds($period['days']);
        $previousWindow = $this->previousPeriodBounds($currentWindow);
        $totalIncome = $this->transactionTotal('income', $currentWindow);
        $totalExpense = $this->transactionTotal('expense', $currentWindow);
        $categoryBreakdown = $this->categoryBreakdown(
            $currentWindow,
            $previousWindow,
        );
        $topCategory = $categoryBreakdown->first();

        return Inertia::render('reports', [
            'activePeriod' => $period['key'],
            'periodOptions' => $this->periodOptions(),
            'summary' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'net' => $totalIncome - $totalExpense,
                'topCategory' => $topCategory,
                'activeReports' => 3,
                'comingSoonReports' => 0,
            ],
            'reports' => [
                [
                    'slug' => 'categories',
                    'title' => 'Gastos por categoria',
                    'description' => 'Veja onde o dinheiro sai com mais intensidade, quais categorias aceleraram e onde existe margem real para economizar.',
                    'status' => 'ready',
                    'href' => route('reports.categories'),
                    'accentColor' => '#B5F955',
                    'metrics' => [
                        [
                            'label' => 'Categorias ativas',
                            'value' => $categoryBreakdown->count(),
                        ],
                        [
                            'label' => 'Maior peso',
                            'value' => $topCategory['name'] ?? 'Sem dados',
                        ],
                    ],
                ],
                [
                    'slug' => 'cashflow',
                    'title' => 'Fluxo por período',
                    'description' => 'Entenda a evolução de entradas versus saídas ao longo do tempo e detecte meses fora do padrão.',
                    'status' => 'ready',
                    'href' => route('reports.cashflow'),
                    'accentColor' => '#5BE2B0',
                    'metrics' => [
                        [
                            'label' => 'Faixas',
                            'value' => $this->cashflowSeries($period['key'])->count(),
                        ],
                        [
                            'label' => 'Resultado',
                            'value' => $totalIncome - $totalExpense >= 0
                                ? 'Superávit'
                                : 'Déficit',
                        ],
                    ],
                ],
                [
                    'slug' => 'accounts',
                    'title' => 'Saúde das contas',
                    'description' => 'Compare quais contas concentram saldo, giro e pressão de gastos para redistribuir melhor seu dinheiro.',
                    'status' => 'ready',
                    'href' => route('reports.accounts'),
                    'accentColor' => '#7C8CFF',
                    'metrics' => [
                        [
                            'label' => 'Contas ativas',
                            'value' => Account::query()->where('is_active', true)->count(),
                        ],
                        [
                            'label' => 'Maior saldo',
                            'value' => Account::query()
                                ->orderByDesc('current_balance')
                                ->value('name') ?? 'Sem dados',
                        ],
                    ],
                ],
            ],
        ]);
    }

    public function cashflow(Request $request): Response
    {
        $period = $this->resolvePeriod(
            $request->string('period')->toString(),
        );
        $currentWindow = $this->periodBounds($period['days']);
        $series = $this->cashflowSeries($period['key']);
        $totalIncome = $this->transactionTotal('income', $currentWindow);
        $totalExpense = $this->transactionTotal('expense', $currentWindow);
        $net = $totalIncome - $totalExpense;
        $positiveIntervals = $series->filter(
            fn (array $point): bool => $point['net'] > 0,
        )->count();
        $negativeIntervals = $series->filter(
            fn (array $point): bool => $point['net'] < 0,
        )->count();
        $bestInterval = $series->sortByDesc('net')->first();
        $worstInterval = $series->sortBy('net')->first();

        return Inertia::render('reports/cashflow', [
            'activePeriod' => $period['key'],
            'periodOptions' => $this->periodOptions(),
            'summary' => [
                'income' => $totalIncome,
                'expense' => $totalExpense,
                'net' => $net,
                'averageNet' => $series->count() > 0
                    ? round($series->avg('net'), 2)
                    : 0,
                'positiveIntervals' => $positiveIntervals,
                'negativeIntervals' => $negativeIntervals,
                'bestInterval' => $bestInterval,
                'worstInterval' => $worstInterval,
            ],
            'series' => $series->values()->all(),
            'insights' => $this->cashflowInsights($series, $period['label']),
        ]);
    }

    public function categories(Request $request): Response
    {
        $period = $this->resolvePeriod(
            $request->string('period')->toString(),
        );
        $currentWindow = $this->periodBounds($period['days']);
        $previousWindow = $this->previousPeriodBounds($currentWindow);
        $categoryBreakdown = $this->categoryBreakdown(
            $currentWindow,
            $previousWindow,
        );
        $totalExpense = $categoryBreakdown->sum('total');
        $topCategory = $categoryBreakdown->first();
        $transactionsCount = $categoryBreakdown->sum('transactions_count');

        return Inertia::render('reports/categories', [
            'activePeriod' => $period['key'],
            'periodOptions' => $this->periodOptions(),
            'summary' => [
                'totalExpense' => $totalExpense,
                'averageTransaction' => $transactionsCount > 0
                    ? round($totalExpense / $transactionsCount, 2)
                    : 0,
                'categoriesCount' => $categoryBreakdown->count(),
                'transactionsCount' => $transactionsCount,
                'topCategory' => $topCategory,
            ],
            'categories' => $categoryBreakdown->values()->all(),
            'insights' => $this->categoryInsights(
                $categoryBreakdown,
                $period['label'],
            ),
        ]);
    }

    public function accounts(Request $request): Response
    {
        $period = $this->resolvePeriod(
            $request->string('period')->toString(),
        );
        $currentWindow = $this->periodBounds($period['days']);
        $accounts = $this->accountHealthBreakdown($currentWindow);
        $totalBalance = $accounts->sum('current_balance');
        $topBalanceAccount = $accounts->sortByDesc('current_balance')->first();
        $worstNetAccount = $accounts->sortBy('net')->first();

        return Inertia::render('reports/accounts', [
            'activePeriod' => $period['key'],
            'periodOptions' => $this->periodOptions(),
            'summary' => [
                'totalBalance' => $totalBalance,
                'accountsCount' => $accounts->count(),
                'positiveAccounts' => $accounts->filter(
                    fn (array $account): bool => $account['net'] > 0,
                )->count(),
                'negativeAccounts' => $accounts->filter(
                    fn (array $account): bool => $account['net'] < 0,
                )->count(),
                'topBalanceAccount' => $topBalanceAccount,
                'worstNetAccount' => $worstNetAccount,
            ],
            'accounts' => $accounts->values()->all(),
            'insights' => $this->accountHealthInsights(
                $accounts,
                $period['label'],
            ),
        ]);
    }

    /**
     * @param  array{start: CarbonInterface, end: CarbonInterface}  $currentWindow
     * @param  array{start: CarbonInterface, end: CarbonInterface}  $previousWindow
     * @return Collection<int, array{
     *     id: int,
     *     name: string,
     *     color: string,
     *     icon: string,
     *     total: float,
     *     previous_total: float,
     *     share: float,
     *     transactions_count: int,
     *     average_transaction: float,
     *     trend: array{direction: string, value: float},
     *     last_transaction_at_label: string|null
     * }>
     */
    protected function categoryBreakdown(
        array $currentWindow,
        array $previousWindow,
    ): Collection {
        $categories = Category::query()
            ->withSum([
                'transactions as current_total' => fn ($query) => $query
                    ->where('type', 'expense')
                    ->whereBetween('transacted_at', [
                        $currentWindow['start'],
                        $currentWindow['end'],
                    ]),
            ], 'amount')
            ->withSum([
                'transactions as previous_total' => fn ($query) => $query
                    ->where('type', 'expense')
                    ->whereBetween('transacted_at', [
                        $previousWindow['start'],
                        $previousWindow['end'],
                    ]),
            ], 'amount')
            ->withCount([
                'transactions as current_transactions_count' => fn ($query) => $query
                    ->where('type', 'expense')
                    ->whereBetween('transacted_at', [
                        $currentWindow['start'],
                        $currentWindow['end'],
                    ]),
            ])
            ->withMax([
                'transactions as last_transaction_at' => fn ($query) => $query
                    ->where('type', 'expense')
                    ->whereBetween('transacted_at', [
                        $currentWindow['start'],
                        $currentWindow['end'],
                    ]),
            ], 'transacted_at')
            ->ordered()
            ->get();

        $totalExpense = (float) $categories->sum(
            fn (Category $category) => (float) ($category->current_total ?? 0),
        );

        return $categories
            ->map(function (Category $category) use ($totalExpense): array {
                $currentTotal = (float) ($category->current_total ?? 0);
                $previousTotal = (float) ($category->previous_total ?? 0);
                $transactionsCount = (int) ($category->current_transactions_count ?? 0);

                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'color' => $category->color ?? '#B5F955',
                    'icon' => $category->icon ?? 'receipt',
                    'total' => $currentTotal,
                    'previous_total' => $previousTotal,
                    'share' => $totalExpense > 0
                        ? round(($currentTotal / $totalExpense) * 100, 1)
                        : 0,
                    'transactions_count' => $transactionsCount,
                    'average_transaction' => $transactionsCount > 0
                        ? round($currentTotal / $transactionsCount, 2)
                        : 0,
                    'trend' => $this->trend($currentTotal, $previousTotal),
                    'last_transaction_at_label' => $category->last_transaction_at
                        ? Carbon::parse($category->last_transaction_at)->format('d/m/Y')
                        : null,
                ];
            })
            ->filter(fn (array $category): bool => $category['total'] > 0)
            ->sortByDesc('total')
            ->values();
    }

    /**
     * @param  array{start: CarbonInterface, end: CarbonInterface}  $window
     * @return Collection<int, array{
     *     id: int,
     *     name: string,
     *     type_label: string,
     *     color: string,
     *     current_balance: float,
     *     initial_balance: float,
     *     income: float,
     *     expense: float,
     *     net: float,
     *     share_of_balance: float,
     *     transactions_count: int
     * }>
     */
    protected function accountHealthBreakdown(array $window): Collection
    {
        $accounts = Account::query()
            ->withSum([
                'transactions as income_total' => fn ($query) => $query
                    ->where('type', 'income')
                    ->whereBetween('transacted_at', [
                        $window['start'],
                        $window['end'],
                    ]),
            ], 'amount')
            ->withSum([
                'transactions as expense_total' => fn ($query) => $query
                    ->where('type', 'expense')
                    ->whereBetween('transacted_at', [
                        $window['start'],
                        $window['end'],
                    ]),
            ], 'amount')
            ->withCount([
                'transactions as current_transactions_count' => fn ($query) => $query
                    ->whereBetween('transacted_at', [
                        $window['start'],
                        $window['end'],
                    ]),
            ])
            ->ordered()
            ->get();

        $totalBalance = (float) $accounts->sum('current_balance');

        return $accounts
            ->map(function (Account $account) use ($totalBalance): array {
                $income = (float) ($account->income_total ?? 0);
                $expense = (float) ($account->expense_total ?? 0);

                return [
                    'id' => $account->id,
                    'name' => $account->name,
                    'type_label' => Account::TYPES[$account->type] ?? $account->type,
                    'color' => $account->color ?? '#B5F955',
                    'current_balance' => (float) $account->current_balance,
                    'initial_balance' => (float) $account->initial_balance,
                    'income' => $income,
                    'expense' => $expense,
                    'net' => $income - $expense,
                    'share_of_balance' => $totalBalance > 0
                        ? round(((float) $account->current_balance / $totalBalance) * 100, 1)
                        : 0,
                    'transactions_count' => (int) ($account->current_transactions_count ?? 0),
                ];
            })
            ->sortByDesc('current_balance')
            ->values();
    }

    /**
     * @param  Collection<int, array{
     *     id: int,
     *     name: string,
     *     color: string,
     *     icon: string,
     *     total: float,
     *     previous_total: float,
     *     share: float,
     *     transactions_count: int,
     *     average_transaction: float,
     *     trend: array{direction: string, value: float},
     *     last_transaction_at_label: string|null
     * }>  $categories
     * @return list<array{id: string, title: string, description: string, tone: string}>
     */
    protected function categoryInsights(
        Collection $categories,
        string $periodLabel,
    ): array {
        $insights = [];
        $topCategory = $categories->first();

        if ($topCategory && $topCategory['share'] >= 30) {
            $potentialSavings = round($topCategory['total'] * 0.1, 2);

            $insights[] = [
                'id' => 'top-category-pressure',
                'title' => "{$topCategory['name']} está puxando seus gastos",
                'description' => "Essa categoria representa {$topCategory['share']}% da sua despesa em {$periodLabel}. Reduzir 10% aqui liberaria aproximadamente R$ {$potentialSavings}.",
                'tone' => 'warning',
            ];
        }

        $risingCategory = $categories->first(
            fn (array $category): bool => $category['trend']['direction'] === 'up'
                && $category['trend']['value'] >= 15
                && $category['total'] >= 100,
        );

        if ($risingCategory) {
            $insights[] = [
                'id' => 'rising-category',
                'title' => "{$risingCategory['name']} acelerou neste período",
                'description' => "O gasto subiu {$risingCategory['trend']['value']}% em relação ao período anterior. Vale revisar o que mudou antes que esse padrão se consolide.",
                'tone' => 'critical',
            ];
        }

        $frequentCategory = $categories
            ->sortByDesc('transactions_count')
            ->first(
                fn (array $category): bool => $category['transactions_count'] >= 4
                    && $category['average_transaction'] <= 120,
            );

        if ($frequentCategory) {
            $insights[] = [
                'id' => 'frequent-category',
                'title' => "{$frequentCategory['name']} tem recorrência alta",
                'description' => "Foram {$frequentCategory['transactions_count']} lançamentos no período. Mesmo tickets menores somam rápido quando a recorrência escapa do controle.",
                'tone' => 'neutral',
            ];
        }

        if ($insights === []) {
            $insights[] = [
                'id' => 'steady-profile',
                'title' => 'Perfil de gastos estável',
                'description' => "Seu mix de categorias está relativamente equilibrado em {$periodLabel}. Agora o melhor ganho vem de micro ajustes nas duas categorias mais pesadas.",
                'tone' => 'positive',
            ];
        }

        return array_slice($insights, 0, 3);
    }

    /**
     * @return Collection<int, array{
     *     label: string,
     *     income: float,
     *     expense: float,
     *     net: float
     * }>
     */
    protected function cashflowSeries(string $periodKey): Collection
    {
        return match ($periodKey) {
            '7d' => collect(range(6, 0))->map(
                fn (int $daysAgo): array => $this->seriesPointForWindow(
                    now()->subDays($daysAgo)->startOfDay(),
                    now()->subDays($daysAgo)->endOfDay(),
                    now()->subDays($daysAgo)->format('d/m'),
                ),
            ),
            '90d' => collect(range(5, 0))->map(
                fn (int $offset): array => $this->seriesPointForWindow(
                    now()->subDays((5 - $offset) * 15 + 14)->startOfDay(),
                    now()->subDays((5 - $offset) * 15)->endOfDay(),
                    now()->subDays((5 - $offset) * 15)->format('d/m'),
                    now()->subDays((5 - $offset) * 15 + 14)->format('d/m'),
                ),
            ),
            '365d' => collect(range(5, 0))->map(
                fn (int $monthsAgo): array => $this->seriesPointForMonth(
                    now()->subMonthsNoOverflow($monthsAgo),
                ),
            ),
            default => collect(range(5, 0))->map(
                fn (int $offset): array => $this->seriesPointForWindow(
                    now()->subDays((5 - $offset) * 5 + 4)->startOfDay(),
                    now()->subDays((5 - $offset) * 5)->endOfDay(),
                    now()->subDays((5 - $offset) * 5)->format('d/m'),
                    now()->subDays((5 - $offset) * 5 + 4)->format('d/m'),
                ),
            ),
        };
    }

    /**
     * @return array{label: string, income: float, expense: float, net: float}
     */
    protected function seriesPointForWindow(
        CarbonInterface $start,
        CarbonInterface $end,
        string $endLabel,
        ?string $startLabel = null,
    ): array {
        $income = (float) Transaction::query()
            ->where('type', 'income')
            ->whereBetween('transacted_at', [$start, $end])
            ->sum('amount');
        $expense = (float) Transaction::query()
            ->where('type', 'expense')
            ->whereBetween('transacted_at', [$start, $end])
            ->sum('amount');

        return [
            'label' => $startLabel ? "{$startLabel} - {$endLabel}" : $endLabel,
            'income' => $income,
            'expense' => $expense,
            'net' => $income - $expense,
        ];
    }

    /**
     * @return array{label: string, income: float, expense: float, net: float}
     */
    protected function seriesPointForMonth(CarbonInterface $month): array
    {
        $start = $month->copy()->startOfMonth();
        $end = $month->copy()->endOfMonth();

        return $this->seriesPointForWindow(
            $start,
            $end,
            $month->translatedFormat('M/y'),
        );
    }

    /**
     * @param  Collection<int, array{
     *     label: string,
     *     income: float,
     *     expense: float,
     *     net: float
     * }>  $series
     * @return list<array{id: string, title: string, description: string, tone: string}>
     */
    protected function cashflowInsights(
        Collection $series,
        string $periodLabel,
    ): array {
        $insights = [];
        $negativeIntervals = $series->filter(
            fn (array $point): bool => $point['net'] < 0,
        );
        $worstInterval = $series->sortBy('net')->first();
        $bestInterval = $series->sortByDesc('net')->first();

        if ($negativeIntervals->count() >= 2) {
            $insights[] = [
                'id' => 'repeated-deficit',
                'title' => 'O caixa entrou em pressão em mais de uma faixa',
                'description' => "Em {$negativeIntervals->count()} faixas de {$periodLabel}, as saídas superaram as entradas. Vale investigar o que se repetiu nesses momentos.",
                'tone' => 'critical',
            ];
        }

        if ($worstInterval && $worstInterval['net'] < 0) {
            $insights[] = [
                'id' => 'worst-interval',
                'title' => "A pior faixa foi {$worstInterval['label']}",
                'description' => "Nesse recorte o resultado ficou em {$worstInterval['net']}, com pressão maior de despesas do que de entradas. Esse é o melhor ponto para revisar cortes imediatos.",
                'tone' => 'warning',
            ];
        }

        if ($bestInterval && $bestInterval['net'] > 0) {
            $insights[] = [
                'id' => 'best-interval',
                'title' => "{$bestInterval['label']} puxou o melhor respiro",
                'description' => 'Esse intervalo terminou positivo e pode indicar janelas boas para concentrar aportes, reservas ou pagamentos mais pesados.',
                'tone' => 'positive',
            ];
        }

        if ($insights === []) {
            $insights[] = [
                'id' => 'balanced-cashflow',
                'title' => 'Fluxo relativamente equilibrado',
                'description' => "Seu fluxo em {$periodLabel} não mostrou distorções relevantes entre entradas e saídas. O ganho agora vem de estabilizar a recorrência e reduzir picos pontuais.",
                'tone' => 'neutral',
            ];
        }

        return array_slice($insights, 0, 3);
    }

    /**
     * @param  Collection<int, array{
     *     id: int,
     *     name: string,
     *     type_label: string,
     *     color: string,
     *     current_balance: float,
     *     initial_balance: float,
     *     income: float,
     *     expense: float,
     *     net: float,
     *     share_of_balance: float,
     *     transactions_count: int
     * }>  $accounts
     * @return list<array{id: string, title: string, description: string, tone: string}>
     */
    protected function accountHealthInsights(
        Collection $accounts,
        string $periodLabel,
    ): array {
        $insights = [];
        $topBalanceAccount = $accounts->sortByDesc('current_balance')->first();
        $worstNetAccount = $accounts->sortBy('net')->first();
        $idleAccount = $accounts->first(
            fn (array $account): bool => $account['transactions_count'] === 0
                && $account['current_balance'] > 0,
        );

        if ($topBalanceAccount && $topBalanceAccount['share_of_balance'] >= 55) {
            $insights[] = [
                'id' => 'balance-concentration',
                'title' => "{$topBalanceAccount['name']} concentra grande parte do caixa",
                'description' => "Essa conta carrega {$topBalanceAccount['share_of_balance']}% do saldo total. Se isso não for intencional, vale distribuir melhor o risco e a liquidez.",
                'tone' => 'warning',
            ];
        }

        if ($worstNetAccount && $worstNetAccount['net'] < 0) {
            $insights[] = [
                'id' => 'negative-net-account',
                'title' => "{$worstNetAccount['name']} drenou caixa em {$periodLabel}",
                'description' => "O saldo operacional da conta ficou em {$worstNetAccount['net']} no período. Rever as saídas aqui pode aliviar a pressão sem mexer no resto da estrutura.",
                'tone' => 'critical',
            ];
        }

        if ($idleAccount) {
            $insights[] = [
                'id' => 'idle-balance-account',
                'title' => "{$idleAccount['name']} está com saldo parado",
                'description' => "A conta não recebeu movimentações em {$periodLabel}, mas ainda concentra caixa. Talvez faça sentido reavaliar se esse saldo deveria estar em outro lugar.",
                'tone' => 'neutral',
            ];
        }

        if ($insights === []) {
            $insights[] = [
                'id' => 'balanced-account-structure',
                'title' => 'Estrutura das contas está saudável',
                'description' => 'Seu caixa está relativamente distribuído e sem uma conta claramente drenando o período. O próximo ganho vem de otimizar concentração e recorrência.',
                'tone' => 'positive',
            ];
        }

        return array_slice($insights, 0, 3);
    }

    /**
     * @return array{direction: string, value: float}
     */
    protected function trend(float $current, float $previous): array
    {
        if ($previous === 0.0) {
            return [
                'direction' => $current === 0.0 ? 'neutral' : 'up',
                'value' => $current === 0.0 ? 0.0 : 100.0,
            ];
        }

        $delta = (($current - $previous) / abs($previous)) * 100;

        return [
            'direction' => $delta > 0 ? 'up' : ($delta < 0 ? 'down' : 'neutral'),
            'value' => round(abs($delta), 1),
        ];
    }

    /**
     * @return list<array{key: string, label: string, days: int}>
     */
    protected function periodOptions(): array
    {
        return [
            ['key' => '7d', 'label' => '7 dias', 'days' => 7],
            ['key' => '30d', 'label' => '30 dias', 'days' => 30],
            ['key' => '90d', 'label' => '90 dias', 'days' => 90],
            ['key' => '365d', 'label' => '12 meses', 'days' => 365],
        ];
    }

    /**
     * @return array{key: string, label: string, days: int}
     */
    protected function resolvePeriod(?string $periodKey): array
    {
        return collect($this->periodOptions())
            ->firstWhere('key', $periodKey) ?? $this->periodOptions()[1];
    }

    /**
     * @return array{start: CarbonInterface, end: CarbonInterface}
     */
    protected function periodBounds(int $days): array
    {
        return [
            'start' => now()->subDays($days - 1)->startOfDay(),
            'end' => now()->endOfDay(),
        ];
    }

    /**
     * @param  array{start: CarbonInterface, end: CarbonInterface}  $window
     * @return array{start: CarbonInterface, end: CarbonInterface}
     */
    protected function previousPeriodBounds(array $window): array
    {
        $days = $window['start']->diffInDays($window['end']) + 1;

        return [
            'start' => $window['start']->copy()->subDays($days),
            'end' => $window['start']->copy()->subDay()->endOfDay(),
        ];
    }

    /**
     * @param  array{start: CarbonInterface, end: CarbonInterface}  $window
     */
    protected function transactionTotal(string $type, array $window): float
    {
        return (float) Transaction::query()
            ->where('type', $type)
            ->whereBetween('transacted_at', [$window['start'], $window['end']])
            ->sum('amount');
    }
}
