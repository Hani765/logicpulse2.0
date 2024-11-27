<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationsSettings extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'company_news',
        'account_activity',
        'meetups',
        'new_messages',
    ];
}
