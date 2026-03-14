<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;

it('renders the dashboard with aggregated financial data', function () {
    $account = Account::factory()->create([
        'type' => 'checking',
        'initial_balance' => 1000,
        'current_balance' => 1250,
    ]);
    Account::factory()->create([
        'type' => 'credit_card',
        'initial_balance' => 0,
        'current_balance' => 0,
        'credit_limit' => 4000,
        'available_credit' => 2750,
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
            ->where('summary.cashBalance', 1250)
            ->where('summary.availableCredit', 2750)
            ->where('summary.totalIncome', 600)
            ->where('summary.totalExpense', 350)
            ->where('summary.netResult', 250)
            ->where('summary.transactionCount', 2)
            ->where('summary.cashAccountsCount', 1)
            ->where('summary.creditAccountsCount', 1)
            ->has('recentTransactions')
            ->has('periodOptions', 4)
            ->has('expenseByCategory'),
    );
});

it('reflects a newly created expense in the dashboard distribution for the authenticated user', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $account = Account::factory()->create([
        'user_id' => $user->id,
        'type' => 'checking',
        'initial_balance' => 1500,
        'current_balance' => 1500,
    ]);
    $category = Category::factory()->create([
        'user_id' => $user->id,
        'name' => 'Mercado',
        'type' => 'expense',
        'color' => '#FF8A5B',
        'icon' => 'receipt',
    ]);

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 240.90,
        'transacted_at' => now()->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    $response = $this->get(route('home', ['period' => '30d']));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('dashboard')
            ->where('summary.totalExpense', 240.9)
            ->where('summary.transactionCount', 1)
            ->has('expenseByCategory', 1)
            ->where('expenseByCategory.0.name', 'Mercado')
            ->where('expenseByCategory.0.total', 240.9),
    );
});
