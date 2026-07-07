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
        Schema::table('unidades_gestoras', function (Blueprint $table) {
            $table->foreignId('orgao_id')->after('nome')->constrained('orgaos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('unidades_gestoras', function (Blueprint $table) {
            $table->dropForeign(['orgao_id']);
            $table->dropColumn('orgao_id');
        });
    }
};
