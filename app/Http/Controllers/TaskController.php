<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Column;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Создать новую задачу в колонке
     */
    public function store(Request $request, Column $column)
    {
        $this->authorize('update', $column->board);

        if ($request->has('assignee_id') && $request->assignee_id === 'none') {
            $request->merge(['assignee_id' => null]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        DB::transaction(function () use ($column, $validated, &$task) {
            Task::where('column_id', $column->id)
                ->increment('position');

            $task = Task::create([
                'column_id' => $column->id,
                'creator_id' => Auth::id(),
                'assignee_id' => $validated['assignee_id'] ?? null,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? '',
                'position' => 0,
            ]);
        });

        return back()->with('success', 'Задача создана');
    }

    /**
     * Обновить задачу
     */
    public function update(Request $request, Task $task)
    {
        $this->authorize('update', $task->column->board);

        if ($request->has('assignee_id') && $request->assignee_id === 'none') {
            $request->merge(['assignee_id' => null]);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        $task->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            'assignee_id' => $validated['assignee_id'] ?? null,
        ]);

        return back()->with('success', 'Задача обновлена');
    }

    /**
     * Удалить задачу
     */
    public function destroy(Task $task)
    {
        $this->authorize('update', $task->column->board);

        $columnId = $task->column_id;
        $oldPosition = $task->position;

        DB::transaction(function () use ($task, $columnId, $oldPosition) {
            $task->delete();
            Task::where('column_id', $columnId)
                ->where('position', '>', $oldPosition)
                ->decrement('position');
        });
        return back()->with('success', 'Задача удалена');
    }

    public function show()
    {

    }
}