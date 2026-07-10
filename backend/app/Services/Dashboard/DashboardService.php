<?php

namespace App\Services\Dashboard;

use App\Models\Contrato;
use App\Models\Orcamento;
use App\Models\Orgao;

class DashboardService
{
    public function __construct(
        private readonly Orgao $orgao,
        private readonly Contrato $contrato,
        private readonly Orcamento $orcamento,
    ) {}

    /**
     * @return array{
     *     total_orgaos: int,
     *     total_contratos: int,
     *     orcamento_total: float,
     *     empenhado: float,
     *     liquidado: float,
     *     pago: float,
     *     saldo: float,
     *     percentual_execucao: float,
     *     saldos_negativos: int
     * }
     */
    public function index(): array
    {
        return [
            'total_orgaos' => $this->totalOrgaos(),
            'total_contratos' => $this->totalContratos(),
            'orcamento_total' => $this->totalOrcamento(),
            'empenhado' => $this->totalEmpenhado(),
            'liquidado' => $this->totalLiquidado(),
            'pago' => $this->totalPago(),
            'saldo' => $this->totalSaldo(),
            'percentual_execucao' => $this->percentualExecucao(),
            'saldos_negativos' => $this->totalSaldosNegativos(),
        ];
    }

    public function totalOrgaos(): int
    {
        return $this->orgao->newQuery()->count();
    }

    public function totalContratos(): int
    {
        return $this->contrato->newQuery()->count();
    }

    public function totalEmpenhado(): float
    {
        return (float) $this->orcamento->newQuery()->sum('valor_empenhado');
    }

    public function totalLiquidado(): float
    {
        return (float) $this->orcamento->newQuery()->sum('valor_liquidado');
    }

    public function totalPago(): float
    {
        return (float) $this->orcamento->newQuery()->sum('valor_pago');
    }

    public function totalSuplementacao(): float
    {
        return (float) $this->orcamento->newQuery()->sum('suplementacoes');
    }

    public function totalAnulacoes(): float
    {
        return (float) $this->orcamento->newQuery()->sum('anulacoes');
    }

    public function totalDotacaoInicial(): float
    {
        return (float) $this->orcamento->newQuery()->sum('dotacao_inicial');
    }

    public function totalOrcamento(): float
    {
        return $this->totalDotacaoInicial() + $this->totalSuplementacao() - $this->totalAnulacoes();
    }

    public function totalSaldo(): float
    {
        return $this->totalOrcamento() - $this->totalEmpenhado();
    }

    public function totalSaldosNegativos(): int
    {
        return $this->orcamento->newQuery()
            ->whereRaw('
                COALESCE(valor_empenhado, 0) >
                COALESCE(dotacao_inicial, 0) + COALESCE(suplementacoes, 0) - COALESCE(anulacoes, 0)
            ')
            ->count();
    }

    public function percentualExecucao(): float
    {
        if ($this->totalOrcamento() == 0.0) {
            return 0.0;
        }

        return round(($this->totalEmpenhado() / $this->totalOrcamento()) * 100, 2);
    }
}
