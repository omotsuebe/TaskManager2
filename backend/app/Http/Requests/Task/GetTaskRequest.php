<?php

namespace App\Http\Requests\Task;

use Illuminate\Foundation\Http\FormRequest;

class GetTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'shared' => 'nullable|string|max:255',
            'priority' => 'nullable|string|max:50',
            'status' => 'nullable|string|max:50',
            'category' => 'nullable|string|max:255',
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date|after_or_equal:from_date',
            'limit' => 'nullable|integer|min:1|max:20',
            'page' => 'nullable|integer|min:1',
        ];
    }

    /**
     * Customize the error messages.
     */
    public function messages(): array
    {
        return [
            'from_date.before_or_equal' => 'The start date must be before or equal to the end date.',
            'to_date.after_or_equal' => 'The end date must be after or equal to the start date.',
        ];
    }
}
