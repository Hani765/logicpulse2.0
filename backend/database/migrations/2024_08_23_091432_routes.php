<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('url');
            $table->json('admin_permissions')->nullable();   // JSON field for admin permissions
            $table->json('manager_permissions')->nullable(); // JSON field for manager permissions
            $table->json('user_permissions')->nullable();    // JSON field for user permissions
            $table->enum('status', ['active', 'inactive', 'pause', 'blocked'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};