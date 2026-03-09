<?php

namespace App\Http\Controllers;

use App\Http\Requests\AccountRequest;
use App\Models\Account;
use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(): Response
    {
        $accounts = Account::query()
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
                'totalBalance' => (float) Account::query()->sum('current_balance'),
                'activeAccounts' => Account::query()->where('is_active', true)->count(),
                'inactiveAccounts' => Account::query()->where('is_active', false)->count(),
                'institutions' => Account::query()
                    ->whereNotNull('institution')
                    ->distinct('institution')
                    ->count('institution'),
            ],
        ]);
    }

    public function store(AccountRequest $request): RedirectResponse
    {
        $account = Account::query()->create($this->validatedAttributes($request));

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
        $account->update($this->validatedAttributes($request));

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
        $accountName = $account->name;

        $account->delete();

        $message = 'Conta removida com sucesso.';

        Activity::query()->create([
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

        return [
            'name' => $validated['name'],
            'type' => $validated['type'],
            'institution' => $validated['institution'],
            'currency' => strtoupper($validated['currency']),
            'initial_balance' => $validated['initial_balance'],
            'current_balance' => $validated['initial_balance'],
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
            'type' => $type,
            'title' => $title,
            'tone' => $tone,
            'subject_type' => 'account',
            'subject_id' => $account->id,
        ]);
    }
}
