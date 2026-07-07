<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Orgao extends Model
{
    protected $table = 'orgaos';

    protected $fillable = ['nome', 'sigla', 'status'];

    public function unidadesGestoras(): HasMany
    {
        return $this->hasMany(UnidadeGestora::class);
    }

    public function programas(): BelongsToMany
    {
        return $this->belongsToMany(Programa::class, 'orgao_programa')->withTimestamps();
    }
}
