<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListOrcamentosRequest;
use App\Models\Orcamento;
use App\Models\User;
use App\Services\Orcamento\OrcamentoService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function revisar(Request $request, Orcamento $orcamento): JsonResponse
    {
        $orcamento = $this->orcamentoService->revisar(
            $orcamento,
            $this->analista($request),
            $request->post('observacao')
        );

        return response()->json($orcamento);
    }

    private function analista(Request $request): User
    {
        $user = $request->user();

        if (! $user instanceof User) {
            throw new AuthenticationException;
        }

        return $user;
    }
}
