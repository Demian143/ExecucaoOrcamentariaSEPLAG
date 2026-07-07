<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Orcamento extends Model
{
    protected $table = 'orcamentos';

    protected $fillable = [
        'ano',
        'unidade_gestora_id',
        'programa_id',
        'acao_id',
        'subfuncao_id',
        'natureza_despesa_id',
        'fonte_recurso_id',
        'dotacao_inicial',
        'dotacao_atualizada',
        'valor_empenhado',
        'valor_liquidado',
        'valor_pago',
        'revisado_por',
        'revisado_em',
    ];

    public function unidadeGestora(): BelongsTo
    {
        return $this->belongsTo(UnidadeGestora::class);
    }

    public function programa(): BelongsTo
    {
        return $this->belongsTo(Programa::class);
    }

    public function acao(): BelongsTo
    {
        return $this->belongsTo(Acao::class);
    }

    public function subfuncao(): BelongsTo
    {
        return $this->belongsTo(Subfuncao::class);
    }

    public function naturezaDespesa(): BelongsTo
    {
        return $this->belongsTo(NaturezaDespesa::class);
    }

    public function fonteRecurso(): BelongsTo
    {
        return $this->belongsTo(FonteRecurso::class);
    }

    public function revisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'revisado_por');
    }

    public function contratos(): HasMany
    {
        return $this->hasMany(Contrato::class);
    }

    protected function saldo(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->dotacao_atualizada - $this->valor_empenhado,
        );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'ano' => 'integer',
            'dotacao_inicial' => 'decimal:2',
            'dotacao_atualizada' => 'decimal:2',
            'valor_empenhado' => 'decimal:2',
            'valor_liquidado' => 'decimal:2',
            'valor_pago' => 'decimal:2',
            'revisado_em' => 'datetime',
        ];
    }
}
