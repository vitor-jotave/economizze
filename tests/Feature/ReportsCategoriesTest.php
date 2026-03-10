<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

it('renders the category spending report with aggregated insights', function () {
    $account = Account::factory()->create();
    $housing = Category::factory()->create([
        'name' => 'Aluguel',
        'type' => 'expense',
        'color' => '#8BC34A',
        'icon' => 'home',
    ]);
    $mobility = Category::factory()->create([
        'name' => 'Uber',
        'type' => 'expense',
        'color' => '#3FDE90',
        'icon' => 'car',
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 1800,
        'transacted_at' => now()->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $housing->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 90,
        'transacted_at' => now()->subDays(2)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $mobility->id,
    ]);

    Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 120,
        'transacted_at' => now()->subDays(35)->format('Y-m-d'),
        'account_id' => $account->id,
        'category_id' => $mobility->id,
    ]);

    $response = $this->get(route('reports.categories', ['period' => '30d']));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('reports/categories')
            ->where('activePeriod', '30d')
            ->where('summary.totalExpense', 1890)
            ->where('summary.categoriesCount', 2)
            ->where('summary.transactionsCount', 2)
            ->where('summary.topCategory.name', 'Aluguel')
            ->has('categories', 2)
            ->has('insights'),
    );
});
