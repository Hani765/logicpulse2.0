<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = [
        "type",
        "username",
        "message",
        "user_ids",
        "roles",
        "in_view",
        "read_at",
    ];
}
