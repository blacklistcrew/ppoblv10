<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    public const STAT_FAILED = 0;
    public const STAT_PROCESS = 1;
    public const STAT_SUCCCESS = 2;
    public const STAT_WAITING_PAYMENT = 3;

    public $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(MstProduct::class, 'mst_product_id');
    }

}
