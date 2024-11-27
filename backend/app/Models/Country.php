<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    use HasFactory;

    // Define the table associated with the model

    // Specify the fields that can be mass assigned
    protected $fillable = ['id', 'subregion', 'iso2', 'name', 'status', 'phone_code', 'iso3', 'region'];


}
