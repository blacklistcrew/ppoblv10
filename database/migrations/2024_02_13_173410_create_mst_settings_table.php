<?php

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
        Schema::create('mst_settings', function (Blueprint $table) {
            $table->id();
            $table->double('balance')->default(0);
            $table->unsignedTinyInteger('status')->default(1);
            $table->string('logo')->nullable();
            $table->string('bank')->nullable();
            $table->string('account_number')->nullable();
            $table->string('api_username')->nullable();
            $table->string('api_dev_key')->nullable();
            $table->string('api_prod_key')->nullable();
            $table->string('api_secret')->nullable();
            $table->unsignedTinyInteger('use_prod')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mst_settings');
    }
};
