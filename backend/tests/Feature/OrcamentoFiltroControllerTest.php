<?php

use App\Services\Orcamento\OrcamentoFiltroService;
use Illuminate\Support\Collection;

use function Pest\Laravel\mock;

test('lista todas as opcoes dos filtros de orcamento', function () {
    $filtros = [
        'orgaos' => new Collection([
            ['id' => 1, 'nome' => 'Secretaria de Planejamento', 'sigla' => 'SEPLAG', 'status' => 'ativo'],
        ]),
        'programas' => new Collection([
            ['id' => 2, 'nome' => 'Gestão Pública', 'codigo' => '100'],
        ]),
        'acoes' => new Collection([
            ['id' => 3, 'nome' => 'Modernização', 'codigo' => '200', 'programa_id' => 2],
        ]),
    ];

    mock(OrcamentoFiltroService::class)
        ->shouldReceive('list')
        ->once()
        ->andReturn($filtros);

    $this->withoutMiddleware()
        ->getJson('/api/orcamentos/filtros')
        ->assertSuccessful()
        ->assertJsonCount(1, 'orgaos')
        ->assertJsonCount(1, 'programas')
        ->assertJsonCount(1, 'acoes')
        ->assertJsonPath('orgaos.0.sigla', 'SEPLAG')
        ->assertJsonPath('programas.0.codigo', '100')
        ->assertJsonPath('acoes.0.codigo', '200');
});

test('exige autenticacao para listar as opcoes dos filtros', function () {
    $this->getJson('/api/orcamentos/filtros')->assertUnauthorized();
});
