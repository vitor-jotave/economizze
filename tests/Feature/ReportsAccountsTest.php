<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

it('renders the account health report with balance and net summaries', function () {
    $primary = Account::factory()->create([
        'name' => 'Nubank',
        'current_balance' => 4200,
        'initial_balance' => 2500,
    ]);
    $secondary = Account::factory()->create([
        'name' => 'Inter',
        'current_balance' => 800,
        'initial_balance' => 900,
    ]);
    $incomeCategory = Category::factory()->create([
        'type' => 'income',
    ]);
    $expenseCategory = Category::factory()->create([
        'type' => 'expense',
    ]);

    Transaction::factory()->create([
        'type' => 'income',
        'amount' => 3000,
        'transacted_at' => now()->subDays(1)->format('Y-m-d'),
        'account_id' => $primary->id,
        'category_id' => $incomeCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 700,
        'transacted_at' => now()->subDays(2)->format('Y-m-d'),
        'account_id' => $primary->id,
        'category_id' => $expenseCategory->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 450,
        'transacted_at' => now()->subDays(1)->format('Y-m-d'),
        'account_id' => $secondary->id,
        'category_id' => $expenseCategory->id,
    ]);

    $response = $this->get(route('reports.accounts', ['period' => '30d']));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('reports/accounts')
            ->where('activePeriod', '30d')
            ->where('summary.totalBalance', 5000)
            ->where('summary.accountsCount', 2)
            ->where('summary.positiveAccounts', 1)
            ->where('summary.negativeAccounts', 1)
            ->where('summary.topBalanceAccount.name', 'Nubank')
            ->where('summary.worstNetAccount.name', 'Inter')
            ->has('accounts', 2)
            ->has('insights'),
    );
});
