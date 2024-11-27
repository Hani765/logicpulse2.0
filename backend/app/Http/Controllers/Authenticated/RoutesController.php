<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Routes; // Make sure this matches your model name
use Illuminate\Support\Facades\Auth;

class RoutesController extends Controller
{
    public function getRoutes()
    {
        $user = Auth::user();
        $role = $user->role;

        // Retrieve all active routes
        $routes = Routes::where('status', 'active')->get();

        // Filter routes based on the role and permissions
        $filteredRoutes = $routes->filter(function ($route) use ($role) {
            $permissions = $route->{$role . '_permissions'};
            $permissions = json_decode($permissions, true);
            return isset($permissions['read']) && $permissions['read'];
        });

        return response()->json($filteredRoutes);
    }
}
