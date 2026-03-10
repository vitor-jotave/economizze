<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Uber', 'icon' => 'car', 'color' => '#3BA7FF'],
            ['name' => 'Onibus', 'icon' => 'bus', 'color' => '#74E7A8'],
            ['name' => 'Comida', 'icon' => 'utensils', 'color' => '#FF8A5B'],
            ['name' => 'Aluguel', 'icon' => 'home', 'color' => '#FFD66B'],
            ['name' => 'Celular', 'icon' => 'smartphone', 'color' => '#F76CF0'],
            ['name' => 'Internet', 'icon' => 'wifi', 'color' => '#74E7A8'],
            ['name' => 'Dizimo', 'icon' => 'heart', 'color' => '#B5F955'],
        ];

        foreach ($categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                [
                    'name' => $category['name'],
                    'type' => 'expense',
                    'color' => $category['color'],
                    'icon' => $category['icon'],
                    'is_active' => true,
                ],
            );
        }
    }
}
