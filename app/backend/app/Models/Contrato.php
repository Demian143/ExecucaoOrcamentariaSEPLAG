<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contrato extends Model
{
    protected $table = 'contratos';

    protected $fillable = [
        'numero',
        'objeto',
        'valor',
        'status',
        'vigencia_inicio',
        'vigencia_fim',
        'orcamento_id',
        'fornecedor_id',
    ];

    public function orcamento(): BelongsTo
    {
        return $this->belongsTo(Orcamento::class);
    }

    public function fornecedor(): BelongsTo
    {
        return $this->belongsTo(Fornecedor::class);
    }

    protected function vencido(): Attribute
    {
        return Attribute::make(
            get: function (): bool {
                $vigenciaFim = $this->getAttribute('vigencia_fim');

                return $this->status !== 'encerrado'
                    && $vigenciaFim instanceof CarbonInterface
                    && $vigenciaFim->isPast();
            },
        );
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'valor' => 'decimal:2',
            'vigencia_inicio' => 'date',
            'vigencia_fim' => 'date',
        ];
    }
}
