<?php

namespace App\Services\Orcamento;

use App\Models\Orcamento;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class OrcamentoService
{
    public function __construct(
        private readonly Orcamento $orcamento
    ) {}

    public function listOrcamentos(
        OrcamentoFilters $filters,
    ): LengthAwarePaginator {
        $query = $this->orcamento->newQuery()
            ->with(['unidadeGestora.orgao', 'programa', 'acao'])
            ->orderByDesc('id');

        $dotacaoAtualizadaSql = '(COALESCE(dotacao_inicial, 0) + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0))';
        $percentualSql = "CASE WHEN {$dotacaoAtualizadaSql} > 0 THEN (COALESCE(valor_empenhado, 0) / {$dotacaoAtualizadaSql}) * 100 ELSE 0 END";

        if ($filters->percentualMinimoExecutado !== null) {
            $query->whereRaw("{$percentualSql} >= ?", [$filters->percentualMinimoExecutado]);
        }

        if ($filters->percentualMaximoExecutado !== null) {
            $query->whereRaw("{$percentualSql} <= ?", [$filters->percentualMaximoExecutado]);
        }

        if ($filters->orgaoId !== null) {
            $query->whereHas('unidadeGestora', function ($query) use ($filters) {
                $query->where('orgao_id', $filters->orgaoId);
            });
        }

        if ($filters->programaId !== null) {
            $query->where('programa_id', $filters->programaId);
        }

        if ($filters->acaoId !== null) {
            $query->where('acao_id', $filters->acaoId);
        }

        if ($filters->ano !== null) {
            $query->where('ano', $filters->ano);
        }

        if ($filters->situacao !== null) {
            $query->where('situacao', $filters->situacao);
        }

        return $query->paginate(
            perPage: min(max($filters->perPage, 1), 100),
            page: max(1, $filters->page),
        );
    }

    public function revisar(Orcamento $orcamento, User $analista, string $observacao): Orcamento
    {
        $orcamento->update([
            'observacao' => $observacao,
            'revisado_por' => $analista->id,
            'revisado_em' => now(),
        ]);

        return $orcamento->refresh()->load('revisor');
    }
}
