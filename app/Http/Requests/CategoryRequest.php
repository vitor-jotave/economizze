<?php

namespace App\Http\Requests;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var \App\Models\Category|null $category */
        $category = $this->route('category');

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category),
            ],
            'type' => [
                'required',
                'string',
                Rule::in(array_keys(Category::TYPES)),
            ],
            'color' => ['required', 'string', 'regex:/^#[A-Fa-f0-9]{6}$/'],
            'icon' => ['required', 'string', 'max:50'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Informe um nome para a categoria.',
            'name.unique' => 'Ja existe uma categoria com esse nome.',
            'type.required' => 'Selecione o tipo da categoria.',
            'type.in' => 'Selecione um tipo de categoria valido.',
            'color.regex' => 'A cor deve estar no formato hexadecimal.',
            'icon.required' => 'Selecione um icone para a categoria.',
        ];
    }
}
