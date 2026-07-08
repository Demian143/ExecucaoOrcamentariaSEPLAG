<?php

namespace App\Services\Grafico;

use App\Models\Orcamento;
use Illuminate\Support\Collection;

class GraficoService 
{
    public function __construct(
        private readonly Orcamento $orcamento
    ) {}

    /**
     * Calcula o total financeiro e o percentual de execução agrupado por Programa.
     * Consolida múltiplos orçamentos para gerar o gráfico de "Execução por Programa".
     *  
     * @return Collection
     */
    public function execucaoPrograma(): Collection
    {
        return $this->orcamento
            ->join('programas', 'orcamentos.programa_id', '=', 'programas.id')
            ->selectRaw('
                programas.nome as nome_programa,
                SUM(dotacao_inicial + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0)) as dotacao_atualizada,
                SUM(valor_empenhado) as total_empenhado 
            ')
            ->groupBy('programas.id', 'programas.nome')
            ->get()
            ->map(function ($item) {
                // Injeta o percentual de comprometimento do orçamento do programa com despesas
                $item->percentual_empenhado = $item->dotacao_atualizada > 0 
                    ? round(($item->total_empenhado / $item->dotacao_atualizada) * 100, 2) 
                    : 0;
                return $item;
            });
    }

    /**
     * Calcula o montante total financeiro e o percentual de despesas pagas agrupado por Órgão.
     * O resultado reflete quantos por cento do orçamento total de cada órgão foi efetivamente pago.
     *
     * @return Collection
     */
    public function execucaoOrgao(): Collection
    {
        return $this->orcamento
            ->join('unidades_gestoras', 'orcamentos.unidade_gestora_id', '=', 'unidades_gestoras.id')
            ->join('orgaos', 'unidades_gestoras.orgao_id', '=', 'orgaos.id')
            ->selectRaw('
                orgaos.sigla as sigla_orgao,
                SUM(dotacao_inicial + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0)) as dotacao_atualizada,
                SUM(valor_empenhado) as total_empenhado     
            ')
            ->groupBy('orgaos.id', 'orgaos.sigla')
            ->get()
            ->map(function ($item) {
                // Injeta o percentual de comprometimento do orçamento do órgão com despesas
                $item->percentual_execucao = $item->dotacao_atualizada > 0 
                    ? round(($item->total_empenhado / $item->dotacao_atualizada) * 100, 2) 
                    : 0;
                return $item;
            });
    }
}