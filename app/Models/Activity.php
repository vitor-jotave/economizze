<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Activity extends Model
{
    /** @use HasFactory<\Database\Factories\ActivityFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'tone',
        'subject_type',
        'subject_id',
    ];

    public function scopeRecent(Builder $query, int $limit = 5): Builder
    {
        return $query->latest()->limit($limit);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
