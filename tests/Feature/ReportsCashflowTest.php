<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

it('renders the cashflow report with temporal series and insights', function () {
    $account = Account::factory()->create();
    $incomeCategory = Category::factory()->create([
        'name' => 'Salário',
        'type' => 'income',
    ]);
    $expenseCategory = Category::factory()->create([
        'name' => 'Comida',
        'type' => 'expense',
    ]);

    Transaction::factory()->create([
        'type' => 'income',
        'amount' => 3000,
        'transacted_at' => now()->subDays(1)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $incomeCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 450,
        'transacted_at' => now()->subDays(1)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $expenseCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 1800,
        'transacted_at' => now()->subDays(7)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $expenseCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 200,
        'transacted_at' => now()->subDays(12)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $expenseCategory->id,
    ]);

    $response = $this->get(route('reports.cashflow', ['period' => '30d']));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('reports/cashflow')
            ->where('activePeriod', '30d')
            ->where('summary.income', 3000)
            ->where('summary.expense', 2450)
            ->where('summary.net', 550)
            ->where('summary.positiveIntervals', 1)
            ->where('summary.negativeIntervals', 2)
            ->has('series', 6)
            ->has('insights'),
    );
});
