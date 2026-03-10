<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Account extends Model
{
    /** @use HasFactory<\Database\Factories\AccountFactory> */
    use HasFactory;

    public const TYPES = [
        'wallet' => 'Carteira',
        'checking' => 'Conta corrente',
        'savings' => 'Poupanca',
        'credit_card' => 'Cartão',
        'investment' => 'Investimento',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'type',
        'institution',
        'currency',
        'initial_balance',
        'current_balance',
        'color',
        'is_active',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'initial_balance' => 'decimal:2',
            'current_balance' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('is_active')->orderBy('name');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
