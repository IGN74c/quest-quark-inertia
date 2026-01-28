<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BoardStoreRequest extends FormRequest
{
    private const ICON_OPTIONS = [
        'layout-grid',
        'clipboard-list',
        'sticky-note',
        'calendar',
        'briefcase',
        'lightbulb',
        'rocket',
        'target',
        'flame',
        'monitor',
    ];

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'icon' => ['required', 'string', Rule::in(self::ICON_OPTIONS)],
        ];
    }
}
