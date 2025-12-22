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
        return Inertia::render('dashboard', [
            'boards' => $request->user()->boards()->with('users')->get()
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