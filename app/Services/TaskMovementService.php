<?php

namespace App\Services;

use App\Models\Column;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

class TaskMovementService
{
    public function moveTask(Task $task, array $data): array
    {
        $fromColumnId = $task->column_id;
        $toColumnId = (int) $data['column_id'];

        if ($task->column_id !== $toColumnId) {
            $task->update(['column_id' => $toColumnId]);
        }

        Task::setNewOrder($data['task_ids']);

        $task->refresh();

        $fromTaskIds = Task::where('column_id', $fromColumnId)
            ->orderBy('position')
            ->pluck('id')
            ->all();

        $toTaskIds = Task::where('column_id', $toColumnId)
            ->orderBy('position')
            ->pluck('id')
            ->all();

        return [
            'task' => $task,
            'fromColumnId' => $fromColumnId,
            'toColumnId' => $toColumnId,
            'fromTaskIds' => $fromTaskIds,
            'toTaskIds' => $toTaskIds,
        ];
    }

    public function moveColumn(Column $column, int $newPosition): array
    {
        $oldPosition = $column->position;
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

        $columnIds = Column::where('board_id', $boardId)
            ->orderBy('position')
            ->pluck('id')
            ->all();

        return [
            'boardId' => $boardId,
            'columnIds' => $columnIds,
        ];
    }
}
