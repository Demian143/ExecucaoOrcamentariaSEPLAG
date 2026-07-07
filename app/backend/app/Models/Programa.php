<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programa extends Model
{
    protected $table = 'programas';

    protected $fillable = [
        'nome',
        'codigo',
    ];

    public function orgaos(): BelongsToMany
    {
        return $this->belongsToMany(Orgao::class, 'orgao_programa')->withTimestamps();
    }

    public function acoes(): HasMany
    {
        return $this->hasMany(Acao::class);
    }

    public function orcamentos(): HasMany
    {
        return $this->hasMany(Orcamento::class);
    }
}
