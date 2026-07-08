<?php

namespace App\Services\Contrato;

final readonly class ContratoFilters
{
    public function __construct(
        public ?int $orgaoId = null,
        public ?string $situacao = null,
        public ?string $fornecedor = null,
        public int $perPage = 10,
        public int $page = 1,
    ) {}
}
