<?php

namespace App\Http\Requests;

use App\Services\Contrato\ContratoFilters;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ListContratosRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'orgao_id' => ['nullable', 'integer', 'exists:orgaos,id'],
            'situacao' => ['nullable', 'in:vigente,vencido,encerrado,suspenso'],
            'fornecedor' => ['nullable', 'string', 'max:255'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): ContratoFilters
    {
        $filters = $this->validated();

        return new ContratoFilters(
            orgaoId: isset($filters['orgao_id']) ? (int) $filters['orgao_id'] : null,
            situacao: $filters['situacao'] ?? null,
            fornecedor: $filters['fornecedor'] ?? null,
            perPage: (int) ($filters['per_page'] ?? 10),
            page: (int) ($filters['page'] ?? 1),
        );
    }
}
