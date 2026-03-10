<?php

use App\Models\Account;
use App\Models\Activity;
use App\Models\Category;

it('logs transaction creation as an activity', function () {
    $account = Account::factory()->create();
    $category = Category::factory()->create(['type' => 'expense']);

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 49.90,
        'transacted_at' => '2026-03-10',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    $this->assertDatabaseHas('activities', [
        'type' => 'transaction_created',
        'title' => 'Transacao de 49.90 criada.',
    ]);
});

it('shares recent activities with inertia on transactions', function () {
    Activity::factory()->count(6)->create();

    $response = $this->get(route('transactions.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->has('notificationCenter.activities', 5)
            ->where(
                'notificationCenter.activities.0.title',
                Activity::query()->latest()->first()->title,
            ),
    );
});
