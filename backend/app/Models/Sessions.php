<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sessions extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'ip_address',
        'device',
        'device_type',
        'platform',
        'platform_version',
        'browser',
        'browser_version',
        'is_robot',
        'country',
        'country_code',
        'state',
        'city',
        'postal',
        'latitude',
        'longitude',
        'isp',
        'user_agent',
        'payload',
        'last_activity',
    ];

    protected $casts = [
        'id' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
