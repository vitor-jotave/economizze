<?php

use App\Models\Category;

it('renders the categories page', function () {
    Category::factory()->count(2)->create();

    $response = $this->get(route('categories.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->component('categories')
            ->has('categories', 2),
    );
});

it('creates a category', function () {
    $response = $this->post(route('categories.store'), [
        'name' => 'Mercado',
        'type' => 'expense',
        'color' => '#B5F955',
        'icon' => 'receipt',
        'monthly_budget_limit' => 1200,
    ]);

    $response->assertRedirect(route('categories.index'));
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('categories', [
        'name' => 'Mercado',
        'slug' => 'mercado',
        'type' => 'expense',
        'color' => '#B5F955',
        'icon' => 'receipt',
        'monthly_budget_limit' => '1200.00',
        'is_active' => 1,
    ]);
});

it('updates a category', function () {
    $category = Category::factory()->create([
        'name' => 'Mercado antigo',
        'slug' => 'mercado-antigo',
    ]);

    $response = $this->put(route('categories.update', $category), [
        'name' => 'Mercado novo',
        'type' => 'both',
        'color' => '#3BA7FF',
        'icon' => 'home',
        'monthly_budget_limit' => 980.5,
    ]);

    $response->assertRedirect(route('categories.index'));

    $this->assertDatabaseHas('categories', [
        'id' => $category->id,
        'name' => 'Mercado novo',
        'slug' => 'mercado-novo',
        'type' => 'both',
        'color' => '#3BA7FF',
        'icon' => 'home',
        'monthly_budget_limit' => '980.50',
        'is_active' => 1,
    ]);
});

it('deletes a category', function () {
    $category = Category::factory()->create();

    $response = $this->delete(route('categories.destroy', $category));

    $response->assertRedirect(route('categories.index'));

    $this->assertDatabaseMissing('categories', [
        'id' => $category->id,
    ]);
});

it('validates category creation payload', function () {
    $response = $this->post(route('categories.store'), [
        'name' => '',
        'type' => 'invalid',
        'color' => 'green',
        'icon' => '',
    ]);

    $response->assertSessionHasErrors([
        'name',
        'type',
        'color',
        'icon',
    ]);
});
