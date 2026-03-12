<?php

namespace Database\Factories;

use App\Models\Activity;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Activity>
 */
class ActivityFactory extends Factory
{
    protected $model = Activity::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => auth()->id() ?? User::factory(),
            'type' => fake()->randomElement(['account_created', 'account_updated', 'account_deleted']),
            'title' => fake()->sentence(),
            'tone' => fake()->randomElement([
                'from-[#B5F955] to-[#6BE675]',
                'from-sky-400 to-blue-200',
                'from-amber-300 to-orange-100',
            ]),
            'subject_type' => 'account',
            'subject_id' => fake()->numberBetween(1, 9999),
        ];
    }
}
