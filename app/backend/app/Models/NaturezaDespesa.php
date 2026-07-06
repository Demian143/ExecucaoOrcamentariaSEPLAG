<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NaturezaDespesa extends Model
{
    protected $table = 'naturezas_despesa';
    protected $fillable = [
        'nome'
    ];
}
