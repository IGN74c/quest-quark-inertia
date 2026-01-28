<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BoardInviteRequest extends FormRequest
{
    public function authorize(): bool
    {
        $board = $this->route('board');

        return $board !== null && $this->user() !== null && $this->user()->can('update', $board);
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|exists:users,email',
        ];
    }
}
