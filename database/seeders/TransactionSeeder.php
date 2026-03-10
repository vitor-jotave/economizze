<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use App\Services\AccountBalanceService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        Transaction::query()->delete();

        $accounts = Account::query()
            ->orderBy('id')
            ->get();

        $categories = Category::query()
            ->orderBy('id')
            ->get()
            ->keyBy('name');

        $transactions = [
            ['type' => 'expense', 'amount' => 2300.00, 'days_ago' => 2, 'account_type' => 'checking', 'category' => 'Aluguel'],
            ['type' => 'expense', 'amount' => 78.40, 'days_ago' => 1, 'account_type' => 'checking', 'category' => 'Uber'],
            ['type' => 'expense', 'amount' => 24.00, 'days_ago' => 1, 'account_type' => 'wallet', 'category' => 'Onibus'],
            ['type' => 'expense', 'amount' => 136.20, 'days_ago' => 3, 'account_type' => 'checking', 'category' => 'Comida'],
            ['type' => 'expense', 'amount' => 62.90, 'days_ago' => 4, 'account_type' => 'checking', 'category' => 'Comida'],
            ['type' => 'expense', 'amount' => 59.99, 'days_ago' => 5, 'account_type' => 'checking', 'category' => 'Celular'],
            ['type' => 'expense', 'amount' => 119.90, 'days_ago' => 6, 'account_type' => 'checking', 'category' => 'Internet'],
            ['type' => 'expense', 'amount' => 150.00, 'days_ago' => 7, 'account_type' => 'checking', 'category' => 'Dizimo'],
            ['type' => 'expense', 'amount' => 88.50, 'days_ago' => 9, 'account_type' => 'checking', 'category' => 'Uber'],
            ['type' => 'expense', 'amount' => 42.00, 'days_ago' => 10, 'account_type' => 'wallet', 'category' => 'Onibus'],
            ['type' => 'expense', 'amount' => 184.35, 'days_ago' => 12, 'account_type' => 'checking', 'category' => 'Comida'],
            ['type' => 'expense', 'amount' => 134.70, 'days_ago' => 15, 'account_type' => 'checking', 'category' => 'Comida'],
            ['type' => 'expense', 'amount' => 59.99, 'days_ago' => 18, 'account_type' => 'checking', 'category' => 'Celular'],
            ['type' => 'expense', 'amount' => 119.90, 'days_ago' => 20, 'account_type' => 'checking', 'category' => 'Internet'],
            ['type' => 'expense', 'amount' => 150.00, 'days_ago' => 22, 'account_type' => 'savings', 'category' => 'Dizimo'],
            ['type' => 'expense', 'amount' => 2210.00, 'days_ago' => 33, 'account_type' => 'checking', 'category' => 'Aluguel'],
            ['type' => 'expense', 'amount' => 94.20, 'days_ago' => 36, 'account_type' => 'checking', 'category' => 'Uber'],
            ['type' => 'expense', 'amount' => 147.80, 'days_ago' => 41, 'account_type' => 'checking', 'category' => 'Comida'],
            ['type' => 'expense', 'amount' => 59.99, 'days_ago' => 44, 'account_type' => 'checking', 'category' => 'Celular'],
            ['type' => 'expense', 'amount' => 119.90, 'days_ago' => 48, 'account_type' => 'checking', 'category' => 'Internet'],
            ['type' => 'expense', 'amount' => 150.00, 'days_ago' => 52, 'account_type' => 'savings', 'category' => 'Dizimo'],
            ['type' => 'expense', 'amount' => 2140.00, 'days_ago' => 63, 'account_type' => 'checking', 'category' => 'Aluguel'],
            ['type' => 'expense', 'amount' => 169.40, 'days_ago' => 68, 'account_type' => 'checking', 'category' => 'Comida'],
            ['type' => 'expense', 'amount' => 66.30, 'days_ago' => 72, 'account_type' => 'checking', 'category' => 'Uber'],
        ];

        foreach ($transactions as $item) {
            /** @var \App\Models\Account|null $account */
            $account = $accounts->firstWhere('type', $item['account_type'])
                ?? $accounts->first();
            /** @var \App\Models\Category|null $category */
            $category = $categories->get($item['category']);

            if (! $account instanceof Account || ! $category instanceof Category) {
                continue;
            }

            Transaction::query()->create([
                'type' => $item['type'],
                'amount' => $item['amount'],
                'transacted_at' => Carbon::now()->subDays($item['days_ago'])->format('Y-m-d'),
                'account_id' => $account->id,
                'category_id' => $category->id,
            ]);
        }

        $balanceService = app(AccountBalanceService::class);

        Account::query()->get()->each(
            fn (Account $account) => $balanceService->refresh($account),
        );
    }
}
