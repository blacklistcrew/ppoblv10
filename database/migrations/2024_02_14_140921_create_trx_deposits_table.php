<?php

use App\Models\TrxDeposit;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trx_deposits', function (Blueprint $table) {
            $table->id();
            $table->double('nominal')->default(0);
            $table->text('note')->nullable();
            $table->string('image')->nullable();
            $table->string('bank');
            $table->string('account_number');
            $table->unsignedTinyInteger('status')->default(TrxDeposit::STAT_WAITING_PAYMENT);
            $table->foreignIdFor(User::class);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trx_deposits');
    }
};
