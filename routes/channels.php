<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Board;

// Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
//     return (int) $user->id === (int) $id;
// });

Broadcast::channel('board.{boardId}', function ($user, $boardId) {
    $board = Board::query()->find($boardId);
    if (!$board) {
        return false;
    }

    return $board->user_id === $user->id || $board->users()->where('users.id', $user->id)->exists();
});
