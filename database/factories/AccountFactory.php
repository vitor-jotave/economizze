<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\User;
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
        $type = fake()->randomElement(array_keys(Account::TYPES));
        $initialBalance = fake()->randomFloat(2, 0, 50000);
        $isCreditCard = $type === 'credit_card';

        return [
            'user_id' => auth()->id() ?? User::factory(),
            'name' => fake()->randomElement([
                'Carteira principal',
                'Conta do dia a dia',
                'Reserva de emergencia',
                'Cartao travel',
                'Conta investimentos',
            ]),
            'type' => $type,
            'institution' => fake()->optional()->company(),
            'currency' => 'BRL',
            'initial_balance' => $isCreditCard ? 0 : $initialBalance,
            'current_balance' => $isCreditCard ? 0 : $initialBalance,
            'credit_limit' => $isCreditCard ? $initialBalance : null,
            'available_credit' => $isCreditCard ? $initialBalance : null,
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
