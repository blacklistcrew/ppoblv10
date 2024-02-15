<?php

use App\Models\MstBrand;
use App\Models\MstCategory;
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
        Schema::create('mst_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code');
            $table->double('price');
            $table->text('desc');
            $table->tinyInteger('status');
            $table->foreignIdFor(MstCategory::class)->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignIdFor(MstBrand::class)->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mst_products');
    }
};
