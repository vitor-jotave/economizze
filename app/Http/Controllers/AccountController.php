<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountRequest;
use App\Models\Account;
use App\Models\Activity;
use App\Models\User;
use App\Services\AccountBalanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function __construct(
        protected AccountBalanceService $accountBalanceService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $this->user($request);
        $accounts = $user->accounts()
            ->ordered()
            ->get()
            ->map(fn (Account $account): array => [
                'id' => $account->id,
                'name' => $account->name,
                'type' => $account->type,
                'type_label' => Account::TYPES[$account->type] ?? $account->type,
                'institution' => $account->institution,
                'currency' => $account->currency,
                'initial_balance' => (float) $account->initial_balance,
                'current_balance' => (float) $account->current_balance,
                'credit_limit' => (float) ($account->credit_limit ?? 0),
                'available_credit' => (float) ($account->available_credit ?? 0),
                'color' => $account->color,
                'is_active' => $account->is_active,
                'updated_at' => $account->updated_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('accounts', [
            'accounts' => $accounts,
            'accountTypes' => collect(Account::TYPES)
                ->map(fn (string $label, string $value): array => [
                    'value' => $value,
                    'label' => $label,
                ])
                ->values(),
            'summary' => [
                'totalBalance' => (float) $user->accounts()->sum('current_balance'),
                'activeAccounts' => $user->accounts()->where('is_active', true)->count(),
                'inactiveAccounts' => $user->accounts()->where('is_active', false)->count(),
                'institutions' => $user->accounts()
                    ->whereNotNull('institution')
                    ->distinct('institution')
                    ->count('institution'),
            ],
        ]);
    }

    public function store(AccountRequest $request): RedirectResponse
    {
        $account = $this->user($request)->accounts()->create(
            $this->validatedAttributes($request),
        );
        $this->accountBalanceService->refresh($account);

        $message = 'Conta criada com sucesso.';

        $this->logActivity(
            type: 'account_created',
            title: sprintf('Conta "%s" criada.', $account->name),
            tone: 'from-[#B5F955] to-[#6BE675]',
            account: $account,
        );

        return to_route('accounts.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => $message,
        ]);
    }

    public function update(AccountRequest $request, Account $account): RedirectResponse
    {
        $account = $this->ownedAccount($request, $account);
        $account->update($this->validatedAttributes($request));
        $this->accountBalanceService->refresh($account);

        $message = 'Conta atualizada com sucesso.';

        $this->logActivity(
            type: 'account_updated',
            title: sprintf('Conta "%s" atualizada.', $account->name),
            tone: 'from-sky-400 to-blue-200',
            account: $account,
        );

        return to_route('accounts.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => $message,
        ]);
    }

    public function destroy(Account $account): RedirectResponse
    {
        $request = request();
        $account = $this->ownedAccount($request, $account);
        $accountName = $account->name;

        $account->delete();

        $message = 'Conta removida com sucesso.';

        Activity::query()->create([
            'user_id' => $this->user($request)->id,
            'type' => 'account_deleted',
            'title' => sprintf('Conta "%s" removida.', $accountName),
            'tone' => 'from-amber-300 to-orange-100',
            'subject_type' => 'account',
        ]);

        return to_route('accounts.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => $message,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validatedAttributes(AccountRequest $request): array
    {
        /** @var array{name:string,type:string,institution:?string,currency:string,initial_balance:numeric-string|int|float,color:string} $validated */
        $validated = $request->validated();
        $isCreditCard = $validated['type'] === 'credit_card';

        return [
            'name' => $validated['name'],
            'type' => $validated['type'],
            'institution' => $validated['institution'],
            'currency' => strtoupper($validated['currency']),
            'initial_balance' => $isCreditCard ? 0 : $validated['initial_balance'],
            'current_balance' => $isCreditCard ? 0 : $validated['initial_balance'],
            'credit_limit' => $isCreditCard ? $validated['initial_balance'] : null,
            'available_credit' => $isCreditCard ? $validated['initial_balance'] : null,
            'color' => strtoupper($validated['color']),
            'is_active' => $request->route('account') instanceof Account
                ? $request->route('account')->is_active
                : true,
        ];
    }

    protected function logActivity(
        string $type,
        string $title,
        string $tone,
        Account $account,
    ): void {
        Activity::query()->create([
            'user_id' => $account->user_id,
            'type' => $type,
            'title' => $title,
            'tone' => $tone,
            'subject_type' => 'account',
            'subject_id' => $account->id,
        ]);
    }

    protected function user(Request $request): User
    {
        /** @var User $user */
        $user = $request->user();

        return $user;
    }

    protected function ownedAccount(Request $request, Account $account): Account
    {
        return $this->user($request)->accounts()->findOrFail($account->id);
    }
}
