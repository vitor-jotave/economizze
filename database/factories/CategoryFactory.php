<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(fake()->numberBetween(1, 2), true);

        return [
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'type' => fake()->randomElement(array_keys(Category::TYPES)),
            'color' => fake()->randomElement([
                '#B5F955',
                '#74E7A8',
                '#3BA7FF',
                '#FF8A5B',
                '#FFD66B',
                '#F76CF0',
            ]),
            'icon' => fake()->randomElement([
                'receipt',
                'car',
                'bus',
                'home',
                'wifi',
                'smartphone',
                'heart',
            ]),
            'is_active' => true,
        ];
    }
}
