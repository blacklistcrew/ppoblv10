<?php

use App\Models\MstProduct;
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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('code');
            $table->string('product_name');
            $table->double('price');
            $table->string('target')->nullable();
            $table->string('mtrpln')->nullable();
            $table->text('note')->nullable();
            $table->text('token')->nullable();
            $table->unsignedInteger('sequence_id')->nullable();
            $table->unsignedTinyInteger('status');
            $table->json('api_response');
            $table->foreignIdFor(MstProduct::class)->constrained()->cascadeOnUpdate()->restrictOnDelete();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
