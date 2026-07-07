<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UnidadeGestora extends Model
{
    protected $table = 'unidades_gestoras';
    protected $fillable = [
        'nome', 
        'orgao_id'
        ];
    
    public function acoes(): HasMany
    {
        return $this->hasMany(Acao::class);
    }

    public function orgaos(): BelongsToMany
    {
        return $this->belongsToMany(Orgao::class, 'orgao_programa');
    }
}
