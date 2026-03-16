<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

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
        'user_id',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->latest('transacted_at')->latest('id');
    }

    public function scopePosted(
        Builder $query,
        Carbon|string|null $referenceDate = null,
    ): Builder {
        $effectiveDate = $referenceDate instanceof Carbon
            ? $referenceDate->toDateString()
            : ($referenceDate ?: today()->toDateString());

        return $query->whereDate('transacted_at', '<=', $effectiveDate);
    }
}
