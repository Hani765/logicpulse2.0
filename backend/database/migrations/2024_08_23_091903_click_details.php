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
        Schema::create("click_details", function (Blueprint $table) {
            $table->foreignId('click_id')->constrained()->on('clicks')->onDelete('CASCADE');
            $table->string('offer_id')->index();
            $table->string('network_id')->index();
            $table->string('tracker_id')->index();
            $table->string('domain_id')->index();
            $table->string('user_id')->index();
            $table->string('manager_id')->nullable()->index();
            $table->string('admin_id')->nullable()->index();
            $table->string('rate')->nullable()->index();
            $table->string('ip_address')->nullable()->index();
            $table->string('source_id')->index()->nullable();
            $table->string('country')->nullable()->index();
            $table->string('city')->nullable();
            $table->string('device')->nullable()->index();
            $table->string('device_version')->nullable()->index();
            $table->string('browser')->nullable();
            $table->string('version')->nullable();
            $table->string('user_agent')->nullable();
            $table->enum("status", ['pending', 'approved', 'rejected', 'blocked'])->default('pending');
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('click_details');
    }
};
