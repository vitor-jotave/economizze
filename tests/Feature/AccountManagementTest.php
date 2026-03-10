<?php

use App\Models\Account;

it('renders the accounts page', function () {
    Account::factory()->count(2)->create();

    $response = $this->get(route('accounts.index'));

    $response->assertSuccessful();
    $response->assertSee('Accounts');
});

it('creates an account', function () {
    $response = $this->post(route('accounts.store'), [
        'name' => 'Conta teste',
        'type' => 'checking',
        'institution' => 'Banco XPTO',
        'currency' => 'BRL',
        'initial_balance' => 1500.75,
        'color' => '#B5F955',
    ]);

    $response->assertRedirect(route('accounts.index'));
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('accounts', [
        'name' => 'Conta teste',
        'type' => 'checking',
        'currency' => 'BRL',
        'current_balance' => '1500.75',
        'is_active' => 1,
    ]);
});

it('creates a credit card account with limit fields instead of balance fields', function () {
    $response = $this->post(route('accounts.store'), [
        'name' => 'Cartão Black',
        'type' => 'credit_card',
        'institution' => 'Banco XPTO',
        'currency' => 'BRL',
        'initial_balance' => 8000,
        'color' => '#8B8CFF',
    ]);

    $response->assertRedirect(route('accounts.index'));
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('accounts', [
        'name' => 'Cartão Black',
        'type' => 'credit_card',
        'initial_balance' => '0.00',
        'current_balance' => '0.00',
        'credit_limit' => '8000.00',
        'available_credit' => '8000.00',
    ]);
});

it('updates an account', function () {
    $account = Account::factory()->create([
        'initial_balance' => 500,
        'current_balance' => 500,
    ]);

    $response = $this->put(route('accounts.update', $account), [
        'name' => 'Conta atualizada',
        'type' => 'savings',
        'institution' => 'Banco Atualizado',
        'currency' => 'BRL',
        'initial_balance' => 2400,
        'color' => '#3ED7A3',
    ]);

    $response->assertRedirect(route('accounts.index'));

    $this->assertDatabaseHas('accounts', [
        'id' => $account->id,
        'name' => 'Conta atualizada',
        'type' => 'savings',
        'current_balance' => '2400.00',
        'is_active' => 1,
    ]);
});

it('deletes an account', function () {
    $account = Account::factory()->create();

    $response = $this->delete(route('accounts.destroy', $account));

    $response->assertRedirect(route('accounts.index'));

    $this->assertDatabaseMissing('accounts', [
        'id' => $account->id,
    ]);
});

it('validates account creation payload', function () {
    $response = $this->post(route('accounts.store'), [
        'name' => '',
        'type' => 'invalid',
        'institution' => '',
        'currency' => 'REAL',
        'initial_balance' => -5,
        'color' => 'green',
    ]);

    $response->assertSessionHasErrors([
        'name',
        'type',
        'currency',
        'initial_balance',
        'color',
    ]);
});
