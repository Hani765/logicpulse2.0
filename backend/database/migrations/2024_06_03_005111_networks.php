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
        Schema::create('networks', function (Blueprint $table) {
            $table->id();
            $table->string('unique_id')->index();
            $table->string('user_id')->index();
            $table->string('tracker_id')->index();
            $table->string('name')->index();
            $table->enum('status', ['active', 'pause', 'inactive'])->default('active');
            $table->timestamps();

            // Adding foreign key constraint with ON DELETE CASCADE
            $table->foreign('user_id')->references('unique_id')->on('users')->onDelete('cascade');
            $table->foreign('tracker_id')->references('unique_id')->on('trackers')->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('networks');
    }
};
