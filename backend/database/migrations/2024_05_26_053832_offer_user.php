<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('offer_user', function (Blueprint $table) {
            $table->id();
            $table->string('user_unique_id');
            $table->longText('offer_unique_ids')->nullable(); // Long text to store multiple offer IDs
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_unique_id')->references('unique_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('offer_user');
    }
};
