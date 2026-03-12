<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    protected $model = Transaction::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(array_keys(Transaction::TYPES));
        $user = auth()->id() ?? User::factory();

        return [
            'user_id' => $user,
            'type' => $type,
            'amount' => fake()->randomFloat(2, 15, 2500),
            'transacted_at' => fake()->dateTimeBetween('-3 months')->format('Y-m-d'),
            'account_id' => Account::factory()->state([
                'user_id' => $user,
            ]),
            'category_id' => Category::factory()->state([
                'user_id' => $user,
                'type' => $type,
            ]),
        ];
    }
}
