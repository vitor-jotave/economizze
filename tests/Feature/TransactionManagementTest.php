<?php

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;

it('renders the transactions page', function () {
    Transaction::factory()->count(2)->create();

    $response = $this->get(route('transactions.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('transactions')
            ->has('transactions', 2),
    );
});

it('creates a transaction and updates account balance', function () {
    $account = Account::factory()->create([
        'initial_balance' => 1000,
        'current_balance' => 1000,
    ]);
    $category = Category::factory()->create(['type' => 'expense']);

    $response = $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 150.50,
        'transacted_at' => '2026-03-10',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ]);

    $response->assertRedirect(route('transactions.index'));
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('transactions', [
        'type' => 'expense',
        'amount' => '150.50',
    ]);

    expect($account->refresh()->current_balance)->toBe('849.50');
});

it('updates a transaction and recalculates balances when account changes', function () {
    $sourceAccount = Account::factory()->create([
        'initial_balance' => 1000,
        'current_balance' => 900,
    ]);
    $targetAccount = Account::factory()->create([
        'initial_balance' => 500,
        'current_balance' => 500,
    ]);
    $category = Category::factory()->create(['type' => 'expense']);
    $transaction = Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 100,
        'account_id' => $sourceAccount->id,
        'category_id' => $category->id,
    ]);

    $response = $this->put(route('transactions.update', $transaction), [
        'type' => 'expense',
        'amount' => 200,
        'transacted_at' => '2026-03-11',
        'account_id' => $targetAccount->id,
        'category_id' => $category->id,
    ]);

    $response->assertRedirect(route('transactions.index'));

    expect($sourceAccount->refresh()->current_balance)->toBe('1000.00');
    expect($targetAccount->refresh()->current_balance)->toBe('300.00');
});

it('deletes a transaction and restores account balance', function () {
    $account = Account::factory()->create([
        'initial_balance' => 1000,
        'current_balance' => 700,
    ]);
    $category = Category::factory()->create(['type' => 'expense']);
    $transaction = Transaction::factory()->create([
        'type' => 'expense',
        'amount' => 300,
        'account_id' => $account->id,
        'category_id' => $category->id,
    ]);

    $response = $this->delete(route('transactions.destroy', $transaction));

    $response->assertRedirect(route('transactions.index'));
    $this->assertDatabaseMissing('transactions', ['id' => $transaction->id]);
    expect($account->refresh()->current_balance)->toBe('1000.00');
});

it('validates transaction creation payload', function () {
    $response = $this->post(route('transactions.store'), [
        'type' => 'invalid',
        'amount' => 0,
        'transacted_at' => 'invalid-date',
        'account_id' => 999,
        'category_id' => 999,
    ]);

    $response->assertSessionHasErrors([
        'type',
        'amount',
        'transacted_at',
        'account_id',
        'category_id',
    ]);
});

it('validates category compatibility with transaction type', function () {
    $account = Account::factory()->create();
    $category = Category::factory()->create(['type' => 'income']);

    $response = $this->post(route('transactions.store'), [
        'type' => 'expense',
        'amount' => 25,
        'transacted_at' => '2026-03-10',
        'account_id' => $account->id,
        'category_id' => $category->id,
    ]);

    $response->assertSessionHasErrors(['category_id']);
});
