<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Number;

class Transaction extends Model
{
    use HasFactory;

    public const STAT_FAILED = 0;
    public const STAT_PROCESS = 1;
    public const STAT_SUCCCESS = 2;
    public const STAT_WAITING_PAYMENT = 3;

    public $appends = ['created_at_formatted'];
    public $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(MstProduct::class, 'mst_product_id');
    }

    public function getPriceAttribute()
    {
        return Number::currency($this->attributes['price'], 'IDR', 'id');
    }

    public function getCreatedAtFormattedAttribute()
    {
        return Carbon::parse($this->attributes['created_at'])->translatedFormat('l, d F Y H:i');
    }
}
