<?php

namespace App\Http\Controllers;

use App\Models\Column;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskMovementController extends Controller
{
    public function move(Request $request, Task $task)
    {
        $request->validate([
            'column_id' => 'required|exists:columns,id',
            'task_ids' => 'required|array',
        ]);

        if ($task->column_id !== (int) $request->column_id) {
            $task->update(['column_id' => $request->column_id]);
        }

        Task::setNewOrder($request->task_ids);

        return back();
    }
    public function moveColumn(Request $request, Column $column)
    {
        $validated = $request->validate([
            'position' => 'required|integer|min:0',
        ]);

        $oldPosition = $column->position;
        $newPosition = $validated['position'];
        $boardId = $column->board_id;

        DB::transaction(function () use ($column, $boardId, $oldPosition, $newPosition) {
            Column::where('board_id', $boardId)
                ->where('position', '>', $oldPosition)
                ->decrement('position');

            Column::where('board_id', $boardId)
                ->where('position', '>=', $newPosition)
                ->increment('position');

            $column->update([
                'position' => $newPosition,
            ]);
        });

        return back();
    }
}