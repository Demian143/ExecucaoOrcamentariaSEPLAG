<?php

namespace App\Http\Controllers;

use App\Models\Programa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProgramaController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        return response()->json(
            Programa::query()->orderBy('codigo')->paginate(
                perPage: (int) ($validated['per_page'] ?? 10),
                page: (int) ($validated['page'] ?? 1),
            ),
        );
    }
}
