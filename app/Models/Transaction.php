<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    /** @use HasFactory<\Database\Factories\TransactionFactory> */
    use HasFactory;

    public const TYPES = [
        'expense' => 'Despesa',
        'income' => 'Receita',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'type',
        'amount',
        'transacted_at',
        'account_id',
        'category_id',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'transacted_at' => 'date',
        ];
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->latest('transacted_at')->latest('id');
    }
}
