<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListOrcamentosRequest;
use App\Services\Orcamento\OrcamentoService;
use Illuminate\Http\JsonResponse;

class OrcamentoController extends Controller
{
    public function __construct(
        private readonly OrcamentoService $orcamentoService,
    ) {}

    public function index(ListOrcamentosRequest $request): JsonResponse
    {
        $orcamentos = $this->orcamentoService->listOrcamentos($request->filters());

        return response()->json($orcamentos);
    }
}
