<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\KattanaAccountService;
use Illuminate\Http\Client\RequestException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;

class KattanaAuthController extends Controller
{
    public function start(
        Request $request,
        KattanaAccountService $kattanaAccountService,
    ): RedirectResponse {
        if ($request->user() instanceof User) {
            return redirect()->intended(route('home'));
        }

        return redirect()->away(
            $kattanaAccountService->launchUrl(
                route('auth.kattana.callback'),
            ),
        );
    }

    public function callback(
        Request $request,
        KattanaAccountService $kattanaAccountService,
    ): RedirectResponse {
        $validated = $request->validate([
            'code' => ['required', 'string'],
        ]);

        try {
            $identity = $kattanaAccountService->exchangeCode($validated['code']);
        } catch (RequestException) {
            return to_route('auth.kattana.start');
        }

        $user = User::query()->firstWhere('global_uuid', $identity['uuid'])
            ?? User::query()->firstWhere('email', $identity['email'])
            ?? new User;

        $user->fill([
            'global_uuid' => $identity['uuid'],
            'name' => $identity['name'],
            'email' => $identity['email'],
            'email_verified_at' => $identity['email_verified'] ? now() : null,
        ]);

        if (! $user->exists || blank($user->password)) {
            $user->password = Str::password(32);
        }

        $user->save();

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    public function logout(Request $request): RedirectResponse|SymfonyResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $logoutUrl = app(KattanaAccountService::class)->logoutUrl(
            route('auth.kattana.logged-out'),
        );

        if ($request->header('X-Inertia')) {
            return Inertia::location($logoutUrl);
        }

        return redirect()->away($logoutUrl);
    }

    public function loggedOut(): RedirectResponse
    {
        return to_route('auth.kattana.start');
    }
}
