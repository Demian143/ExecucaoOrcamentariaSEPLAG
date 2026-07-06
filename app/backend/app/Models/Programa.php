<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Programa extends Model
{
    protected $table = 'programas';
    protected $fillable = [
        'nome',
        'codigo'
    ];
}
