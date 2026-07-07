<?php

namespace App\Services;

use App\Models\Orgao;
use App\Models\Contrato;
use App\Models\Orcamento;

class DashboardService
{
    public function __construct(
        private Orgao $orgao,
        private Contrato $contrato,
        private Orcamento $orcamento
    ) {}

    public function index(): array { 
        return [ 
            'total_orgaos' => $this->totalOrgaos(),
            'total_contratos' => $this->totalContratos(),
            'orcamento_total' => $this->totalOrcamento(),
            'empenhado' => $this->totalEmpenhado(),
            'liquidado' => $this->totalLiquidado(),
            'pago' => $this->totalPago(),
            'saldo' => $this->totalSaldo(),
            'percentual_execucao' => $this->percentualExecucao()
        ];
    }

    public function totalOrgaos(): float
    {
        return (float) $this->orgao::count();
    }

    public function totalContratos(): float {
        return (float) $this->contrato::count();
    }

    public function totalEmpenhado(): float {
        // Metodo utilizado já leva em conta valores nulos
        return (float) $this->orcamento::sum('valor_empenhado');
    }

    public function totalLiquidado(): float {
        return (float) $this->orcamento::sum('valor_liquidado');
    }

    public function totalPago(): float {
        return (float) $this->orcamento::sum('valor_pago');
    }

    public function totalSuplementacao(): float {
        return (float) $this->orcamento::sum('suplementacoes');
    }

    public function totalAnulacoes(): float {
        return (float) $this->orcamento::sum('anulacoes');
    }

    public function totalDotacaoInicial(): float {
        return (float) $this->orcamento::sum('dotacao_inicial');
    }

    public function totalOrcamento(): float {
        // Retorna dotação atualizada = dotacao_inicial + suplementacoes - anulacoes
        return $this->totalDotacaoInicial() + $this->totalSuplementacao() - $this->totalAnulacoes();
    }

    public function totalSaldo(): float {
        return (float) ($this->totalOrcamento() - $this->totalEmpenhado());
    }

    public function percentualExecucao(): float {
        if ($this->totalOrcamento() == 0) {
            return 0;
        }

        return round(($this->totalEmpenhado() / $this->totalOrcamento()) * 100, 2);
    }
}