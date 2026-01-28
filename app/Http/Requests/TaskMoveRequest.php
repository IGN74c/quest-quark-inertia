<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskMoveRequest extends FormRequest
{
    public function authorize(): bool
    {
        $task = $this->route('task');

        return $task !== null
            && $this->user() !== null
            && $this->user()->can('update', $task->column->board);
    }

    public function rules(): array
    {
        return [
            'column_id' => 'required|exists:columns,id',
            'task_ids' => 'required|array',
            'task_ids.*' => 'integer|exists:tasks,id',
        ];
    }
}
