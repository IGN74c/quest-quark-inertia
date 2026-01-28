<?php

namespace App\Services;

use App\Models\Board;
use App\Models\Column;
use Illuminate\Support\Facades\DB;

class ColumnService
{
    public function createColumn(Board $board, array $data): Column
    {
        $maxPosition = $board->columns()->max('position') ?? -1;

        return $board->columns()->create([
            'title' => $data['title'],
            'position' => $maxPosition + 1,
        ]);
    }

    public function updateColumn(Column $column, array $data): Column
    {
        $column->update($data);

        return $column;
    }

    public function deleteColumn(Column $column): array
    {
        $columnId = $column->id;
        $boardId = $column->board_id;

        DB::transaction(function () use ($column) {
            $board = $column->board;
            $deletedPosition = $column->position;

            $column->tasks()->delete();
            $column->delete();

            $board->columns()
                ->where('position', '>', $deletedPosition)
                ->decrement('position');
        });

        $columnIds = Column::where('board_id', $boardId)
            ->orderBy('position')
            ->pluck('id')
            ->all();

        return [
            'columnId' => $columnId,
            'boardId' => $boardId,
            'columnIds' => $columnIds,
        ];
    }
}
