<?php

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
        Schema::create('mst_brands', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('prefix')->nullable();
            $table->foreignIdFor(MstCategory::class)->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->tinyInteger('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mst_brands');
    }
};
