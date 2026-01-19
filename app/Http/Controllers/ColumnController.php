<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Column;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ColumnController extends Controller
{
    /**
     * Создание новой колонки.
     */
    public function store(Request $request, Board $board)
    {
        $this->authorize('update', $board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $maxPosition = $board->columns()->max('position') ?? -1;

        $board->columns()->create([
            'title' => $validated['title'],
            'position' => $maxPosition + 1,
        ]);

        return back();
    }

    /**
     * Обновление заголовка колонки.
     */
    public function update(Request $request, Column $column)
    {
        $this->authorize('update', $column->board);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $column->update($validated);

        return back();
    }

    /**
     * Удаление колонки и всех её задач.
     */
    public function destroy(Column $column)
    {
        $this->authorize('update', $column->board);

        DB::transaction(function () use ($column) {
            $board = $column->board;
            $deletedPosition = $column->position;

            $column->tasks()->delete();

            $column->delete();

            $board->columns()
                ->where('position', '>', $deletedPosition)
                ->decrement('position');
        });

        return back();
    }
}