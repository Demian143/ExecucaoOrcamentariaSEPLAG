<?php

namespace App\Services\Grafico;

use App\Models\Contrato;
use App\Models\Orcamento;
use Illuminate\Support\Collection;

class GraficoService
{
    public function __construct(
        private readonly Orcamento $orcamento,
        private readonly Contrato $contrato,
    ) {}

    /**
     * @return array{
     *     execucao_por_orgao: Collection,
     *     execucao_por_programa: Collection,
     *     empenhado_vs_pago: object|null,
     *     top_10_contratos: Collection,
     *     evolucao_mensal: Collection
     * }
     */
    public function index(): array
    {
        return [
            'execucao_por_orgao' => $this->execucaoOrgao(),
            'execucao_por_programa' => $this->execucaoPrograma(),
            'empenhado_vs_pago' => $this->empenhadoVsPago(),
            'top_10_contratos' => $this->topContratos(),
            'evolucao_mensal' => $this->evolucaoMensal(),
        ];
    }

    /**
     * @return Collection<int, object>
     */
    public function execucaoPrograma(): Collection
    {
        return $this->orcamento->newQuery()
            ->join('programas', 'orcamentos.programa_id', '=', 'programas.id')
            ->selectRaw('
                programas.nome as nome_programa,
                SUM(COALESCE(dotacao_inicial, 0) + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0)) as dotacao_atualizada,
                SUM(COALESCE(valor_empenhado, 0)) as total_empenhado
            ')
            ->groupBy('programas.id', 'programas.nome')
            ->toBase()
            ->get()
            ->map(function (object $programa): object {
                $programa->percentual_empenhado = $programa->dotacao_atualizada > 0
                    ? round(($programa->total_empenhado / $programa->dotacao_atualizada) * 100, 2)
                    : 0;

                return $programa;
            });
    }

    /**
     * @return Collection<int, object>
     */
    public function execucaoOrgao(): Collection
    {
        return $this->orcamento->newQuery()
            ->join('unidades_gestoras', 'orcamentos.unidade_gestora_id', '=', 'unidades_gestoras.id')
            ->join('orgaos', 'unidades_gestoras.orgao_id', '=', 'orgaos.id')
            ->selectRaw('
                orgaos.sigla as sigla_orgao,
                SUM(COALESCE(dotacao_inicial, 0) + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0)) as dotacao_atualizada,
                SUM(COALESCE(valor_empenhado, 0)) as total_empenhado
            ')
            ->groupBy('orgaos.id', 'orgaos.sigla')
            ->toBase()
            ->get()
            ->map(function (object $orgao): object {
                $orgao->percentual_execucao = $orgao->dotacao_atualizada > 0
                    ? round(($orgao->total_empenhado / $orgao->dotacao_atualizada) * 100, 2)
                    : 0;

                return $orgao;
            });
    }

    public function empenhadoVsPago(): ?object
    {
        return $this->orcamento->newQuery()
            ->selectRaw('
                SUM(COALESCE(valor_empenhado, 0)) as total_empenhado,
                SUM(COALESCE(valor_liquidado, 0)) as total_liquidado,
                SUM(COALESCE(valor_pago, 0)) as total_pago
            ')
            ->toBase()
            ->first();
    }

    /**
     * @return Collection<int, Contrato>
     */
    public function topContratos(): Collection
    {
        return $this->contrato->newQuery()
            ->with(['fornecedor', 'orcamento.unidadeGestora.orgao'])
            ->orderByDesc('valor')
            ->limit(10)
            ->get();
    }

    /**
     * @return Collection<int, object>
     */
    public function evolucaoMensal(): Collection
    {
        return $this->contrato->newQuery()
            ->whereYear('vigencia_inicio', today()->year)
            ->selectRaw('
                EXTRACT(MONTH FROM vigencia_inicio)::int as mes,
                SUM(valor) as total_mes
            ')
            ->groupByRaw('EXTRACT(MONTH FROM vigencia_inicio)')
            ->orderBy('mes')
            ->toBase()
            ->get();
    }
}
