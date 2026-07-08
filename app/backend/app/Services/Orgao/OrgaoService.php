<?php

namespace App\Services\Orgao;

use App\Models\Orgao;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrgaoService
{
    public function __construct(
        private readonly Orgao $orgao,
    ) {}

    public function listOrgaos(OrgaoFilters $filters): LengthAwarePaginator
    {
        $query = $this->orgao->newQuery()->orderBy('nome');

        if ($filters->nome !== null) {
            $query->where('nome', 'ilike', "%{$filters->nome}%");
        }

        if ($filters->sigla !== null) {
            $query->where('sigla', 'ilike', "%{$filters->sigla}%");
        }

        if ($filters->status !== null) {
            $query->where('status', $filters->status);
        }

        return $query->paginate(
            perPage: min(max($filters->perPage, 1), 100),
            page: max(1, $filters->page),
        );
    }
}
