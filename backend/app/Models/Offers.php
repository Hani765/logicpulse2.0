<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offers extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'offers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'unique_id',
        'user_id',
        'title',
        'description',
        'keywords',
        'image',
        'age',
        'rate',
        'encryption',
        'network_id',
        'category_id',
        'domain_id',
        'countries',
        'urls',
        'proxy',
        'status',
        'appliableFor',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'offer_user', 'offer_unique_ids', 'user_unique_id', 'unique_id', 'unique_id');
    }

    // Accessor to decode 'urls' field when retrieving from database
    public function getUrlsAttribute($value)
    {
        return json_decode($value, true);
    }
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
