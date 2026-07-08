<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\Orcamento\OrcamentoService;

class OrcamentoController extends Controller
{
    public function __construct(
        private readonly OrcamentoService $orcamentoService,
    ) {}

    public function index(Request $request) {
        $orgaoId = $request->query('orgao_id');
        $programaId = $request->query('programa_id');
        $acaoId = $request->query('acao_id');
        $ano = $request->query('ano');
        $situacao = $request->query('situacao');
        $percentualMinimoExecutado = $request->query('percentual_minimo_executado', 0);
        $percentualMaximoExecutado = $request->query('percentual_maximo_executado', 0);
        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);

        return response()->json(
            $this->orcamentoService->listOrcamentos(
                $orgaoId,
                $programaId,
                $acaoId,
                $ano,
                $situacao,
                (float) $percentualMinimoExecutado,
                (float) $percentualMaximoExecutado,
                (int) $perPage,
                (int) $page
            ), 
            200
        );
    }
}
