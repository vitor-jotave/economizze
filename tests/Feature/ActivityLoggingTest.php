<?php

use App\Models\Activity;

it('logs account creation as an activity', function () {
    $this->post(route('accounts.store'), [
        'name' => 'Conta de teste',
        'type' => 'checking',
        'institution' => 'Banco XPTO',
        'currency' => 'BRL',
        'initial_balance' => 1000,
        'color' => '#B5F955',
    ])->assertRedirect(route('accounts.index'));

    $this->assertDatabaseHas('activities', [
        'type' => 'account_created',
        'title' => 'Conta "Conta de teste" criada.',
    ]);
});

it('shares recent activities with inertia', function () {
    Activity::factory()->count(6)->create();

    $response = $this->get(route('accounts.index'));

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
