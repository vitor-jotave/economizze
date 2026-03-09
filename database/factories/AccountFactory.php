<?php

namespace Database\Factories;

use App\Models\Account;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Account>
 */
class AccountFactory extends Factory
{
    protected $model = Account::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $initialBalance = fake()->randomFloat(2, 0, 50000);

        return [
            'name' => fake()->randomElement([
                'Carteira principal',
                'Conta do dia a dia',
                'Reserva de emergencia',
                'Cartao travel',
                'Conta investimentos',
            ]),
            'type' => fake()->randomElement(array_keys(Account::TYPES)),
            'institution' => fake()->optional()->company(),
            'currency' => 'BRL',
            'initial_balance' => $initialBalance,
            'current_balance' => $initialBalance,
            'color' => fake()->randomElement([
                '#B5F955',
                '#6BE675',
                '#3ED7A3',
                '#8AE500',
                '#F0C75E',
            ]),
            'is_active' => true,
        ];
    }
}
