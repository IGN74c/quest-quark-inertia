<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ColumnMoveRequest extends FormRequest
{
    public function authorize(): bool
    {
        $column = $this->route('column');

        return $column !== null
            && $this->user() !== null
            && $this->user()->can('update', $column->board);
    }

    public function rules(): array
    {
        return [
            'position' => 'required|integer|min:0',
        ];
    }
}
