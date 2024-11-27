<?php

namespace App\Http\Controllers\Authenticated;


use Carbon\Carbon;

use App\Http\Controllers\Controller;
use App\Http\Requests\Authenticated\UserRequest;
use App\Models\User;
use App\Models\Users;
use App\Services\CreateNotificationService;
use App\Services\MetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $metricsService = new MetricsService($request);
            // Get start_date and end_date from the request or set defaults (-7 days to today)
            $start_date = $request->input('from')
                ? $metricsService->convertToUserTimezone($request->input('from'))
                : $metricsService->getTodayDateInUserTimezone();
            $chart_start_date = $request->input('from')
                ? $metricsService->convertToUserTimezone($request->input('from'))
                : $metricsService->getDateInUserTimezone('-7 day');
            $end_date = $request->input('to')
                ? $metricsService->convertToUserTimezone($request->input('to'))
                : $metricsService->getTodayDateInUserTimezone();
            $start_date = Carbon::parse($start_date)->startOfDay(); // 2024-10-09 00:00:00
            $chart_start_date = Carbon::parse($chart_start_date)->startOfDay(); // 2024-10-09 00:00:00
            $end_date = Carbon::parse($end_date)->endOfDay(); // 2024-10-09 23:59:59
            $user = $metricsService->getUser();
            $perPage = $request->input('per_page', 50);
            $page = $request->input('page', 1);
            $q = $request->input('q', '');
            $status = $request->input('status', '');
            $query_role = $request->input('role', '');
            // Explicitly define the mapping of roles to column names
            $roleToColumnMap = [
                'administrator' => '',
                'admin' => 'admin_id',
                'manager' => 'manager_id',
            ];
            $role = $user->role;

            if (!isset($roleToColumnMap[$role])) {
                return response()->json(['error' => 'Invalid role'], 400);
            }


            if ($role === 'administrator') {
                $usersQuery = User::query()->where('unique_id', '!=', $user->unique_id);
            } elseif ($role === 'admin') {
                // Fetch offers where the offer's user_id matches the user's unique_id
                $usersQuery = User::where('admin_id', $user->unique_id);
            } elseif ($role === 'manager') {
                // Fetch offers where the offer's user_id matches the user's unique_id
                $usersQuery = User::where('manager_id', $user->unique_id);
            }
            if ($q) {
                $usersQuery->where(function ($query) use ($q) {
                    $query->where('username', 'like', "%$q%")
                        ->orWhere('email', 'like', "%$q%")
                        ->orWhere('name', 'like', "%$q%")
                        ->orWhere('phone', 'like', "%$q%");
                });
            }
            if ($status) {
                $usersQuery->where('status', 'like', "%$status%");
            }
            if ($query_role) {
                $usersQuery->where('role', 'like', "%$query_role%");
            }

            $users = $usersQuery->paginate($perPage, ['*'], 'page', $page);

            $response = [];
            $clickColumn = $roleToColumnMap[$role];
            foreach ($users as $fetchUser) {
                $metrics = $metricsService->getClicksAndConversions(
                    'user',
                    $fetchUser->unique_id,
                    $start_date,
                    $end_date,
                    $clickColumn
                );
                $response[] = [
                    'id' => $fetchUser->id,
                    'unique_id' => $fetchUser->unique_id,
                    'profile_image' => $fetchUser->profile_image,
                    'first_name' => $fetchUser->first_name,
                    'last_name' => $fetchUser->last_name,
                    'username' => $fetchUser->username,
                    'email' => $fetchUser->email,
                    'role' => $fetchUser->role,
                    'phone' => $fetchUser->phone ?: "",
                    'rate' => $fetchUser->rate ?: "",
                    'age' => $fetchUser->age ?: "",
                    'clicks' => $metrics['clicks'],
                    'conversions' => $metrics['conversions'],
                    'cvr' => $metrics['cvr'],
                    'progress' => $metricsService->getProgressData('user', $fetchUser->unique_id, $clickColumn, ),
                    'manager_username' => $fetchUser->manager ? $fetchUser->manager->username : "",
                    'admin_username' => $fetchUser->admin ? $fetchUser->admin->username : "",
                    'created_at' => $fetchUser->created_at,
                    'updated_at' => $fetchUser->updated_at,
                    'status' => $fetchUser->status,
                ];
            }
            $chartData = $metricsService->getChartData('user', $chart_start_date, $end_date, $clickColumn, );

            $paginationData = [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'first_page' => 1, // First page is always 1 in Laravel pagination
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'next_page' => $users->currentPage() < $users->lastPage() ? $users->currentPage() + 1 : null,
                'prev_page' => $users->currentPage() > 1 ? $users->currentPage() - 1 : null,
            ];

            return response()->json([
                'data' => $response,
                'pagination' => $paginationData,
                'chart_data' => $chartData,
            ]);
        } catch (\Exception $err) {
            Log::error(message: "Users index error => " . $err->getMessage());
            return response()->json([
                "message" => "Something went wrong. Please try again later!"
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $payload = $request->validated();
        $user = $request->user();
        try {
            // Set admin_id and manager_id based on user role
            if ($user->role === "admin" || $user->role === "administrator") {
                $payload["admin_id"] = $user->unique_id;
                $payload["manager_id"] = $user->unique_id;
            } elseif ($user->role === "manager") {
                $payload["manager_id"] = $user->unique_id;
            } else {
                return response()->json(['error' => 'Invalid Role'], 401);
            }

            // Generate unique ID for the new user
            $payload["unique_id"] = (string) Str::uuid();
            $newUser = User::create($payload);
            if ($newUser) {
                if (!empty($payload['offer_ids'])) {
                    try {

                        // Split offers string into an array of unique IDs
                        DB::table('offer_user')->insert([
                            'user_unique_id' => $newUser->unique_id,
                            'offer_unique_ids' => $payload['offer_ids']
                        ]);
                    } catch (\Exception $e) {
                        return response()->json(["status" => "error", 'message' => $e->getMessage()], 500);
                    }
                }
                return response()->json([
                    "status" => "success",
                    "message" => "User has been created",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to create the User",
            ], 500);

        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating User: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating User: " . $err->getMessage(),
            ], 500);
        }
    }
    public function edit(string $uniqueId)
    {
        try {
            // Find the user by unique ID
            $user = User::where('unique_id', $uniqueId)->first();
            if (!$user) {
                return response()->json([
                    "status" => "error",
                    "message" => "User not found",
                ], 404);
            }

            // Get the unique IDs of offers associated with the user
            $offerUniqueIds = DB::table('offer_user')
                ->where('user_unique_id', $uniqueId)
                ->pluck('offer_unique_ids')
                ->first();

            return response()->json([
                'user' => $user,
                'offer_unique_ids' => $offerUniqueIds
            ]);

        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error showing User: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error showing User: " . $err->getMessage(),
            ], 500);
        }
    }
    public function update(Request $request, string $uniqueId)
    {
        $notificationSerive = new CreateNotificationService();
        // Validate request data
        $user = Users::where('unique_id', $uniqueId)->first();
        if (!$user) {
            return response()->json([
                "status" => "error",
                "message" => "User not found",
            ], 404);
        }
        $payload = $request->validate([
            'username' => ['required', 'string', 'max:255', Rule::unique('users', 'username')->ignore($user->id)],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => 'required|string|in:admin,manager,user',
            'phone' => 'required|string|max:20',
            'profile_image' => 'nullable|string',
            'password' => 'nullable|string|min:6',
            'rate' => 'required|numeric',
            'status' => 'required|string',
            'details' => 'nullable|string|min:20|max:10000',
            'domain_id' => 'required|string|uuid',
            'skype' => 'required|string|max:255',
            'notification' => 'required|string',
            'isVerified' => 'required|string',
            'offer_ids' => 'nullable|string',
        ]);

        // Check if the authenticated user is admin or manager
        $authUser = Auth::user();
        if ($authUser->role !== 'admin' && $authUser->role !== 'administrator' && $authUser->role !== 'manager') {
            return response()->json([
                "status" => "error",
                "message" => "Unauthorized",
            ], 403);
        }

        // Update admin_id and manager_id based on the authenticated user's role
        if ($authUser->role === 'admin' || $authUser->role === 'administrator') {
            $payload['admin_id'] = $authUser->unique_id;
            $payload['manager_id'] = $authUser->unique_id;
        } elseif ($authUser->role === 'manager') {
            $payload['manager_id'] = $authUser->unique_id;
        }

        // Hash the password if it's present in the payload
        if (isset($payload['password'])) {
            $payload['password'] = bcrypt($payload['password']);
        } else {
            unset($payload['password']);
        }

        try {
            // Find the user by unique ID
            $user->update($payload);

            // Update the offer_user table
            if (!empty($payload['offer_ids'])) {
                DB::table('offer_user')
                    ->updateOrInsert(
                        ['user_unique_id' => $user->unique_id],
                        ['offer_unique_ids' => $payload['offer_ids']]
                    );
            } else {
                // If no offers provided, remove the association
                DB::table('offer_user')->where('user_unique_id', $user->unique_id)->delete();
            }

            $unique_ids = $authUser->unique_id . ',' . $user->unique_id;
            $notificationSerive->clickConversoin($unique_ids, '');
            return response()->json([
                "status" => "success",
                "message" => "User has been updated",
            ], 200);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error updating User: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error updating User: " . $err->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $uniqueId)
    {
        try {
            // Find the user by unique ID
            $user = User::where('unique_id', $uniqueId)->first();
            if (!$user) {
                return response()->json([
                    "status" => "error",
                    "message" => "User not found",
                ], 404);
            }

            // Get the unique IDs of offers associated with the user
            $offerUniqueIds = DB::table('offer_user')
                ->where('user_unique_id', $uniqueId)
                ->pluck('offer_unique_ids')
                ->first();


            return response()->json([
                'user' => $user,
                'offer_unique_ids' => $offerUniqueIds
            ], 200);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error showing User: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error showing User: " . $err->getMessage(),
            ], 500);
        }
    }




    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $uniqueId)
    {
        $notificationSerive = new CreateNotificationService();
        try {

            // Find the user by unique ID
            $deleteuser = User::where('unique_id', $uniqueId)->first();
            if (!$deleteuser) {
                return response()->json([
                    "status" => "error",
                    "message" => "User not found",
                ], 404);
            }

            // Delete the user
            $deleteuser->delete();

            // Remove any associations in the offer_user table
            DB::table('offer_user')->where('user_unique_id', $uniqueId)->delete();
            $user = Auth::user();
            $notificationSerive->clickConversoin($user->unique_id, '');
            return response()->json([
                "status" => "success",
                "message" => "User has been deleted",
            ], 200);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error deleting User: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error deleting User: " . $err->getMessage(),
            ], 500);
        }
    }
    public function getUserDetails(Request $request)
    {
        $user = $request->user();
        Log::info('User Details:', [$user]); // Log user details for debugging
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([
                "message" => "User not found"
            ], 404);
        }
    }
}
