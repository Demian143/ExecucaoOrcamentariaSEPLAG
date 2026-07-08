<?php

namespace App\Services\Grafico;

use App\Models\Orcamento;

class GraficoService {
    public function __construct(
        private readonly Orcamento $orcamento
    ) {}

    public function execucaoPrograma() {
        // Aqui traz somas totais baseadas em cada programa, para que seja possível gerar o gráfico de execução por programa
        // Um programa pode ter varios orçamentos, 
        return $this->orcamento
            ->join('programas', 'orcamentos.programa_id', '=', 'programas.id')
            ->selectRaw('
                programas.nome as nome_programa,
                SUM(dotacao_inicial + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0)) as dotacao_atualizada,
                SUM(valor_empenhado) as total_empenhado 
            ')
            ->groupBy('programas.id', 'programas.nome')
            ->get()
            ->map(
                function ($item) {
                    $item->percentual_empenhado = $item->dotacao_atualizada > 0 ? 
                    round(($item->total_empenhado / $item->dotacao_atualizada) * 100, 2) 
                    : 0;
                    return $item;
                }
            );

    }

    public function execucaoOrgao() {
        $query = $this->orcamento;
        $query->join('unidades_gestoras', 'orcamentos.unidade_gestora_id', '=', 'unidades_gestoras.id');
        $query->join('','','=','');
    }
}