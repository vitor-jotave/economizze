<?php

use App\Models\Activity;

it('logs category creation as an activity', function () {
    $this->post(route('categories.store'), [
        'name' => 'Investimentos',
        'type' => 'income',
        'color' => '#B5F955',
        'icon' => 'receipt',
    ])->assertRedirect(route('categories.index'));

    $this->assertDatabaseHas('activities', [
        'type' => 'category_created',
        'title' => 'Categoria "Investimentos" criada.',
    ]);
});

it('shares recent activities with inertia on categories', function () {
    Activity::factory()->count(6)->create();

    $response = $this->get(route('categories.index'));

    $response->assertSuccessful();
    $response->assertInertia(
        fn ($page) => $page
            ->has('notificationCenter.activities', 5)
            ->where(
                'notificationCenter.activities.0.title',
                Activity::query()->latest()->first()->title,
            ),
    );
});
