<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $this->user();
        $period = $this->resolvePeriod(
            $request->string('period')->toString(),
        );
        $currentWindow = $this->periodBounds($period['days']);
        $previousWindow = $this->previousPeriodBounds($currentWindow);

        $currentIncome = $this->transactionTotal('income', $currentWindow);
        $currentExpense = $this->transactionTotal('expense', $currentWindow);
        $previousIncome = $this->transactionTotal('income', $previousWindow);
        $previousExpense = $this->transactionTotal('expense', $previousWindow);

        $cashAccounts = $user->accounts()
            ->where('type', '!=', 'credit_card')
            ->get();
        $creditAccounts = $user->accounts()
            ->where('type', 'credit_card')
            ->get();
        $cashBalance = (float) $cashAccounts->sum('current_balance');
        $availableCredit = (float) $creditAccounts->sum('available_credit');
        $initialCashBalance = (float) $cashAccounts->sum('initial_balance');
        $creditLimit = (float) $creditAccounts->sum('credit_limit');
        $netResult = $currentIncome - $currentExpense;
        $previousNetResult = $previousIncome - $previousExpense;

        $expenseByCategory = $user->categories()
            ->withSum([
                'transactions as expense_total' => fn ($query) => $query
                    ->where('type', 'expense')
                    ->whereBetween('transacted_at', [
                        $currentWindow['start'],
                        $currentWindow['end'],
                    ]),
            ], 'amount')
            ->ordered()
            ->get()
            ->map(fn (Category $category): array => [
                'name' => $category->name,
                'color' => $category->color ?? '#B5F955',
                'icon' => $category->icon ?? 'receipt',
                'total' => (float) ($category->expense_total ?? 0),
            ])
            ->filter(fn (array $category): bool => $category['total'] > 0)
            ->sortByDesc('total')
            ->take(6)
            ->values()
            ->map(fn (array $category): array => [
                ...$category,
                'share' => $currentExpense > 0
                    ? round(($category['total'] / $currentExpense) * 100, 1)
                    : 0,
            ]);

        $recentTransactions = $user->transactions()
            ->with(['account', 'category'])
            ->whereBetween('transacted_at', [
                $currentWindow['start'],
                $currentWindow['end'],
            ])
            ->ordered()
            ->limit(6)
            ->get()
            ->map(fn (Transaction $transaction): array => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'type_label' => Transaction::TYPES[$transaction->type] ?? $transaction->type,
                'amount' => (float) $transaction->amount,
                'transacted_at_label' => $transaction->transacted_at?->format('d/m/Y'),
                'account' => [
                    'name' => $transaction->account?->name,
                    'color' => $transaction->account?->color,
                ],
                'category' => [
                    'name' => $transaction->category?->name,
                    'color' => $transaction->category?->color,
                    'icon' => $transaction->category?->icon,
                ],
            ]);

        $topAccounts = $user->accounts()
            ->ordered()
            ->get()
            ->map(function (Account $account): array {
                $isCreditCard = $account->isCreditCard();

                return [
                    'id' => $account->id,
                    'name' => $account->name,
                    'type' => $account->type,
                    'type_label' => Account::TYPES[$account->type] ?? $account->type,
                    'color' => $account->color,
                    'primary_amount' => $isCreditCard
                        ? (float) ($account->available_credit ?? 0)
                        : (float) $account->current_balance,
                    'primary_label' => $isCreditCard
                        ? 'Limite disponível'
                        : 'Saldo',
                ];
            })
            ->sortByDesc('primary_amount')
            ->take(4)
            ->values();

        return Inertia::render('dashboard', [
            'summary' => [
                'cashBalance' => $cashBalance,
                'availableCredit' => $availableCredit,
                'totalIncome' => $currentIncome,
                'totalExpense' => $currentExpense,
                'netResult' => $netResult,
                'transactionCount' => $user->transactions()
                    ->whereBetween('transacted_at', [
                        $currentWindow['start'],
                        $currentWindow['end'],
                    ])
                    ->count(),
                'cashAccountsCount' => $cashAccounts->count(),
                'creditAccountsCount' => $creditAccounts->count(),
                'categoriesCount' => $expenseByCategory->count(),
            ],
            'trends' => [
                'cashBalance' => $this->trend($cashBalance, $initialCashBalance),
                'availableCredit' => $this->trend($availableCredit, $creditLimit),
                'income' => $this->trend($currentIncome, $previousIncome),
                'expense' => $this->trend($currentExpense, $previousExpense, invert: true),
                'netResult' => $this->trend($netResult, $previousNetResult),
            ],
            'activePeriod' => $period['key'],
            'periodOptions' => $this->periodOptions(),
            'expenseByCategory' => $expenseByCategory,
            'topAccounts' => $topAccounts,
            'recentTransactions' => $recentTransactions,
            'monthlySeries' => $this->seriesForPeriod($period['key']),
        ]);
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
     * @return array{start: CarbonInterface, end: CarbonInterface}
     */
    protected function windowBounds(CarbonInterface $month): array
    {
        return [
            'start' => $month->copy()->startOfMonth(),
            'end' => $month->copy()->endOfMonth(),
        ];
    }

    /**
     * @param  array{start: CarbonInterface, end: CarbonInterface}  $window
     */
    protected function transactionTotal(string $type, array $window): float
    {
        return (float) $this->user()
            ->transactions()
            ->where('type', $type)
            ->whereBetween('transacted_at', [$window['start'], $window['end']])
            ->sum('amount');
    }

    /**
     * @return array{direction: string, value: float}
     */
    protected function trend(
        float $current,
        float $previous,
        bool $invert = false,
    ): array {
        if ($previous === 0.0) {
            return [
                'direction' => $current === 0.0 ? 'neutral' : 'up',
                'value' => $current === 0.0 ? 0.0 : 100.0,
            ];
        }

        $delta = (($current - $previous) / abs($previous)) * 100;

        if ($invert) {
            $delta *= -1;
        }

        return [
            'direction' => $delta > 0 ? 'up' : ($delta < 0 ? 'down' : 'neutral'),
            'value' => round(abs($delta), 1),
        ];
    }

    /**
     * @return Collection<int, array{label: string, net: float, income: float, expense: float}>
     */
    protected function seriesForPeriod(string $periodKey): Collection
    {
        return match ($periodKey) {
            '7d' => collect(range(6, 0))->map(
                fn (int $daysAgo): array => $this->daySeriesPoint(
                    now()->subDays($daysAgo),
                ),
            ),
            '90d' => collect(range(5, 0))->map(
                fn (int $offset): array => $this->rangeSeriesPoint(
                    now()->subDays((5 - $offset) * 15 + 14),
                    now()->subDays((5 - $offset) * 15),
                ),
            ),
            '365d' => collect(range(7, 0))->map(
                fn (int $monthsAgo): array => $this->monthSeriesPoint(
                    now()->subMonthsNoOverflow($monthsAgo),
                ),
            ),
            default => collect(range(5, 0))->map(
                fn (int $offset): array => $this->rangeSeriesPoint(
                    now()->subDays((5 - $offset) * 5 + 4),
                    now()->subDays((5 - $offset) * 5),
                ),
            ),
        };
    }

    /**
     * @return array{label: string, net: float, income: float, expense: float}
     */
    protected function daySeriesPoint(CarbonInterface $date): array
    {
        $window = [
            'start' => $date->copy()->startOfDay(),
            'end' => $date->copy()->endOfDay(),
        ];
        $income = $this->transactionTotal('income', $window);
        $expense = $this->transactionTotal('expense', $window);

        return [
            'label' => mb_substr($date->translatedFormat('D'), 0, 3),
            'net' => $income - $expense,
            'income' => $income,
            'expense' => $expense,
        ];
    }

    /**
     * @return array{label: string, net: float, income: float, expense: float}
     */
    protected function rangeSeriesPoint(
        CarbonInterface $startDate,
        CarbonInterface $endDate,
    ): array {
        $window = [
            'start' => $startDate->copy()->startOfDay(),
            'end' => $endDate->copy()->endOfDay(),
        ];
        $income = $this->transactionTotal('income', $window);
        $expense = $this->transactionTotal('expense', $window);

        return [
            'label' => $startDate->format('d/m'),
            'net' => $income - $expense,
            'income' => $income,
            'expense' => $expense,
        ];
    }

    protected function user(): User
    {
        /** @var User $user */
        $user = auth()->user();

        return $user;
    }

    /**
     * @return array{label: string, net: float, income: float, expense: float}
     */
    protected function monthSeriesPoint(CarbonInterface $date): array
    {
        $window = $this->windowBounds($date);
        $income = $this->transactionTotal('income', $window);
        $expense = $this->transactionTotal('expense', $window);

        return [
            'label' => $date->translatedFormat('M'),
            'net' => $income - $expense,
            'income' => $income,
            'expense' => $expense,
        ];
    }
}
