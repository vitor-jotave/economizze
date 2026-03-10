<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Models\Account;
use App\Models\Activity;
use App\Models\Category;
use App\Models\Transaction;
use App\Services\AccountBalanceService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function __construct(
        protected AccountBalanceService $accountBalanceService,
    ) {}

    public function index(): Response
    {
        $transactions = Transaction::query()
            ->with(['account', 'category'])
            ->ordered()
            ->get()
            ->map(fn (Transaction $transaction): array => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'type_label' => Transaction::TYPES[$transaction->type] ?? $transaction->type,
                'amount' => (float) $transaction->amount,
                'transacted_at' => $transaction->transacted_at?->format('Y-m-d'),
                'transacted_at_label' => $transaction->transacted_at?->format('d/m/Y'),
                'account' => [
                    'id' => $transaction->account?->id,
                    'name' => $transaction->account?->name,
                    'color' => $transaction->account?->color,
                ],
                'category' => [
                    'id' => $transaction->category?->id,
                    'name' => $transaction->category?->name,
                    'color' => $transaction->category?->color,
                    'icon' => $transaction->category?->icon,
                ],
                'updated_at' => $transaction->updated_at?->format('d/m/Y H:i'),
            ]);

        return Inertia::render('transactions', [
            'transactions' => $transactions,
            'transactionTypes' => collect(Transaction::TYPES)
                ->map(fn (string $label, string $value): array => [
                    'value' => $value,
                    'label' => $label,
                ])
                ->values(),
            'accounts' => Account::query()
                ->ordered()
                ->get()
                ->map(fn (Account $account): array => [
                    'id' => $account->id,
                    'name' => $account->name,
                    'type' => $account->type,
                    'type_label' => Account::TYPES[$account->type] ?? $account->type,
                    'color' => $account->color,
                    'currency' => $account->currency,
                ])
                ->values(),
            'categories' => Category::query()
                ->ordered()
                ->get()
                ->map(fn (Category $category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'type' => $category->type,
                    'type_label' => Category::TYPES[$category->type] ?? $category->type,
                    'color' => $category->color,
                    'icon' => $category->icon,
                ])
                ->values(),
            'summary' => [
                'income' => (float) Transaction::query()->where('type', 'income')->sum('amount'),
                'expense' => (float) Transaction::query()->where('type', 'expense')->sum('amount'),
                'count' => Transaction::query()->count(),
            ],
        ]);
    }

    public function store(TransactionRequest $request): RedirectResponse
    {
        $transaction = Transaction::query()->create($this->validatedAttributes($request));

        $this->accountBalanceService->refreshFromTransaction($transaction);

        $this->logActivity(
            type: 'transaction_created',
            title: sprintf('Transacao de %s criada.', (string) $transaction->amount),
            tone: 'from-[#B5F955] to-[#6BE675]',
            transaction: $transaction,
        );

        return to_route('transactions.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => 'Transacao criada com sucesso.',
        ]);
    }

    public function update(
        TransactionRequest $request,
        Transaction $transaction,
    ): RedirectResponse {
        $originalAccountId = $transaction->account_id;

        $transaction->update($this->validatedAttributes($request));

        $this->accountBalanceService->refreshFromTransaction($transaction);

        if ($originalAccountId !== $transaction->account_id) {
            $originalAccount = Account::query()->find($originalAccountId);

            if ($originalAccount instanceof Account) {
                $this->accountBalanceService->refresh($originalAccount);
            }
        }

        $this->logActivity(
            type: 'transaction_updated',
            title: sprintf('Transacao de %s atualizada.', (string) $transaction->amount),
            tone: 'from-sky-400 to-blue-200',
            transaction: $transaction,
        );

        return to_route('transactions.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => 'Transacao atualizada com sucesso.',
        ]);
    }

    public function destroy(Transaction $transaction): RedirectResponse
    {
        $account = $transaction->account;
        $amount = (string) $transaction->amount;

        $transaction->delete();

        if ($account instanceof Account) {
            $this->accountBalanceService->refresh($account);
        }

        Activity::query()->create([
            'type' => 'transaction_deleted',
            'title' => sprintf('Transacao de %s removida.', $amount),
            'tone' => 'from-amber-300 to-orange-100',
            'subject_type' => 'transaction',
        ]);

        return to_route('transactions.index')->with('success', [
            'id' => (string) Str::uuid(),
            'message' => 'Transacao removida com sucesso.',
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validatedAttributes(TransactionRequest $request): array
    {
        /** @var array{type:string,amount:numeric-string|int|float,transacted_at:string,account_id:int,category_id:int} $validated */
        $validated = $request->validated();

        return [
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'transacted_at' => $validated['transacted_at'],
            'account_id' => $validated['account_id'],
            'category_id' => $validated['category_id'],
        ];
    }

    protected function logActivity(
        string $type,
        string $title,
        string $tone,
        Transaction $transaction,
    ): void {
        Activity::query()->create([
            'type' => $type,
            'title' => $title,
            'tone' => $tone,
            'subject_type' => 'transaction',
            'subject_id' => $transaction->id,
        ]);
    }
}
