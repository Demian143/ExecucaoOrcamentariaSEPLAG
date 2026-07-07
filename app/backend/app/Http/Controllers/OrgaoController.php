<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Orgao\OrgaoService;

class OrgaoController extends Controller
{
    public function __construct(
        private readonly OrgaoService $orgaoService
    ){}

    public function index(Request $request)
    {
        $nome = $request->query('nome');
        $sigla = $request->query('sigla');
        $status = $request->query('status');
        $per_page = (int) $request->query('per_page', 10);
        $page = (int) $request->query('page', 1);

        return response()->json(
            $this->orgaoService->listOrgaos($nome, $sigla, $status, $per_page, $page),
            200);

    }
}
