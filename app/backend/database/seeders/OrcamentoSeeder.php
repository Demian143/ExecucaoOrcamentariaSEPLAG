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
         *     fornecedores: array<int, string>
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
        $this->seedOrcamentos();
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

    private function seedOrcamentos(): void
    {
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

        $valores = [
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

        $orcamentos = collect();

        foreach ($valores as $index => $valor) {
            $acao = $acoes[$index % $acoes->count()];
            $unidadeGestora = $unidadesGestoras[$index % $unidadesGestoras->count()];
            $subfuncao = $subfuncoes[$index % $subfuncoes->count()];
            $naturezaDespesa = $naturezasDespesa[$index % $naturezasDespesa->count()];
            $fonteRecurso = $fontesRecurso[$index % $fontesRecurso->count()];

            $acao->programa->orgaos()->syncWithoutDetaching([$unidadeGestora->orgao_id]);

            $orcamentos->push(Orcamento::updateOrCreate(
                [
                    'ano' => 2026,
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

        $this->seedContratos($orcamentos->all());
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
     */
    private function seedContratos(array $orcamentos): void
    {
        $fornecedores = Fornecedor::query()->orderBy('id')->get();

        if ($fornecedores->isEmpty()) {
            throw new RuntimeException('Nenhum fornecedor disponível para criar os contratos.');
        }

        $contratos = [
            ['CT-2026-001', 'Manutenção de instalações públicas', 250000, 'vigente', '2025-01-01', '2025-12-31'],
            ['CT-2026-002', 'Fornecimento de equipamentos', 480000, 'encerrado', '2025-02-01', '2025-11-30'],
            ['CT-2026-003', 'Serviços especializados de tecnologia', 320000, 'suspenso', '2026-01-01', '2026-12-31'],
            ['CT-2026-004', 'Aquisição de insumos', 175000, 'vigente', '2026-03-01', '2027-02-28'],
        ];

        foreach ($contratos as $index => $contrato) {
            Contrato::updateOrCreate(
                ['numero' => $contrato[0]],
                [
                    'objeto' => $contrato[1],
                    'valor' => $contrato[2],
                    'status' => $contrato[3],
                    'vigencia_inicio' => $contrato[4],
                    'vigencia_fim' => $contrato[5],
                    'orcamento_id' => $orcamentos[$index]->id,
                    'fornecedor_id' => $fornecedores[$index % $fornecedores->count()]->id,
                ],
            );
        }
    }
}
