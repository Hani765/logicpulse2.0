<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClickDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'click_id',
        'offer_id',
        'network_id',
        'tracker_id',
        'domain_id',
        'rate',
        'user_id',
        'manager_id',
        'admin_id',
        'ip_address',
        'source_id',
        'country',
        'city',
        'device',
        'device_version',
        'browser',
        'version',
        'status',
    ];

    /**
     * Relationship with the Click model
     */
    public function click()
    {
        return $this->belongsTo(Click::class, 'click_id', 'id');
    }
}
