<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class MstProduct extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['created_at', 'updated_at'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(MstCategory::class, 'mst_category_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(MstBrand::class, 'mst_brand_id');
    }

    public function products():HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
