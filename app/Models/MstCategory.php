<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MstCategory extends Model
{
    use HasFactory;

    public const TYPE_BPJS = 'bpjs-kesehatan';
    public const TYPE_INTERNET_POSTPAID = 'internet-pascabayar';
    public const TYPE_PDAM = 'pdam';
    public const TYPE_GAS_POSTPAID = 'gas-negara';
    public const TYPE_PLN_POSTPAID = 'pln-pascabayar';
    public const TYPE_DATA = 'data';
    public const TYPE_PULSE = 'pulsa';
    public const TYPE_EMONEY = 'e-money';
    public const TYPE_GAME = 'games';
    public const TYPE_PLN = 'pln';
    public const TYPE_ACTIVE_PERIOD = 'masa-aktif';
    public const TYPE_VOUCHER = 'voucher';

    protected $guarded = ['created_at', 'updated_at'];

    public function brands(): HasMany
    {
        return $this->hasMany(MstBrand::class);
    }

    public function products(): HasMany
    {
        return $this->hasMany(MstProduct::class);
    }
}
