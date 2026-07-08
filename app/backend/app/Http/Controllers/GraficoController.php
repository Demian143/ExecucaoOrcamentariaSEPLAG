<?php

namespace App\Http\Controllers;

use App\Services\Grafico\GraficoService;
use Illuminate\Http\JsonResponse;

class GraficoController extends Controller
{
    public function __construct(private readonly GraficoService $graficoService) {}

    public function index(): JsonResponse
    {
        return response()->json($this->graficoService->index());
    }
}
