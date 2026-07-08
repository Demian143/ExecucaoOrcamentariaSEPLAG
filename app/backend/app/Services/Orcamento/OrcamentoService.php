<?php

namespace App\Services\Orcamento;

use App\Models\Orcamento;

class OrcamentoService
{
    public function __construct(
        private readonly Orcamento $orcamento
    ) {}

    public function index(
        ?int $orgaoId = null,
        ?int $programaId = null,
        ?int $acaoId = null,
        ?int $ano = null,
        ?string $situacao = null,
        float $percentualMinimoExecutado = 0,
        float $percentualMaximoExecutado = 0,
        int $per_page = 10,
        int $page = 1,
    ) {
        $query = $this->orcamento->newQuery();
        
        $dotacaoAtualizadaSql = '(dotacao_inicial + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0))';
        $percentualSql = "CASE WHEN {$dotacaoAtualizadaSql} > 0 THEN (valor_empenhado / {$dotacaoAtualizadaSql}) * 100 ELSE 0 END";

        // Filtro de Percentual Mínimo
        if ($percentualMinimoExecutado > 0) {
            $query->whereRaw("{$percentualSql} >= ?", [$percentualMinimoExecutado]);
        }

        // Filtro de Percentual Máximo
        if ($percentualMaximoExecutado > 0) {
            $query->whereRaw("{$percentualSql} <= ?", [$percentualMaximoExecutado]);
        }

        // Subquery para filtro de orgão_id através da relação com UnidadeGestora
        if ($orgaoId) {
            $query->whereHas('unidadeGestora', function ($q) use ($orgaoId) {
                $q->where('orgao_id', $orgaoId);
            });
        }

        if ($programaId) {
            $query->where('programa_id', $programaId);
        }

        if ($acaoId) {
            $query->where('acao_id', $acaoId);
        }

        if ($ano) {
            $query->where('ano', $ano);
        }

        if ($situacao) {
            $query->where('situacao', $situacao);
        }

        return $query->paginate(
            min(max($per_page, 1), 100), 
            ['*'], 
            'page', 
            max(1, $page)
        );
    }
}
