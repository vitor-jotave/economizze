<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\SystemNotification;

it('creates a warning notification when expense spending reaches the monthly threshold', function () {
    $account = Account::factory()->create([
        'type' => 'checking',
    ]);
    $category = Category::factory()->create([
        'name' => 'Comida',
        'type' => 'expense',
        'monthly_budget_limit' => 1000,
    ]);

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 820,
        'transacted_at' => '2026-03-10',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    $this->assertDatabaseHas('system_notifications', [
        'type' => 'category_budget_alert',
        'subject_type' => 'category',
        'subject_id' => $category->id,
        'period_key' => '2026-03',
        'threshold_key' => 'warning',
        'title' => 'Comida está perto do limite mensal.',
    ]);

    $response = $this->get(route('transactions.index'));

    $response->assertInertia(
        fn ($page) => $page
            ->has('notificationCenter.notifications', 1)
            ->where(
                'notificationCenter.notifications.0.title',
                'Comida está perto do limite mensal.',
            ),
    );
});

it('deduplicates warning notifications and creates an exceeded notification once', function () {
    $account = Account::factory()->create([
        'type' => 'checking',
    ]);
    $category = Category::factory()->create([
        'name' => 'Uber',
        'type' => 'expense',
        'monthly_budget_limit' => 1000,
    ]);

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 810,
        'transacted_at' => '2026-03-10',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 40,
        'transacted_at' => '2026-03-11',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 200,
        'transacted_at' => '2026-03-12',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 50,
        'transacted_at' => '2026-03-13',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ])->assertRedirect(route('transactions.index'));

    expect(
        SystemNotification::query()
            ->where('subject_type', 'category')
            ->where('subject_id', $category->id)
            ->count(),
    )->toBe(2);

    $this->assertDatabaseHas('system_notifications', [
        'subject_type' => 'category',
        'subject_id' => $category->id,
        'threshold_key' => 'warning',
    ]);

    $this->assertDatabaseHas('system_notifications', [
        'subject_type' => 'category',
        'subject_id' => $category->id,
        'threshold_key' => 'limit_exceeded',
        'title' => 'Uber ultrapassou o limite mensal.',
    ]);
});
