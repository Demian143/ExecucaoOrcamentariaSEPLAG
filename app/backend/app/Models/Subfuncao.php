<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subfuncao extends Model
{
    protected $table = 'subfuncoes';

    protected $fillable = ['nome', 'funcao_id'];

    public function funcao(): BelongsTo
    {
        return $this->belongsTo(Funcao::class);
    }
}
