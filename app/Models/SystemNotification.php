<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemNotification extends Model
{
    /** @use HasFactory<\Database\Factories\SystemNotificationFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'title',
        'body',
        'tone',
        'subject_type',
        'subject_id',
        'period_key',
        'threshold_key',
        'payload',
        'telegram_sent_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'telegram_sent_at' => 'datetime',
        ];
    }

    public function scopeRecent(Builder $query, int $limit = 8): Builder
    {
        return $query->latest()->limit($limit);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'subject_id')
            ->where('subject_type', 'category');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
