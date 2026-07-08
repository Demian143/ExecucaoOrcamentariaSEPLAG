<?php

use App\Services\Grafico\GraficoService;

use function Pest\Laravel\mock;

test('retorna os dados agregados dos graficos', function () {
    $graficos = [
        'execucao_por_orgao' => [],
        'execucao_por_programa' => [],
        'empenhado_vs_pago' => [
            'total_empenhado' => '100.00',
            'total_liquidado' => '80.00',
            'total_pago' => '60.00',
        ],
        'top_10_contratos' => [],
        'evolucao_mensal' => [],
    ];

    mock(GraficoService::class)
        ->shouldReceive('index')
        ->once()
        ->andReturn($graficos);

    $this->withoutMiddleware()
        ->getJson('/api/graficos')
        ->assertSuccessful()
        ->assertExactJson($graficos);
});

test('exige autenticacao para acessar os graficos', function () {
    $this->getJson('/api/graficos')->assertUnauthorized();
});
