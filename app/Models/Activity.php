<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    /** @use HasFactory<\Database\Factories\ActivityFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
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
}
