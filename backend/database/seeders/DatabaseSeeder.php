<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Click;
use App\Models\Conversion;
use App\Models\Domain;
use App\Models\Network;
use App\Models\Notification;
use App\Models\Offers;
use App\Models\Tracker;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Network::factory(100)->create();
        // Tracker::factory(100)->create();
        // Domain::factory(1000)->create();
        Offers::factory(100)->create();
        // Click::factory(1000)->create();
        // Category::factory(100)->create();
        // Conversion::factory(1000)->create();
        // User::factory(100)->create();
        // Notification::factory(50)->create();
    }
}
