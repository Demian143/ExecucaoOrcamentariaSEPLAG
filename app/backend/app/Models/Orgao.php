<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Orgao extends Model
{
    protected $table = 'orgaos';
    protected $fillable = ['nome', 'sigla'];
}
