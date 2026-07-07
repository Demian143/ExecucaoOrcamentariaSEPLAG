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
        Schema::create('contratos', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('numero')->unique();
            $table->string('objeto');
            $table->decimal('valor', 15, 2);
            $table->enum('status', ['vigente', 'encerrado', 'suspenso'])->default('vigente');
            $table->date('vigencia_inicio');
            $table->date('vigencia_fim');

            $table->foreignId('orcamento_id')->constrained('orcamentos');
            $table->foreignId('fornecedor_id')->constrained('fornecedores');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contratos');
    }
};
