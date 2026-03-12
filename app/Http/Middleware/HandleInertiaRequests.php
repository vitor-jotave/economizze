<?php

namespace App\Http\Middleware;

use App\Models\Account;
use App\Models\Activity;
use App\Models\Category;
use App\Models\SystemNotification;
use App\Models\Transaction;
use App\Models\User;
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
        /** @var User|null $user */
        $user = $request->user();
        $buildSearchTarget = static function (string $path, string $term): string {
            return $path.'?'.http_build_query([
                'search' => $term,
            ]);
        };

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'flash' => [
                'success' => fn (): ?array => $request->session()->get('success'),
            ],
            'notificationCenter' => [
                'notifications' => fn (): array => $user instanceof User
                    ? $user->systemNotifications()
                        ->recent()
                        ->get()
                        ->map(fn (SystemNotification $notification): array => [
                            'id' => (string) $notification->id,
                            'title' => $notification->title,
                            'body' => $notification->body,
                            'time' => $notification->created_at?->diffForHumans() ?? 'Agora mesmo',
                            'tone' => $notification->tone,
                        ])
                        ->all()
                    : [],
                'activities' => fn (): array => $user instanceof User
                    ? $user->activities()
                        ->recent()
                        ->get()
                        ->map(fn (Activity $activity): array => [
                            'id' => (string) $activity->id,
                            'title' => $activity->title,
                            'time' => $activity->created_at?->diffForHumans() ?? 'Agora mesmo',
                            'tone' => $activity->tone,
                        ])
                        ->all()
                    : [],
            ],
            'quickSearch' => [
                'items' => fn (): array => ! ($user instanceof User)
                    ? []
                    : [
                        ...$user->accounts()
                            ->ordered()
                            ->get()
                            ->map(fn (Account $account): array => [
                                'id' => "account-{$account->id}",
                                'kind' => 'account',
                                'title' => $account->name,
                                'subtitle' => $account->institution ?: (Account::TYPES[$account->type] ?? $account->type),
                                'keywords' => array_values(array_filter([
                                    $account->name,
                                    $account->institution,
                                    $account->currency,
                                    Account::TYPES[$account->type] ?? $account->type,
                                ])),
                                'target' => $buildSearchTarget('/accounts', $account->name),
                            ])
                            ->all(),
                        ...$user->categories()
                            ->ordered()
                            ->get()
                            ->map(fn (Category $category): array => [
                                'id' => "category-{$category->id}",
                                'kind' => 'category',
                                'title' => $category->name,
                                'subtitle' => Category::TYPES[$category->type] ?? $category->type,
                                'keywords' => array_values(array_filter([
                                    $category->name,
                                    $category->slug,
                                    Category::TYPES[$category->type] ?? $category->type,
                                ])),
                                'target' => $buildSearchTarget('/categories', $category->name),
                            ])
                            ->all(),
                        ...$user->transactions()
                            ->with(['account', 'category'])
                            ->ordered()
                            ->limit(120)
                            ->get()
                            ->map(fn (Transaction $transaction): array => [
                                'id' => "transaction-{$transaction->id}",
                                'kind' => 'transaction',
                                'title' => $transaction->category?->name ?: 'Transação',
                                'subtitle' => implode(' • ', array_filter([
                                    $transaction->account?->name,
                                    Transaction::TYPES[$transaction->type] ?? $transaction->type,
                                    $transaction->transacted_at?->format('d/m/Y'),
                                ])),
                                'keywords' => array_values(array_filter([
                                    $transaction->account?->name,
                                    $transaction->category?->name,
                                    Transaction::TYPES[$transaction->type] ?? $transaction->type,
                                    (string) $transaction->amount,
                                ])),
                                'target' => $buildSearchTarget(
                                    '/transactions',
                                    $transaction->category?->name ?: $transaction->account?->name ?: 'transacao',
                                ),
                            ])
                            ->all(),
                    ],
            ],
            'auth' => [
                'user' => $user,
            ],
        ];
    }
}
