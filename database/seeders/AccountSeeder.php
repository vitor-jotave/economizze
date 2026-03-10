<?php

namespace Database\Seeders;

use App\Models\Account;
use Illuminate\Database\Seeder;

class AccountSeeder extends Seeder
{
    public function run(): void
    {
        Account::query()->delete();

        Account::factory()->create([
            'name' => 'Conta principal',
            'type' => 'checking',
            'institution' => 'Nubank',
            'initial_balance' => 12850.45,
            'current_balance' => 12850.45,
            'color' => '#B5F955',
        ]);

        Account::factory()->create([
            'name' => 'Reserva',
            'type' => 'savings',
            'institution' => 'Inter',
            'initial_balance' => 40200.00,
            'current_balance' => 40200.00,
            'color' => '#3ED7A3',
        ]);

        Account::factory()->create([
            'name' => 'Carteira',
            'type' => 'wallet',
            'institution' => null,
            'initial_balance' => 420.90,
            'current_balance' => 420.90,
            'color' => '#F0C75E',
        ]);

        Account::factory()->create([
            'name' => 'Cartão Nubank',
            'type' => 'credit_card',
            'institution' => 'Nubank',
            'initial_balance' => 0,
            'current_balance' => 0,
            'credit_limit' => 6500.00,
            'available_credit' => 6500.00,
            'color' => '#8B8CFF',
        ]);
    }
}
