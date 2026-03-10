<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\SystemNotification;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SystemNotification>
 */
class SystemNotificationFactory extends Factory
{
    protected $model = SystemNotification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => 'category_budget_warning',
            'title' => 'Comida está perto do limite mensal.',
            'body' => 'Os gastos da categoria já consumiram 82% do limite deste mês.',
            'tone' => 'from-[#F9D955] to-[#F59E55]',
            'subject_type' => 'category',
            'subject_id' => Category::factory(),
            'period_key' => now()->format('Y-m'),
            'threshold_key' => 'warning',
            'payload' => [
                'spent_amount' => 820,
                'limit_amount' => 1000,
                'progress_percentage' => 82,
            ],
        ];
    }
}
