<?php

namespace App\Http\Controllers;

use App\Events\ColumnCreated;
use App\Events\ColumnDeleted;
use App\Events\ColumnUpdated;
use App\Http\Requests\ColumnStoreRequest;
use App\Http\Requests\ColumnUpdateRequest;
use App\Models\Board;
use App\Models\Column;
use App\Services\ColumnService;

class ColumnController extends Controller
{
    /**
     * Создание новой колонки.
     */
    public function store(ColumnStoreRequest $request, Board $board, ColumnService $columnService)
    {
        $column = $columnService->createColumn($board, $request->validated());

        broadcast(new ColumnCreated($column))->toOthers();

        return back();
    }

    /**
     * Обновление заголовка колонки.
     */
    public function update(ColumnUpdateRequest $request, Column $column, ColumnService $columnService)
    {
        $column = $columnService->updateColumn($column, $request->validated());

        broadcast(new ColumnUpdated($column))->toOthers();

        return back();
    }

    /**
     * Удаление колонки и всех её задач.
     */
    public function destroy(Column $column, ColumnService $columnService)
    {
        $this->authorize('update', $column->board);

        $result = $columnService->deleteColumn($column);

        broadcast(new ColumnDeleted($result['columnId'], $result['boardId'], $result['columnIds']))->toOthers();

        return back();
    }
}
