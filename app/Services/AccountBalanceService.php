<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;

class AccountBalanceService
{
    public function refresh(Account $account): void
    {
        $income = $account->transactions()
            ->where('type', 'income')
            ->sum('amount');

        $expense = $account->transactions()
            ->where('type', 'expense')
            ->sum('amount');

        $account->forceFill([
            'current_balance' => (float) $account->initial_balance + $income - $expense,
        ])->save();
    }

    public function refreshFromTransaction(Transaction $transaction): void
    {
        $transaction->loadMissing('account');

        if ($transaction->account) {
            $this->refresh($transaction->account);
        }
    }
}
