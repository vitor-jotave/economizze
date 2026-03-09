<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AccountRequest extends FormRequest
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
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:wallet,checking,savings,credit_card,investment'],
            'institution' => ['nullable', 'string', 'max:255'],
            'currency' => ['required', 'string', 'size:3'],
            'initial_balance' => ['required', 'numeric', 'min:0'],
            'color' => ['required', 'string', 'regex:/^#[A-Fa-f0-9]{6}$/'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Informe um nome para a conta.',
            'type.required' => 'Selecione o tipo da conta.',
            'type.in' => 'Selecione um tipo de conta valido.',
            'currency.size' => 'A moeda deve ter exatamente 3 caracteres.',
            'initial_balance.required' => 'Informe o saldo inicial.',
            'initial_balance.numeric' => 'O saldo inicial deve ser numerico.',
            'initial_balance.min' => 'O saldo inicial nao pode ser negativo.',
            'color.regex' => 'A cor deve estar no formato hexadecimal.',
        ];
    }
}
