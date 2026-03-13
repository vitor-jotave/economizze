<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

it('redirects guests that hit the app shell to the kattana flow', function () {
    $this->post(route('auth.logout'));

    $response = $this->get(route('home'));

    $response->assertRedirect(route('auth.kattana.start'));
});

it('redirects to the kattana launch endpoint', function () {
    $this->post(route('auth.logout'));

    config()->set('services.kattana_account.url', 'http://kattana-account.test');
    config()->set('services.kattana_account.app_slug', 'economizze');

    $response = $this->get(route('auth.kattana.start'));

    $response->assertRedirect(
        'http://kattana-account.test/apps/economizze/launch?return_to='
        .urlencode(route('auth.kattana.callback')),
    );
});

it('forwards the n parameter only to the kattana launch url', function () {
    $this->post(route('auth.logout'));

    config()->set('services.kattana_account.url', 'http://kattana-account.test');
    config()->set('services.kattana_account.app_slug', 'economizze');

    $response = $this->get(route('auth.kattana.start', [
        'n' => 'calebe',
    ]));

    $response->assertRedirect(
        'http://kattana-account.test/apps/economizze/launch?return_to='
        .urlencode(route('auth.kattana.callback'))
        .'&n=calebe',
    );
});

it('exchanges a valid code and authenticates the local user', function () {
    $this->post(route('auth.logout'));

    config()->set('services.kattana_account.url', 'http://kattana-account.test');
    config()->set('services.kattana_account.app_slug', 'economizze');
    config()->set('services.kattana_account.app_key', 'economizze-key');
    config()->set('services.kattana_account.app_secret', 'economizze-secret');

    Http::fake([
        'http://kattana-account.test/api/integrations/apps/economizze/exchange' => Http::response([
            'data' => [
                'uuid' => '2f251dfd-fb5b-4d7a-b40f-23284f6fa65c',
                'name' => 'Joao Vitor',
                'email' => 'joao@economizze.test',
                'email_verified' => true,
                'created_at' => now()->toISOString(),
            ],
        ]),
    ]);

    $response = $this->get(route('auth.kattana.callback', [
        'code' => 'valid-code',
    ]));

    $response->assertRedirect(route('home'));
    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'global_uuid' => '2f251dfd-fb5b-4d7a-b40f-23284f6fa65c',
        'email' => 'joao@economizze.test',
    ]);

    expect(Auth::user()?->name)->toBe('Joao Vitor');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'http://kattana-account.test/api/integrations/apps/economizze/exchange'
            && $request['code'] === 'valid-code'
            && $request->hasHeader(
                'Authorization',
                'Basic '.base64_encode('economizze-key:economizze-secret'),
            );
    });
});

it('reuses an existing local user matched by email', function () {
    $this->post(route('auth.logout'));

    $existingUser = User::factory()->create([
        'global_uuid' => null,
        'email' => 'joao@economizze.test',
        'name' => 'Perfil legado',
    ]);

    config()->set('services.kattana_account.url', 'http://kattana-account.test');
    config()->set('services.kattana_account.app_slug', 'economizze');
    config()->set('services.kattana_account.app_key', 'economizze-key');
    config()->set('services.kattana_account.app_secret', 'economizze-secret');

    Http::fake([
        'http://kattana-account.test/api/integrations/apps/economizze/exchange' => Http::response([
            'data' => [
                'uuid' => '26b57e1f-b213-4f5c-9056-f08ca4fb2c2f',
                'name' => 'Joao Kattana',
                'email' => 'joao@economizze.test',
                'email_verified' => true,
                'created_at' => now()->toISOString(),
            ],
        ]),
    ]);

    $this->get(route('auth.kattana.callback', [
        'code' => 'email-match',
    ]))->assertRedirect(route('home'));

    expect($existingUser->refresh()->global_uuid)->toBe('26b57e1f-b213-4f5c-9056-f08ca4fb2c2f')
        ->and($existingUser->name)->toBe('Joao Kattana');
});

it('redirects back to the start route when the exchange fails', function () {
    $this->post(route('auth.logout'));

    config()->set('services.kattana_account.url', 'http://kattana-account.test');
    config()->set('services.kattana_account.app_slug', 'economizze');
    config()->set('services.kattana_account.app_key', 'economizze-key');
    config()->set('services.kattana_account.app_secret', 'economizze-secret');

    Http::fake([
        'http://kattana-account.test/api/integrations/apps/economizze/exchange' => Http::response([
            'message' => 'invalid code',
        ], 422),
    ]);

    $response = $this->get(route('auth.kattana.callback', [
        'code' => 'expired-code',
    ]));

    $response->assertRedirect(route('auth.kattana.start'));
    $this->assertGuest();
});

it('logs out locally and redirects to the kattana global logout flow', function () {
    config()->set('services.kattana_account.url', 'http://kattana-account.test');
    config()->set('services.kattana_account.app_slug', 'economizze');

    $response = $this->post(route('auth.logout'));

    $response->assertRedirect(
        'http://kattana-account.test/apps/economizze/logout?return_to='
        .urlencode(route('auth.kattana.logged-out')),
    );
    $this->assertGuest();
});

it('redirects to the start of the auth flow after the kattana logout callback', function () {
    $response = $this->get(route('auth.kattana.logged-out'));

    $response->assertRedirect(route('auth.kattana.start'));
});
