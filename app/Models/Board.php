<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Board extends Model
{
    protected $fillable = ['title', 'user_id'];

    // Создатель (владелец) доски
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Все участники доски
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'board_users')
            ->withPivot('role');
    }

    // Колонки доски
    public function columns(): HasMany
    {
        return $this->hasMany(Column::class)->orderBy('position');
    }
}