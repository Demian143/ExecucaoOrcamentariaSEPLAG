<?php

namespace App\Services\Orcamento;

use App\Models\Acao;
use App\Models\Orgao;
use App\Models\Programa;
use Illuminate\Database\Eloquent\Collection;

class OrcamentoFiltroService
{
    public function __construct(
        private readonly Orgao $orgao,
        private readonly Programa $programa,
        private readonly Acao $acao,
    ) {}

    /**
     * @return array{orgaos: Collection<int, Orgao>, programas: Collection<int, Programa>, acoes: Collection<int, Acao>}
     */
    public function list(): array
    {
        return [
            'orgaos' => $this->orgao->newQuery()
                ->select(['id', 'nome', 'sigla', 'status'])
                ->orderBy('nome')
                ->get(),
            'programas' => $this->programa->newQuery()
                ->select(['id', 'nome', 'codigo'])
                ->orderBy('nome')
                ->get(),
            'acoes' => $this->acao->newQuery()
                ->select(['id', 'nome', 'codigo', 'programa_id'])
                ->orderBy('nome')
                ->get(),
        ];
    }
}
