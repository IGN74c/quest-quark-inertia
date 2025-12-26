<?php
namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $boards = $user->boards()
            ->with(['users', 'columns.tasks'])
            ->get();

        $totalTasks = $boards->sum(fn($board) => $board->columns->sum(fn($col) => $col->tasks->count()));

        $totalMembers = $boards->pluck('users')->flatten()->unique('id')->count();

        return Inertia::render('dashboard', [
            'boards' => $boards,
            'stats' => [
                'total_boards' => $boards->count(),
                'total_tasks' => $totalTasks,
                'total_members' => $totalMembers,
            ]
        ]);
    }

    public function show(Board $board): Response
    {
        $this->authorize('view', $board);

        return Inertia::render('boards/show', [
            'board' => $board->load([
                'users',
                'columns' => function ($query) {
                    $query->orderBy('position');
                },
                'columns.tasks' => function ($query) {
                    $query->orderBy('position');
                },
                'columns.tasks.assignee:id,name',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $board = Board::create([
            'title' => $validated['title'],
            'user_id' => $request->user()->id,
        ]);

        $board->users()->attach($request->user()->id, ['role' => 'admin']);

        return redirect()->route('boards.show', $board->id);
    }

    public function update(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $board->update($validated);

        return back();
    }

    public function destroy(Board $board)
    {
        $this->authorize('delete', $board);

        $board->delete();

        return redirect()->route('dashboard');
    }

    public function invite(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $userToInvite = User::where('email', $validated['email'])->first();

        $board->users()->syncWithoutDetaching([$userToInvite->id => ['role' => 'editor']]);

        return back();
    }

    public function updateUserRole(Request $request, Board $board, User $user)
    {
        $this->authorizeAdmin($board);

        $request->validate(['role' => 'required|in:editor,viewer']);

        $board->users()->updateExistingPivot($user->id, ['role' => $request->role]);

        return back();
    }

    public function removeUser(Board $board, User $user)
    {
        $this->authorizeAdmin($board);

        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Вы не можете удалить себя из доски']);
        }

        $board->users()->detach($user->id);

        return back();
    }

    private function authorizeAdmin(Board $board)
    {
        $isAdmin = $board->users()
            ->where('user_id', auth()->id())
            ->where('role', 'admin')
            ->exists();

        if (!$isAdmin) {
            abort(403, 'У вас нет прав администратора');
        }
    }
}