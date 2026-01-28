<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskUpdateRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'assignee_id' => 'nullable|exists:users,id',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('assignee_id') && $this->input('assignee_id') === 'none') {
            $this->merge(['assignee_id' => null]);
        }
    }
}
