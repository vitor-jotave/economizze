<?php

namespace App\Http\Middleware;

use App\Models\Activity;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'flash' => [
                'success' => fn (): ?array => $request->session()->get('success'),
            ],
            'notificationCenter' => [
                'activities' => fn (): array => Activity::query()
                    ->recent()
                    ->get()
                    ->map(fn (Activity $activity): array => [
                        'id' => (string) $activity->id,
                        'title' => $activity->title,
                        'time' => $activity->created_at?->diffForHumans() ?? 'Agora mesmo',
                        'tone' => $activity->tone,
                    ])
                    ->all(),
            ],
            'auth' => [
                'user' => $request->user(),
            ],
        ];
    }
}
