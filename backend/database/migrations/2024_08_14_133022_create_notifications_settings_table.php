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
        Schema::create('notifications_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('CASCADE');
            $table->enum('company_news', ['true', 'false'])->default('false');
            $table->enum('account_activity', ['true', 'false'])->default('true');
            $table->enum('meetups', ['true', 'false'])->default('false');
            $table->enum('new_messages', ['true', 'false'])->default('true');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications_settings');
    }
};
