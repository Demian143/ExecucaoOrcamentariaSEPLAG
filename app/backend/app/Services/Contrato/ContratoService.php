<?php

namespace App\Services\Contrato;

use App\Models\Contrato;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class ContratoService
{
    public function __construct(
        private readonly Contrato $contrato
    ) {}

    public function listContratos(ContratoFilters $filters): LengthAwarePaginator
    {
        $query = $this->contrato->newQuery()
            ->with(['fornecedor', 'orcamento.unidadeGestora.orgao'])
            ->orderByDesc('id');

        if ($filters->orgaoId !== null) {
            $query->whereHas('orcamento.unidadeGestora', function (Builder $query) use ($filters) {
                $query->where('orgao_id', $filters->orgaoId);
            });
        }

        if ($filters->situacao !== null) {
            $this->applySituacaoFilter($query, $filters->situacao);
        }

        if ($filters->fornecedor !== null) {
            $query->whereHas('fornecedor', function (Builder $query) use ($filters) {
                $query->where('nome', 'ilike', "%{$filters->fornecedor}%");
            });
        }

        return $query->paginate(
            perPage: min(max($filters->perPage, 1), 100),
            page: max(1, $filters->page),
        );
    }

    private function applySituacaoFilter(Builder $query, string $situacao): void
    {
        if ($situacao === 'vencido') {
            $query
                ->where('status', '!=', 'encerrado')
                ->whereDate('vigencia_fim', '<', today());

            return;
        }

        if ($situacao === 'vigente') {
            $query
                ->where('status', 'vigente')
                ->whereDate('vigencia_inicio', '<=', today())
                ->whereDate('vigencia_fim', '>=', today());

            return;
        }

        $query->where('status', $situacao);
    }
}
