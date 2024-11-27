<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Network extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "unique_id",
        "name",
        "tracker_id"
    ];

    public function tracker()
    {
        return $this->belongsTo(Tracker::class, 'tracker_id', 'unique_id');
    }
}
