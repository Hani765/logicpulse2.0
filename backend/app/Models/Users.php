<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    protected $fillable = [
        'name',
        'unique_id',
        'username',
        'email',
        'password',
        'role',
        'manager_id',
        'admin_id',
        'domain_id',
        'rate',
        'phone',
        'skype',
        'details',
        'age',
        'dob',
        'country',
        'city',
        'province',
        'time_zone',
        'email_verification_token',
        'profile_image',
        'status',
        'notification',
        'isVerified',
        'email_verified_at',
    ];
    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id', 'unique_id');
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id', 'unique_id');
    }
    use HasFactory;
}
