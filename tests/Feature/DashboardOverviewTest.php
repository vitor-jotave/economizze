<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

it('renders the dashboard with aggregated financial data', function () {
    $account = Account::factory()->create([
        'initial_balance' => 1000,
        'current_balance' => 1250,
    ]);
    $expenseCategory = Category::factory()->create(['type' => 'expense']);
    $incomeCategory = Category::factory()->create(['type' => 'income']);

    Transaction::factory()->create([
        'type' => 'income',
        'amount' => 600,
        'transacted_at' => now()->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $incomeCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 350,
        'transacted_at' => now()->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $expenseCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 900,
        'transacted_at' => now()->subDays(45)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $expenseCategory->id,
    ]);

    $response = $this->get(route('home', ['period' => '30d']));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('dashboard')
            ->where('activePeriod', '30d')
            ->where('summary.currentBalance', 1250)
            ->where('summary.totalIncome', 600)
            ->where('summary.totalExpense', 350)
            ->where('summary.netResult', 250)
            ->where('summary.transactionCount', 2)
            ->has('recentTransactions')
            ->has('periodOptions', 4)
            ->has('expenseByCategory'),
    );
});
