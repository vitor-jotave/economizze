<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;

class AccountBalanceService
{
    public function refresh(Account $account): void
    {
        $income = $account->transactions()
            ->posted()
            ->where('type', 'income')
            ->sum('amount');

        $expense = $account->transactions()
            ->posted()
            ->where('type', 'expense')
            ->sum('amount');

        if ($account->isCreditCard()) {
            $account->forceFill([
                'current_balance' => 0,
                'available_credit' => (float) $account->credit_limit + $income - $expense,
            ])->save();

            return;
        }

        $account->forceFill([
            'current_balance' => (float) $account->initial_balance + $income - $expense,
            'available_credit' => null,
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
