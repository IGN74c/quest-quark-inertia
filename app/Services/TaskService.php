<?php

namespace App\Services;

use App\Models\Column;
use App\Models\Task;
use Illuminate\Support\Facades\DB;

class TaskService
{
    public function createTask(Column $column, int $creatorId, array $data): array
    {
        $task = null;

        DB::transaction(function () use ($column, $creatorId, $data, &$task) {
            Task::where('column_id', $column->id)->increment('position');

            $task = Task::create([
                'column_id' => $column->id,
                'creator_id' => $creatorId,
                'assignee_id' => $data['assignee_id'] ?? null,
                'title' => $data['title'],
                'description' => $data['description'] ?? '',
                'position' => 0,
            ]);
        });

        $taskIds = Task::where('column_id', $column->id)
            ->orderBy('position')
            ->pluck('id')
            ->all();

        return [
            'task' => $task,
            'taskIds' => $taskIds,
        ];
    }

    public function updateTask(Task $task, array $data): Task
    {
        $task->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? '',
            'assignee_id' => $data['assignee_id'] ?? null,
        ]);

        return $task;
    }

    public function deleteTask(Task $task): array
    {
        $columnId = $task->column_id;
        $oldPosition = $task->position;
        $taskId = $task->id;
        $boardId = $task->column->board_id;

        DB::transaction(function () use ($task, $columnId, $oldPosition) {
            $task->delete();

            Task::where('column_id', $columnId)
                ->where('position', '>', $oldPosition)
                ->decrement('position');
        });

        $taskIds = Task::where('column_id', $columnId)
            ->orderBy('position')
            ->pluck('id')
            ->all();

        return [
            'taskId' => $taskId,
            'columnId' => $columnId,
            'boardId' => $boardId,
            'taskIds' => $taskIds,
        ];
    }
}
