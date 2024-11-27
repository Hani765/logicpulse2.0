<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Country;
use App\Models\Domain;
use App\Models\language;
use App\Models\Network;
use App\Models\Offers;
use App\Models\Tracker;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;


class FetchController extends Controller
{
    public function fetchFilterAllUsers(Request $request)
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            $role = $user->role;
            $filter = $request->query('filter', 'all'); // Get the filter query parameter

            // Initialize the base query
            $query = User::select('unique_id', 'username')
                ->where('status', 'active');

            // Apply filtering based on the filter parameter and user role
            if ($filter === 'all') {
                // Show all active users, but exclude administrators
                $query->where('role', '!=', 'administrator');
            } elseif ($filter === 'admins') {
                // Show users who have the role 'admin' if the current user's role is 'administrator'
                if ($role === 'administrator') {
                    $query->where('role', 'admin');
                } else {
                    return response()->json(['error' => 'Access denied for admin users'], 403);
                }
            } elseif ($filter === 'managers') {
                // Show users who are managers if the user's role is not 'manager' or 'user'
                if ($role !== 'manager' && $role !== 'user') {
                    $query->where('role', 'manager');
                } else {
                    return response()->json(['error' => 'Access denied for managers and users'], 403);
                }
            } elseif ($filter === 'users') {
                // Show users associated with the current manager or admin
                if ($role === 'administrator') {
                    $query->where('role', 'user');
                } elseif ($role === 'manager') {
                    $query->where('role', 'user')->where('manager_id', $user->unique_id);
                } elseif ($role === 'admin') {
                    $query->where('role', 'user')->where('admin_id', $user->unique_id);
                } else {
                    return response()->json(['error' => 'Access denied for users'], 403);
                }
            } else {
                return response()->json(['error' => 'Invalid filter'], 400);
            }

            // Execute the query
            $users = $query->orderBy('username')->get();
            $response = [];
            foreach ($users as $user) {
                $response[] = [
                    'unique_id' => $user->unique_id,
                    'name' => $user->username,
                ];
            }

            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Something went wrong: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }


    public function fetchFilterOffers()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            $role = $user->role;

            // Initialize the base query
            if ($role === 'administrator') {
                // Fetch all offers for administrators
                $offersQuery = Offers::select('unique_id', 'title');
            } elseif ($role === 'admin') {
                // Fetch offers where the offer's user_id matches the user's unique_id
                $offersQuery = Offers::select('unique_id', 'title')->where('user_id', $user->unique_id);
            } else {
                $offerUser = DB::table('offer_user')->where('user_unique_id', $user->unique_id)->first();
                $offerUniqueIds = $offerUser ? explode(',', $offerUser->offer_unique_ids) : [];
                $offersQuery = Offers::select('unique_id', 'title')->whereIn('unique_id', $offerUniqueIds);
            }

            // Execute the query
            $offers = $offersQuery->orderBy('title')->get();
            $response = [];
            foreach ($offers as $offer) {
                $response[] = [
                    'unique_id' => $offer->unique_id,
                    'name' => $offer->title,
                ];
            }
            ;
            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Something went wrong: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }
    public function fetchFilterDomains()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            $role = $user->role;
            $domains = [];
            if ($role === "admin" || $role === "administrator") {

                $query = Domain::select('unique_id', 'name')->where('status', 'active');

                if ($role === 'administrator') {
                    // No additional filters for administrators
                } elseif ($role === 'admin') {
                    $query->where('user_id', $user->unique_id)->orWhere('visiblity', 'public');
                }

                // Execute the query
                $domains = $query->orderBy('unique_id')->get();
            } else {
                $domains = Domain::select('unique_id', 'name')->where('unique_id', $user->domain_id)->get();
            }

            return response()->json($domains);
        } catch (\Exception $e) {
            Log::error('Error fetching filter domains: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }

    public function fetchFilterNetworks()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            $role = $user->role;

            // Initialize the base query
            $query = Network::select('unique_id', 'name')->where('status', 'active');

            if ($role === 'administrator') {
                // No additional filters for administrators
            } elseif ($role === 'admin') {
                $query->where('user_id', $user->unique_id);
            } else {
                return response()->json(['error' => 'Access denied'], 403);
            }

            // Execute the query
            $network = $query->orderBy('unique_id')->get();  // Assuming 'unique_id' is a valid field to order by

            return response()->json($network);
        } catch (\Exception $e) {
            Log::error('Error fetching filter Network: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }
    public function fetchFilterTrackers()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            // Initialize the base query
            if ($user->role === 'administrator') {
                $query = Tracker::select('id', 'unique_id', 'name')->where('status', 'active');
            } elseif ($user->role === 'admin') {
                $query = Tracker::select('id', 'unique_id', 'name')->where('user_id', $user->unique_id)->where('status', 'active')->orWhere('visiblity', 'public');
            } else {
                // Invalid role, return error message
                return response()->json([
                    "message" => "Invalid role. You are not allowed to access this resource."
                ], 403);
            }
            // Execute the query
            $tracker = $query->orderBy('id')->get();

            return response()->json($tracker);
        } catch (\Exception $e) {
            Log::error('Error fetching filter Network: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }
    public function fetchFilterCategories()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            // Initialize the base query
            $query = Category::select('unique_id', 'name');
            // Execute the query
            $category = $query->orderBy('id')->get();

            return response()->json($category);
        } catch (\Exception $e) {
            Log::error('Error fetching filter Network: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }
    public function fetchFilterCountries()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            // Initialize the base query for countries
            $query = Country::select('name', 'iso2'); // Assuming 'network_id' is a field in the 'countries' table

            // Execute the query
            $countries = $query->orderBy('name')->get();  // Assuming 'name' is a valid field to order by
            $response = [];
            foreach ($countries as $country) {
                $response[] = [
                    'unique_id' => $country->iso2,
                    'name' => $country->name,
                ];
            }
            ;
            return response()->json($response);
        } catch (\Exception $e) {
            Log::error('Error fetching countries: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }
    public function fetchFilterLanguages()
    {
        try {
            // Get the authenticated user
            $user = Auth::user();

            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }

            // Initialize the base query for countries

            // Execute the query
            $query = Language::select('name', 'id'); // Assuming 'network_id' is a field in the 'countries' table
            $languages = $query->orderBy('id')->get();  // Assuming 'name' is a valid field to order by
            // Execute the query
            $response = [];
            foreach ($languages as $language) {
                $response[] = [
                    'unique_id' => $language->id,
                    'names' => $language->name,
                ];
            }
            ;
            return response()->json($languages);
        } catch (\Exception $e) {
            Log::error('Error fetching countries: ' . $e->getMessage());
            return response()->json(['error' => 'Something went wrong', 'message' => $e->getMessage()], 500);
        }
    }
}
