<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'unique_id',
        'first_name',
        'last_name',
        'username',
        'email',
        'provider',
        'provider_id',
        'password',
        'role',
        'manager_id',
        'admin_id',
        'domain_id',
        'rate',
        'phone',
        'skype',
        'whats_app',
        'details',
        'age',
        'dob',
        'gender',
        'country',
        'city',
        'province',
        'language',
        'time_zone',
        'email_verification_token',
        'profile_image',
        'status',
        'notification',
        'isVerified',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
