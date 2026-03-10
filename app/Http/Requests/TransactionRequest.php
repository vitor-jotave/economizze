<?php

namespace App\Http\Requests;

use App\Models\Category;
use App\Models\Transaction;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionRequest extends FormRequest
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
            'type' => [
                'required',
                'string',
                Rule::in(array_keys(Transaction::TYPES)),
            ],
            'amount' => ['required', 'numeric', 'gt:0'],
            'transacted_at' => ['required', 'date'],
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
            'category_id' => [
                'required',
                'integer',
                'exists:categories,id',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    $category = Category::query()->find($value);

                    if (! $category instanceof Category) {
                        return;
                    }

                    $transactionType = $this->string('type')->toString();

                    if (
                        $category->type !== 'both' &&
                        $category->type !== $transactionType
                    ) {
                        $fail('A categoria selecionada nao combina com o tipo da transacao.');
                    }
                },
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Selecione o tipo da transacao.',
            'type.in' => 'Selecione um tipo de transacao valido.',
            'amount.required' => 'Informe o valor da transacao.',
            'amount.numeric' => 'O valor da transacao deve ser numerico.',
            'amount.gt' => 'O valor da transacao deve ser maior que zero.',
            'transacted_at.required' => 'Informe a data da transacao.',
            'transacted_at.date' => 'Informe uma data valida.',
            'account_id.required' => 'Selecione a conta da transacao.',
            'account_id.exists' => 'Selecione uma conta valida.',
            'category_id.required' => 'Selecione a categoria da transacao.',
            'category_id.exists' => 'Selecione uma categoria valida.',
        ];
    }
}
