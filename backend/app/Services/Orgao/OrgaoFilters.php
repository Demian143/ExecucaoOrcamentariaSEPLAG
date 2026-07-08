<?php

namespace App\Services\Orgao;

final readonly class OrgaoFilters
{
    public function __construct(
        public ?string $nome = null,
        public ?string $sigla = null,
        public ?string $status = null,
        public int $perPage = 10,
        public int $page = 1,
    ) {}
}
