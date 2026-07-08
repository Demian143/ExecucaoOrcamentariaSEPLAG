<?php

namespace App\Http\Requests;

use App\Services\Orgao\OrgaoFilters;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ListOrgaosRequest extends FormRequest
{
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
            'nome' => ['nullable', 'string', 'max:255'],
            'sigla' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', 'in:ativo,inativo'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function filters(): OrgaoFilters
    {
        $filters = $this->validated();

        return new OrgaoFilters(
            nome: $filters['nome'] ?? null,
            sigla: $filters['sigla'] ?? null,
            status: $filters['status'] ?? null,
            perPage: (int) ($filters['per_page'] ?? 10),
            page: (int) ($filters['page'] ?? 1),
        );
    }
}
