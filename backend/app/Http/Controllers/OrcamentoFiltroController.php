<?php

namespace App\Http\Controllers;

use App\Services\Orcamento\OrcamentoFiltroService;
use Illuminate\Http\JsonResponse;

class OrcamentoFiltroController extends Controller
{
    public function __construct(
        private readonly OrcamentoFiltroService $orcamentoFiltroService,
    ) {}

    public function __invoke(): JsonResponse
    {
        return response()->json($this->orcamentoFiltroService->list());
    }
}
