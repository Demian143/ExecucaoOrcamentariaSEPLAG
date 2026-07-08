<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListOrgaosRequest;
use App\Services\Orgao\OrgaoService;
use Illuminate\Http\JsonResponse;

class OrgaoController extends Controller
{
    public function __construct(
        private readonly OrgaoService $orgaoService,
    ) {}

    public function index(ListOrgaosRequest $request): JsonResponse
    {
        $orgaos = $this->orgaoService->listOrgaos($request->filters());

        return response()->json($orgaos);
    }
}
