<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

it('renders the account health report with balance and net summaries', function () {
    $primary = Account::factory()->create([
        'name' => 'Nubank',
        'type' => 'checking',
        'current_balance' => 4200,
        'initial_balance' => 2500,
    ]);
    $secondary = Account::factory()->create([
        'name' => 'Inter',
        'type' => 'savings',
        'current_balance' => 800,
        'initial_balance' => 900,
    ]);
    Account::factory()->create([
        'name' => 'Cartão Black',
        'type' => 'credit_card',
        'current_balance' => 0,
        'initial_balance' => 0,
        'credit_limit' => 10000,
        'available_credit' => 7600,
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
            ->where('summary.totalCashBalance', 5000)
            ->where('summary.totalAvailableCredit', 7600)
            ->where('summary.accountsCount', 3)
            ->where('summary.cashAccountsCount', 2)
            ->where('summary.creditAccountsCount', 1)
            ->where('summary.topCashAccount.name', 'Nubank')
            ->where('summary.mostPressuredCard.name', 'Cartão Black')
            ->has('accounts', 3)
            ->has('insights'),
    );
});
