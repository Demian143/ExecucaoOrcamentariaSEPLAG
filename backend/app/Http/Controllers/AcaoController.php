<?php

namespace App\Http\Controllers;

use App\Models\Acao;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcaoController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'programa_id' => ['nullable', 'integer', 'exists:programas,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $acoes = Acao::query()->orderBy('codigo');

        if (isset($validated['programa_id'])) {
            $acoes->where('programa_id', $validated['programa_id']);
        }

        return response()->json(
            $acoes->paginate(
                perPage: (int) ($validated['per_page'] ?? 10),
                page: (int) ($validated['page'] ?? 1),
            ),
        );
    }
}
