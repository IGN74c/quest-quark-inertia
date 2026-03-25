<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

trait SortsByPosition
{
    protected static function bootSortsByPosition(): void
    {
        static::creating(function ($model): void {
            if ($model->position !== null) {
                return;
            }

            $model->position = $model->buildSortQuery()->max('position') + 1;
        });
    }

    public static function setNewOrder(array $ids): void
    {
        DB::transaction(function () use ($ids): void {
            foreach (array_values($ids) as $position => $id) {
                static::query()
                    ->whereKey($id)
                    ->update(['position' => $position]);
            }
        });
    }

    abstract public function buildSortQuery(): Builder;
}
