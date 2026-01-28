<?php

namespace App\Services;

use App\Models\Board;
use App\Models\User;

class BoardService
{
    public function getDashboardData(User $user): array
    {
        $boards = $user->boards()
            ->with(['users', 'columns.tasks'])
            ->get();

        $totalTasks = $boards->sum(fn($board) => $board->columns->sum(fn($col) => $col->tasks->count()));
        $totalMembers = $boards->pluck('users')->flatten()->unique('id')->count();

        return [
            'boards' => $boards,
            'stats' => [
                'total_boards' => $boards->count(),
                'total_tasks' => $totalTasks,
                'total_members' => $totalMembers,
            ],
        ];
    }

    public function createBoard(User $user, array $data): Board
    {
        $board = Board::create([
            'title' => $data['title'],
            'icon' => $data['icon'],
            'user_id' => $user->id,
        ]);

        $board->users()->attach($user->id, ['role' => 'admin']);

        return $board;
    }

    public function updateBoard(Board $board, array $data): void
    {
        $board->update($data);
    }

    public function deleteBoard(Board $board): void
    {
        $board->delete();
    }

    public function inviteUser(Board $board, string $email): void
    {
        $userToInvite = User::where('email', $email)->firstOrFail();

        $board->users()->syncWithoutDetaching([$userToInvite->id => ['role' => 'editor']]);
    }

    public function updateUserRole(Board $board, User $user, string $role): void
    {
        $board->users()->updateExistingPivot($user->id, ['role' => $role]);
    }

    public function removeUser(Board $board, User $user, User $actor): bool
    {
        if ($user->id === $actor->id) {
            return false;
        }

        $board->users()->detach($user->id);

        return true;
    }
}
