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
        'suplementacoes',
        'anulacoes',
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
            get: fn (): float => $this->dotacao_atualizada - $this->monetaryValue('valor_empenhado'),
        );
    }

    protected function dotacaoAtualizada(): Attribute
    {
        return Attribute::make(
            get: fn (): float => $this->monetaryValue('dotacao_inicial')
                + $this->monetaryValue('suplementacoes')
                - $this->monetaryValue('anulacoes'),
        );
    }

    protected function percentualExecucao(): Attribute
    {
        return Attribute::make(
            get: fn (): ?float => $this->dotacao_atualizada == 0.0
                ? null
                : ($this->monetaryValue('valor_empenhado') / $this->dotacao_atualizada) * 100,
        );
    }

    protected function inconsistente(): Attribute
    {
        return Attribute::make(
            get: fn (): bool => $this->hasNullMonetaryValue()
                || $this->monetaryValue('valor_pago') > $this->monetaryValue('valor_liquidado')
                || $this->monetaryValue('valor_liquidado') > $this->monetaryValue('valor_empenhado')
                || $this->monetaryValue('valor_empenhado') > $this->dotacao_atualizada,
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
            'suplementacoes' => 'decimal:2',
            'anulacoes' => 'decimal:2',
            'valor_empenhado' => 'decimal:2',
            'valor_liquidado' => 'decimal:2',
            'valor_pago' => 'decimal:2',
            'revisado_em' => 'datetime',
        ];
    }

    private function monetaryValue(string $attribute): float
    {
        return (float) ($this->getAttribute($attribute) ?? 0);
    }

    private function hasNullMonetaryValue(): bool
    {
        foreach ([
            'dotacao_inicial',
            'suplementacoes',
            'anulacoes',
            'valor_empenhado',
            'valor_liquidado',
            'valor_pago',
        ] as $attribute) {
            if ($this->getAttribute($attribute) === null) {
                return true;
            }
        }

        return false;
    }
}
