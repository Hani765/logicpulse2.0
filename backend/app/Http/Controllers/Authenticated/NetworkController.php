<?php

namespace App\Http\Controllers\Authenticated;



use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Requests\Authenticated\NetworkRequest;
use App\Models\Network;
use App\Services\CreateNotificationService;
use App\Services\MetricsService;
use Illuminate\Foundation\Auth\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class NetworkController extends Controller
{
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

            $roleToColumnMap = [
                'administrator' => '',
                'admin' => 'admin_id',
            ];

            if (!isset($roleToColumnMap[$user->role])) {
                return response()->json(['error' => 'Invalid role'], 400);
            }

            // Query networks based on the user's role
            $networksQuery = $this->getnetworksQuery();

            if ($q) {
                $networksQuery->where('name', 'like', "%$q%");
            }
            if ($status) {
                $networksQuery->where('status', 'like', "%$status%");
            }

            // Paginate the networks
            $networks = $networksQuery->paginate($perPage, ['*'], 'page', $page);
            $response = [];
            $clickColumn = $roleToColumnMap[$user->role];
            foreach ($networks as $network) {
                $metrics = $metricsService->getClicksAndConversions(
                    'network',
                    $network->unique_id,
                    $start_date,
                    $end_date,
                    $clickColumn
                );

                $response[] = [
                    'id' => $network->id,
                    'unique_id' => $network->unique_id,
                    'name' => $network->name,
                    'tracker_id' => $network->tracker_id,
                    'tracker' => $network->tracker ? $network->tracker->name : null,  // Assuming 'name' 
                    'clicks' => $metrics['clicks'],
                    'conversions' => $metrics['conversions'],
                    'cvr' => $metrics['cvr'],
                    'progress' => $metricsService->getProgressData('network', $network->unique_id, $clickColumn, ),
                    'created_at' => $network->created_at,
                    'updated_at' => $network->updated_at,
                    'status' => $network->status,
                ];
            }
            $chartData = $metricsService->getChartData('network', $chart_start_date, $end_date, $clickColumn, );
            $paginationData = [
                'current_page' => $networks->currentPage(),
                'last_page' => $networks->lastPage(),
                'first_page' => 1,
                'per_page' => $networks->perPage(),
                'total' => $networks->total(),
                'next_page' => $networks->currentPage() < $networks->lastPage() ? $networks->currentPage() + 1 : null,
                'prev_page' => $networks->currentPage() > 1 ? $networks->currentPage() - 1 : null,
            ];

            return response()->json([
                'data' => $response,
                'pagination' => $paginationData,
                'chart_data' => $chartData,
            ]);
        } catch (\Exception $err) {
            Log::error("network index error => " . $err->getMessage());
            return response()->json([
                "message" => "Something went wrong. Please try again later!"
            ], 500);
        }
    }


    private function getnetworksQuery()
    {
        $user = Auth::user();

        if ($user->role === 'administrator') {
            return Network::query()->orderByDesc('created_at');
        } elseif ($user->role === 'admin') {
            return Network::query()->where('user_id', $user->unique_id)->orderByDesc('created_at');
        } else {
            abort(403, "Invalid role. You are not allowed to access this resource.");
        }
    }
    public function store(NetworkRequest $request)
    {
        $notificationSerive = new CreateNotificationService();
        try {

            $payload = $request->validated();
            $user = $request->user();
            $payload['user_id'] = $user->unique_id;
            $payload["unique_id"] = Str::uuid();
            $network = Network::create($payload);
            if ($network) {
                if ($user->role !== 'administrator') {
                    $roles = 'administrator';
                    $message = $user->username . ' added a new Tracker "' . $network->name . '"';
                    $notificationSerive->create($message, '', $roles);
                }
                $roles = 'administrator';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Network has been created",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to create the Network",
            ], 500);

        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating Network: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating Network: " . $err->getMessage(),
            ], 500);
        }
    }


    public function update(Request $request, string $unique_id)
    {
        // Authentication check
        $notificationSerive = new CreateNotificationService();
        try {
            $network = Network::where('unique_id', $unique_id)->firstOrFail();
            if ($network) {
                // Validation
                $validated = $request->validate([
                    'name' => ['required', 'string', 'max:255', Rule::unique('networks', 'name')->ignore($network->id)],
                    'tracker_id' => 'required|string',
                    'status' => 'required|string|in:active,inactive,pause',
                ]);

                // Find and update the domain
                $network->name = $validated['name'];
                $network->status = $validated['status'];
                $network->tracker_id = $validated['tracker_id'];
                $network->save();

                $roles = 'administrator';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Network has been updated",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to update the Network",
            ], 500);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating Network: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating Network: " . $err->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $uniqueId)
    {

        $notificationSerive = new CreateNotificationService();
        try {
            // Find the domain by its unique_id
            $network = Network::where('unique_id', $uniqueId)->firstOrFail();
            // Delete the domain
            $network->delete();
            if ($network) {
                $roles = 'administrator,admin';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Network has been deleted",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to delete the Network",
            ], 500);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error deleting Network: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error deleting Network: " . $err->getMessage(),
            ], 500);
        }
        // Return success response
    }
    public function deleteRows(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        // Validate the request data
        $request->validate([
            'unique_ids' => 'required|array', // Make sure unique_ids is an array
            'unique_ids.*' => 'exists:networks,unique_id', // Validate each unique_id exists in your database
        ]);

        // Extract unique_ids from the request
        $uniqueIds = $request->input('unique_ids');

        try {
            // Delete rows from the database based on unique_ids
            Network::whereIn('unique_id', $uniqueIds)->delete();

            return response()->json(['message' => 'Rows deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any errors
            return response()->json(['error' => 'Failed to delete rows'], 500);
        }
    }
}
