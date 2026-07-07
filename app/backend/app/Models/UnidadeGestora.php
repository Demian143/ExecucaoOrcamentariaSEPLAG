<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnidadeGestora extends Model
{
    protected $table = 'unidades_gestoras';
    protected $fillable = [
        'nome', 
        'orgao_id'
        ];
}
