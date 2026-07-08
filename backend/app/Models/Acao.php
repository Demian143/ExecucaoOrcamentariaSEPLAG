<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Acao extends Model
{
    protected $table = 'acoes';

    protected $fillable = [
        'nome',
        'codigo',
        'programa_id',
    ];

    public function programa(): BelongsTo
    {
        return $this->belongsTo(Programa::class);
    }

    public function orcamentos(): HasMany
    {
        return $this->hasMany(Orcamento::class);
    }
}
