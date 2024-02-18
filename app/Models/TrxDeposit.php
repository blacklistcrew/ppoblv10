<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrxDeposit extends Model
{
    public const STAT_FAILED = 0;
    public const STAT_WAITING_APPROVAL = 1;
    public const STAT_SUCCCESS = 2;
    public const STAT_WAITING_PAYMENT = 3;

    use HasFactory;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
