<?php

namespace App\Services\Orcamento;

final readonly class OrcamentoFilters
{
    public function __construct(
        public ?int $orgaoId = null,
        public ?int $programaId = null,
        public ?int $acaoId = null,
        public ?int $ano = null,
        public ?string $situacao = null,
        public ?float $percentualMinimoExecutado = null,
        public ?float $percentualMaximoExecutado = null,
        public int $perPage = 10,
        public int $page = 1,
    ) {}
}
