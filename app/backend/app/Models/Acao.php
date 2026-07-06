<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Acao extends Model
{
    protected $table = 'acoes';
    protected $fillable = [
        'nome',
        'codigo',
        'programa_id'
    ];
}
