<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListContratosRequest;
use App\Services\Contrato\ContratoService;
use Illuminate\Http\JsonResponse;

class ContratoController extends Controller
{
    public function __construct(private readonly ContratoService $contratoService) {}

    public function index(ListContratosRequest $request): JsonResponse
    {
        $contratos = $this->contratoService->listContratos($request->filters());

        return response()->json($contratos);
    }
}
