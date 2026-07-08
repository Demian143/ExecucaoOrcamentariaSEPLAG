<?php

namespace App\Http\Requests;

use App\Services\Orcamento\OrcamentoFilters;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListOrcamentosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'orgao_id' => ['nullable', 'integer', 'exists:orgaos,id'],
            'programa_id' => ['nullable', 'integer', 'exists:programas,id'],
            'acao_id' => ['nullable', 'integer', 'exists:acoes,id'],
            'ano' => ['nullable', 'integer'],
            'situacao' => ['nullable', 'in:inconsistente,saldo_negativo,sem_execucao,executado,em_execucao'],
            'percentual_minimo_executado' => ['nullable', 'numeric', 'min:0'],
            'percentual_maximo_executado' => [
                'nullable',
                'numeric',
                'min:0',
                Rule::when(
                    $this->filled('percentual_minimo_executado'),
                    'gte:percentual_minimo_executado',
                ),
            ],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): OrcamentoFilters
    {
        $filters = $this->validated();

        return new OrcamentoFilters(
            orgaoId: isset($filters['orgao_id']) ? (int) $filters['orgao_id'] : null,
            programaId: isset($filters['programa_id']) ? (int) $filters['programa_id'] : null,
            acaoId: isset($filters['acao_id']) ? (int) $filters['acao_id'] : null,
            ano: isset($filters['ano']) ? (int) $filters['ano'] : null,
            situacao: $filters['situacao'] ?? null,
            percentualMinimoExecutado: $this->nullableFloat($filters, 'percentual_minimo_executado'),
            percentualMaximoExecutado: $this->nullableFloat($filters, 'percentual_maximo_executado'),
            perPage: (int) ($filters['per_page'] ?? 10),
            page: (int) ($filters['page'] ?? 1),
        );
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    private function nullableFloat(array $filters, string $key): ?float
    {
        return isset($filters[$key]) ? (float) $filters[$key] : null;
    }
}
