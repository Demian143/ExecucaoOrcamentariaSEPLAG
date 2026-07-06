<?php

namespace Database\Seeders;

use App\Models\Acao;
use App\Models\FonteRecurso;
use App\Models\Fornecedor;
use App\Models\Funcao;
use App\Models\NaturezaDespesa;
use App\Models\Orgao;
use App\Models\Programa;
use App\Models\UnidadeGestora;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use RuntimeException;

class DadosReferenciaSeeder extends Seeder
{
    use WithoutModelEvents;

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
                ['nome' => $orgao['nome']],
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
            Funcao::updateOrCreate(
                ['codigo' => $funcao['codigo']],
                [
                    'nome' => $funcao['nome'],
                    'subfuncoes' => json_encode($funcao['subfuncoes'], JSON_THROW_ON_ERROR),
                ],
            );
        }

        $this->seedNames(NaturezaDespesa::class, $dados['naturezas_despesa']);
        $this->seedNames(FonteRecurso::class, $dados['fontes_recurso']);
        $this->seedNames(UnidadeGestora::class, $dados['unidades_gestoras_exemplos']);
        $this->seedNames(Fornecedor::class, $dados['fornecedores']);
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
}
