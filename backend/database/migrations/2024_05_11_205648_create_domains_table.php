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
        Schema::create('domains', function (Blueprint $table) {
            $table->id();
            $table->string('unique_id')->index();
            $table->string('user_id')->index();
            $table->string('name')->index();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->enum('visiblity', ['private', 'public'])->default('private');
            $table->timestamps();

            // Adding foreign key constraint with ON DELETE CASCADE
            $table->foreign('user_id')->references('unique_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('domains', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::dropIfExists('domains');
    }
};
