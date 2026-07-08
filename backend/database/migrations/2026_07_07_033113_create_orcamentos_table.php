<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orcamentos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('ano');
            // Quem gasta
            $table->foreignId('unidade_gestora_id')->constrained('unidades_gestoras');
            // Para que
            $table->foreignId('programa_id')->constrained('programas');
            $table->foreignId('acao_id')->constrained('acoes');
            $table->foreignId('subfuncao_id')->constrained('subfuncoes');
            // Com o quê
            $table->foreignId('natureza_despesa_id')->constrained('naturezas_despesa');
            // De onde
            $table->foreignId('fonte_recurso_id')->constrained('fontes_recurso');
            // Valores
            $table->decimal('dotacao_inicial', 15, 2)->nullable();
            $table->decimal('suplementacoes', 15, 2)->nullable();
            $table->decimal('anulacoes', 15, 2)->nullable();
            $table->decimal('valor_empenhado', 15, 2)->nullable();
            $table->decimal('valor_liquidado', 15, 2)->nullable();
            $table->decimal('valor_pago', 15, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orcamentos');
    }
};
