<?php
namespace App\Services\Orgao;

use App\Models\Orgao;

class OrgaoService
{
    public function __construct(
        private Orgao $orgao
    ){}

    public function listOrgaos(
        ?string $nome = null, 
        ?string $sigla = null, 
        ?string $status = null,
        int $per_page = 10,
        int $page = 1,
    ) {
        $query = $this->orgao->query();

        if ($nome) {
            $query->where('nome', 'like', "%$nome%");
        }

        if ($sigla) {
            $query->where('sigla', 'like', "%$sigla%");
        }

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate(
            min(max($per_page, 1), 100), 
            ['*'], 
            'page', 
            max(1, $page)
        );
    }
}