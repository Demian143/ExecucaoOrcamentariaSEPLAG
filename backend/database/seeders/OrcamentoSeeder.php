<?php

namespace Database\Seeders;

use App\Models\Acao;
use App\Models\Contrato;
use App\Models\FonteRecurso;
use App\Models\Fornecedor;
use App\Models\Funcao;
use App\Models\NaturezaDespesa;
use App\Models\Orcamento;
use App\Models\Orgao;
use App\Models\Programa;
use App\Models\Subfuncao;
use App\Models\UnidadeGestora;
use App\Models\User;
use DateTimeImmutable;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use RuntimeException;

class OrcamentoSeeder extends Seeder
{
    use WithoutModelEvents;

    private const UNIDADE_GESTORA_ORGAO = [
        'Gabinete do Secretário' => 'SEPLAG',
        'Subsecretaria de Gestão' => 'SEPLAG',
        'Subsecretaria de Planejamento' => 'SEPLAG',
        'Fundo Estadual de Saúde' => 'SES',
        'Fundo Estadual de Educação' => 'SEEDUC',
        'Coordenadoria Regional Metropolitana' => 'SEEDUC',
        'Coordenadoria Regional Norte' => 'SEEDUC',
        'Departamento de Administração e Finanças' => 'SEFAZ',
        'Superintendência de Obras' => 'SEINFRA',
        'Superintendência de Tecnologia da Informação' => 'SECTI',
    ];

    private const ORGAOS_INATIVOS = [
        'DER-RJ',
        'SETUR',
        'EMOP',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        /** @var array{
         *     orgaos: array<int, array{sigla: string, nome: string}>,
         *     programas: array<int, array{codigo: string, nome: string}>,
         *     acoes: array<int, array{codigo: string, nome: string, programa: string}>,
         *     funcoes: array<int, array{codigo: string, nome: string, subfuncoes: array<int, string>}>,
         *     naturezas_despesa: array<int, string>,
         *     fontes_recurso: array<int, string>,
         *     unidades_gestoras_exemplos: array<int, string>,
         *     fornecedores: array<int, string>,
         *     configuracao_geracao: array{orcamentos: int, contratos: int},
         *     objetos_contrato: array<int, string>
         * } $dados
         */
        $dados = json_decode(
            file_get_contents(database_path('data/dados-referencia.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        foreach ($dados['orgaos'] as $orgao) {
            Orgao::updateOrCreate(
                ['sigla' => $orgao['sigla']],
                [
                    'nome' => $orgao['nome'],
                    'status' => in_array($orgao['sigla'], self::ORGAOS_INATIVOS, true)
                        ? 'inativo'
                        : 'ativo',
                ],
            );
        }

        foreach ($dados['programas'] as $programa) {
            Programa::updateOrCreate(
                ['codigo' => $programa['codigo']],
                ['nome' => $programa['nome']],
            );
        }

        foreach ($dados['acoes'] as $acao) {
            $programa = Programa::query()
                ->where('codigo', $acao['programa'])
                ->first();

            if ($programa === null) {
                throw new RuntimeException("Programa {$acao['programa']} não encontrado para a ação {$acao['codigo']}.");
            }

            Acao::updateOrCreate(
                ['codigo' => $acao['codigo']],
                [
                    'nome' => $acao['nome'],
                    'programa_id' => $programa->id,
                ],
            );
        }

        foreach ($dados['funcoes'] as $funcao) {
            $funcaoModel = Funcao::updateOrCreate(
                ['codigo' => $funcao['codigo']],
                ['nome' => $funcao['nome']],
            );

            foreach ($funcao['subfuncoes'] as $subfuncao) {
                $funcaoModel->subfuncoes()->updateOrCreate(['nome' => $subfuncao]);
            }
        }

        $this->seedNames(NaturezaDespesa::class, $dados['naturezas_despesa']);
        $this->seedNames(FonteRecurso::class, $dados['fontes_recurso']);
        $this->seedUnidadesGestoras($dados['unidades_gestoras_exemplos']);
        $this->seedNames(Fornecedor::class, $dados['fornecedores']);
        $this->seedOrgaosProgramas();
        $this->seedOrcamentos(
            $dados['configuracao_geracao']['orcamentos'],
            $dados['configuracao_geracao']['contratos'],
            $dados['objetos_contrato'],
        );
    }

    /**
     * @param  array<int, string>  $names
     */
    private function seedUnidadesGestoras(array $names): void
    {
        $orgaos = Orgao::query()->get()->keyBy('sigla');

        if ($orgaos->isEmpty()) {
            throw new RuntimeException('Nenhum órgão disponível para associar às unidades gestoras.');
        }

        foreach ($names as $name) {
            $sigla = self::UNIDADE_GESTORA_ORGAO[$name]
                ?? throw new RuntimeException("Órgão não mapeado para a unidade gestora {$name}.");
            $orgao = $orgaos->get($sigla)
                ?? throw new RuntimeException("Órgão {$sigla} não encontrado para a unidade gestora {$name}.");

            UnidadeGestora::updateOrCreate(
                ['nome' => $name],
                ['orgao_id' => $orgao->id],
            );
        }
    }

    /**
     * @param  class-string<Model>  $modelClass
     * @param  array<int, string>  $names
     */
    private function seedNames(string $modelClass, array $names): void
    {
        foreach ($names as $name) {
            $modelClass::updateOrCreate(['nome' => $name]);
        }
    }

    private function seedOrgaosProgramas(): void
    {
        $orgaos = Orgao::query()->orderBy('id')->get();

        foreach (Programa::query()->orderBy('id')->get() as $index => $programa) {
            $programa->orgaos()->syncWithoutDetaching([
                $orgaos[$index % $orgaos->count()]->id,
                $orgaos[($index + 1) % $orgaos->count()]->id,
            ]);
        }
    }

    /**
     * @param  array<int, string>  $objetosContrato
     */
    private function seedOrcamentos(
        int $quantidadeOrcamentos,
        int $quantidadeContratos,
        array $objetosContrato,
    ): void {
        $unidadesGestoras = UnidadeGestora::query()->orderBy('id')->get();
        $acoes = Acao::query()->with('programa')->orderBy('id')->get();
        $subfuncoes = Subfuncao::query()->orderBy('id')->get();
        $naturezasDespesa = NaturezaDespesa::query()->orderBy('id')->get();
        $fontesRecurso = FonteRecurso::query()->orderBy('id')->get();
        $revisorId = User::query()
            ->where('email', 'analista@seplag.rj.gov.br')
            ->value('id');

        if (
            $unidadesGestoras->isEmpty()
            || $acoes->isEmpty()
            || $subfuncoes->isEmpty()
            || $naturezasDespesa->isEmpty()
            || $fontesRecurso->isEmpty()
        ) {
            throw new RuntimeException('Dimensões insuficientes para criar os orçamentos.');
        }

        $casosEspeciais = [
            [1000000, 100000, 50000, 800000, 700000, 600000],
            [750000, 50000, 25000, 600000, 500000, 550000],
            [500000, 0, 10000, 550000, 530000, 500000],
            [900000, null, 30000, 400000, 350000, null],
            [1200000, 150000, 100000, 950000, 900000, 850000],
            [300000, 25000, 0, 200000, 210000, 180000],
            [null, 50000, 10000, 100000, 80000, 70000],
            [2000000, 0, 200000, 1500000, 1400000, 1300000],
            [450000, 50000, 25000, null, null, null],
            [650000, 100000, 50000, 700000, 680000, 660000],
            [400000, 0, 0, 0, 0, 0],
        ];

        if ($quantidadeOrcamentos < count($casosEspeciais)) {
            throw new RuntimeException('A quantidade de orçamentos deve comportar todos os casos especiais.');
        }

        $orcamentos = collect();
        $chavesUtilizadas = [];
        $cursorCombinacoes = 0;

        for ($index = 0; $index < $quantidadeOrcamentos; $index++) {
            if ($index < count($casosEspeciais)) {
                $ano = 2026;
                $acao = $acoes[$index % $acoes->count()];
                $unidadeGestora = $unidadesGestoras[$index % $unidadesGestoras->count()];
                $subfuncao = $subfuncoes[$index % $subfuncoes->count()];
                $naturezaDespesa = $naturezasDespesa[$index % $naturezasDespesa->count()];
                $fonteRecurso = $fontesRecurso[$index % $fontesRecurso->count()];
                $valor = $casosEspeciais[$index];
            } else {
                do {
                    $combinacao = $this->budgetCombination(
                        $cursorCombinacoes++,
                        $unidadesGestoras->count(),
                        $acoes->count(),
                        $subfuncoes->count(),
                        $naturezasDespesa->count(),
                        $fontesRecurso->count(),
                    );

                    $ano = $combinacao['ano'];
                    $acao = $acoes[$combinacao['acao']];
                    $unidadeGestora = $unidadesGestoras[$combinacao['unidade_gestora']];
                    $subfuncao = $subfuncoes[$combinacao['subfuncao']];
                    $naturezaDespesa = $naturezasDespesa[$combinacao['natureza_despesa']];
                    $fonteRecurso = $fontesRecurso[$combinacao['fonte_recurso']];
                    $chave = $this->budgetKey(
                        $ano,
                        $unidadeGestora->id,
                        $acao->id,
                        $subfuncao->id,
                        $naturezaDespesa->id,
                        $fonteRecurso->id,
                    );
                } while (isset($chavesUtilizadas[$chave]));

                $valor = $this->generatedBudgetValues($index);
            }

            $chave = $this->budgetKey(
                $ano,
                $unidadeGestora->id,
                $acao->id,
                $subfuncao->id,
                $naturezaDespesa->id,
                $fonteRecurso->id,
            );
            $chavesUtilizadas[$chave] = true;

            $acao->programa->orgaos()->syncWithoutDetaching([$unidadeGestora->orgao_id]);

            $orcamentos->push(Orcamento::updateOrCreate(
                [
                    'ano' => $ano,
                    'unidade_gestora_id' => $unidadeGestora->id,
                    'acao_id' => $acao->id,
                    'subfuncao_id' => $subfuncao->id,
                    'natureza_despesa_id' => $naturezaDespesa->id,
                    'fonte_recurso_id' => $fonteRecurso->id,
                ],
                [
                    'programa_id' => $acao->programa_id,
                    'dotacao_inicial' => $valor[0],
                    'suplementacoes' => $valor[1],
                    'anulacoes' => $valor[2],
                    'valor_empenhado' => $valor[3],
                    'valor_liquidado' => $valor[4],
                    'valor_pago' => $valor[5],
                    'situacao' => $this->situacaoOrcamento($valor),
                    'revisado_por' => $index < 3 ? $revisorId : null,
                    'revisado_em' => $index < 3 && $revisorId !== null ? '2026-07-07 09:00:00' : null,
                ],
            ));
        }

        $this->seedContratos($orcamentos->all(), $quantidadeContratos, $objetosContrato);
    }

    /**
     * @return array{ano: int, unidade_gestora: int, acao: int, subfuncao: int, natureza_despesa: int, fonte_recurso: int}
     */
    private function budgetCombination(
        int $cursor,
        int $unidadesGestoras,
        int $acoes,
        int $subfuncoes,
        int $naturezasDespesa,
        int $fontesRecurso,
    ): array {
        $ano = 2022 + ($cursor % 5);
        $cursor = intdiv($cursor, 5);
        $acao = $cursor % $acoes;
        $cursor = intdiv($cursor, $acoes);
        $unidadeGestora = $cursor % $unidadesGestoras;
        $cursor = intdiv($cursor, $unidadesGestoras);
        $subfuncao = $cursor % $subfuncoes;
        $cursor = intdiv($cursor, $subfuncoes);
        $naturezaDespesa = $cursor % $naturezasDespesa;
        $cursor = intdiv($cursor, $naturezasDespesa);

        return [
            'ano' => $ano,
            'unidade_gestora' => $unidadeGestora,
            'acao' => $acao,
            'subfuncao' => $subfuncao,
            'natureza_despesa' => $naturezaDespesa,
            'fonte_recurso' => $cursor % $fontesRecurso,
        ];
    }

    private function budgetKey(
        int $ano,
        int $unidadeGestoraId,
        int $acaoId,
        int $subfuncaoId,
        int $naturezaDespesaId,
        int $fonteRecursoId,
    ): string {
        return implode(':', [
            $ano,
            $unidadeGestoraId,
            $acaoId,
            $subfuncaoId,
            $naturezaDespesaId,
            $fonteRecursoId,
        ]);
    }

    /**
     * @return array{0: int, 1: int, 2: int, 3: int, 4: int, 5: int}
     */
    private function generatedBudgetValues(int $index): array
    {
        $dotacaoInicial = 250000 + (($index * 7919) % 4750000);
        $suplementacoes = $index % 7 === 0 ? (int) round($dotacaoInicial * 0.12) : 0;
        $anulacoes = $index % 11 === 0 ? (int) round($dotacaoInicial * 0.05) : 0;
        $dotacaoAtualizada = $dotacaoInicial + $suplementacoes - $anulacoes;

        $percentuaisExecucao = [0.18, 0.35, 0.52, 0.68, 0.79, 0.88, 0.96];
        $percentualExecucao = $percentuaisExecucao[$index % count($percentuaisExecucao)];

        if ($index % 41 === 0) {
            $percentualExecucao = 0;
        } elseif ($index % 29 === 0) {
            $percentualExecucao = 1.06;
        }

        $valorEmpenhado = (int) round($dotacaoAtualizada * $percentualExecucao);
        $valorLiquidado = (int) round($valorEmpenhado * (0.72 + (($index % 4) * 0.06)));
        $valorPago = (int) round($valorLiquidado * (0.78 + (($index % 3) * 0.07)));

        return [
            $dotacaoInicial,
            $suplementacoes,
            $anulacoes,
            $valorEmpenhado,
            $valorLiquidado,
            $valorPago,
        ];
    }

    /**
     * @param  array{0: int|null, 1: int|null, 2: int|null, 3: int|null, 4: int|null, 5: int|null}  $valor
     */
    private function situacaoOrcamento(array $valor): string
    {
        if (
            in_array(null, $valor, true)
            || $valor[5] > $valor[4]
            || $valor[4] > $valor[3]
        ) {
            return 'inconsistente';
        }

        $dotacaoAtualizada = $valor[0] + $valor[1] - $valor[2];

        if ($valor[3] > $dotacaoAtualizada) {
            return 'saldo_negativo';
        }

        if ($valor[3] === 0) {
            return 'sem_execucao';
        }

        $percentualExecucao = $dotacaoAtualizada === 0
            ? 0
            : ($valor[3] / $dotacaoAtualizada) * 100;

        return $percentualExecucao >= 98
            ? 'executado'
            : 'em_execucao';
    }

    /**
     * @param  array<int, Orcamento>  $orcamentos
     * @param  array<int, string>  $objetosContrato
     */
    private function seedContratos(
        array $orcamentos,
        int $quantidadeContratos,
        array $objetosContrato,
    ): void {
        $fornecedores = Fornecedor::query()->orderBy('id')->get();

        if ($fornecedores->isEmpty() || $orcamentos === [] || $objetosContrato === []) {
            throw new RuntimeException('Dados insuficientes para criar os contratos.');
        }

        for ($index = 0; $index < $quantidadeContratos; $index++) {
            $inicio = new DateTimeImmutable(sprintf(
                '%d-%02d-%02d',
                2024 + ($index % 3),
                ($index % 12) + 1,
                ($index % 20) + 1,
            ));
            $fim = $inicio->modify(sprintf('+%d months', 6 + ($index % 25)));
            $status = match (true) {
                $index % 10 === 0 => 'suspenso',
                $fim < new DateTimeImmutable('2026-07-10') => 'encerrado',
                default => 'vigente',
            };

            Contrato::updateOrCreate(
                ['numero' => sprintf('CT-2026-%03d', $index + 1)],
                [
                    'objeto' => $objetosContrato[$index % count($objetosContrato)],
                    'valor' => 75000 + (($index * 37691) % 925000),
                    'status' => $status,
                    'vigencia_inicio' => $inicio->format('Y-m-d'),
                    'vigencia_fim' => $fim->format('Y-m-d'),
                    'orcamento_id' => $orcamentos[$index % count($orcamentos)]->id,
                    'fornecedor_id' => $fornecedores[$index % $fornecedores->count()]->id,
                ],
            );
        }
    }
}
