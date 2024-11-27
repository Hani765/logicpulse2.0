<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RouteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {

        echo "Running RouteSeeder...\n";
        DB::table('routes')->insert([
            [
                'name' => 'Dashboard',
                'url' => '/dashboard',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Market Place',
                'url' => '/dashboard/market-place',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Offers',
                'url' => '/dashboard/offers',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Reports',
                'url' => '/dashboard/filters',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Clicks Report',
                'url' => '/dashboard/filters/clicks',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Conversions Report',
                'url' => '/dashboard/filters/conversions',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Offer Report',
                'url' => '/dashboard/filters/offers-report',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'User Report',
                'url' => '/dashboard/filters/user-report',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => true, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Users',
                'url' => '/dashboard/users',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'user_permissions' => json_encode(['create' => false, 'read' => false, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Trackers',
                'url' => '/dashboard/trackers',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => false, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Networks',
                'url' => '/dashboard/networks',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => false, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Domains',
                'url' => '/dashboard/domains',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => false, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => false, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Sources',
                'url' => '/dashboard/sources',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => false]),
                'user_permissions' => json_encode(['create' => false, 'read' => false, 'update' => false, 'delete' => false]),
                'status' => 'active',
            ],
            [
                'name' => 'Settings',
                'url' => '/settings/profile',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'user_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'status' => 'active',
            ],
            [
                'name' => 'Messages',
                'url' => '/messages',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'user_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'status' => 'active',
            ],
            [
                'name' => 'Notifications',
                'url' => '/notifications',
                'admin_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'manager_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'user_permissions' => json_encode(['create' => true, 'read' => true, 'update' => true, 'delete' => true]),
                'status' => 'active',
            ],
        ]);

        echo "RouteSeeder completed.\n";
    }
}