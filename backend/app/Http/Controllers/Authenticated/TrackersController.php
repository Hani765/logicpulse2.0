<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Requests\Authenticated\TrackerRequest;
use Carbon\Carbon;

use App\Http\Controllers\Controller;
use App\Models\Tracker;
use App\Services\CreateNotificationService;
use App\Services\MetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Response;

class TrackersController extends Controller
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

            $roleToColumnMap = [
                'administrator' => '',
                'admin' => 'admin_id',
            ];

            if (!isset($roleToColumnMap[$user->role])) {
                return response()->json(['error' => 'Invalid role'], 400);
            }

            // Query trackers based on the user's role
            $trackersQuery = $this->getTrackersQuery();

            if ($q) {
                $trackersQuery->where('name', 'like', "%$q%");
            }
            if ($status) {
                $trackersQuery->where('status', 'like', "%$status%");
            }

            // Paginate the trackers
            $trackers = $trackersQuery->paginate($perPage, ['*'], 'page', $page);
            $response = [];
            $clickColumn = $roleToColumnMap[$user->role];
            foreach ($trackers as $tracker) {
                $metrics = $metricsService->getClicksAndConversions(
                    'tracker',
                    $tracker->unique_id,
                    $start_date,
                    $end_date,
                    $clickColumn
                );

                $response[] = [
                    'id' => $tracker->id,
                    'unique_id' => $tracker->unique_id,
                    'name' => $tracker->name,
                    'value' => $tracker->value,
                    'param' => $tracker->param,
                    'clicks' => $metrics['clicks'],
                    'conversions' => $metrics['conversions'],
                    'cvr' => $metrics['cvr'],
                    'progress' => $metricsService->getProgressData('tracker', $tracker->unique_id, $clickColumn, ),
                    'created_at' => $tracker->created_at,
                    'updated_at' => $tracker->updated_at,
                    'status' => $tracker->status,
                ];
            }
            $chartData = $metricsService->getChartData('tracker', $chart_start_date, $end_date, $clickColumn, );
            $paginationData = [
                'current_page' => $trackers->currentPage(),
                'last_page' => $trackers->lastPage(),
                'first_page' => 1,
                'per_page' => $trackers->perPage(),
                'total' => $trackers->total(),
                'next_page' => $trackers->currentPage() < $trackers->lastPage() ? $trackers->currentPage() + 1 : null,
                'prev_page' => $trackers->currentPage() > 1 ? $trackers->currentPage() - 1 : null,
            ];

            return response()->json([
                'data' => $response,
                'pagination' => $paginationData,
                'chart_data' => $chartData,
            ]);
        } catch (\Exception $err) {
            Log::error("tracker index error => " . $err->getMessage());
            return response()->json([
                "message" => "Something went wrong. Please try again later!"
            ], 500);
        }
    }


    private function getTrackersQuery()
    {
        $user = Auth::user();

        if ($user->role === 'administrator') {
            return Tracker::query()->orderByDesc('created_at');
        } elseif ($user->role === 'admin') {
            return Tracker::query()->where('user_id', $user->unique_id)->orWhere('visiblity', 'public')->orderByDesc('created_at');
        } else {
            abort(403, "Invalid role. You are not allowed to access this resource.");
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TrackerRequest $request)
    {
        $notificationSerive = new CreateNotificationService();
        try {
            $payload = $request->validated();
            $user = $request->user();
            $payload['user_id'] = $user->unique_id;
            $payload["unique_id"] = Str::uuid();
            $Traker = Tracker::create($payload);
            if ($Traker) {

                $roles = '';
                if ($user->role !== 'administrator') {
                    $roles = 'administrator';
                    $message = $user->username . ' added a new Tracker "' . $Traker->name . '"';

                } else {
                    if ($Traker->visiblity == 'public') {
                        $roles = 'admin';
                    }
                    $message = 'A new tracker has been added! Go to trackers page and check it out.';
                }

                $notificationSerive->create($message, '', $roles);
                $roles = 'administrator,admin';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Tracker has been created",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to create the tracker",
            ], 500);

        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating Tracker: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating Tracker: " . $err->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $uniqueId)
    {
        $notificationSerive = new CreateNotificationService();
        try {
            $tracker = Tracker::where('unique_id', $uniqueId)->first();
            if ($tracker) {

                $payload = $request->validate([
                    'name' => ['required', 'string', 'max:255', Rule::unique('trackers', 'name')->ignore($tracker->id)],
                    'param' => ['required', 'string', 'max:255', 'regex:/^\S*$/'], // No spaces allowed
                    'value' => ['required', 'string', 'max:255', 'regex:/^\S*$/'], // No spaces allowed
                    'status' => 'required|string|in:active,inactive',
                    'visiblity' => 'required|string|in:public,private',
                ]);
                $tracker->update($payload);
                $roles = 'administrator,admin';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Tracker has been updated",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to update the tracker",
            ], 500);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating Tracker: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating Tracker: " . $err->getMessage(),
            ], 500);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $uniqueId)
    {
        $notificationSerive = new CreateNotificationService();

        // Find the tracker by its unique_id
        try {
            $tracker = Tracker::where('unique_id', $uniqueId)->firstOrFail();
            // Delete the tracker
            $tracker->delete();
            if ($tracker) {

                $roles = 'administrator,admin';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Tracker has been deleted",
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Failed to delete the tracker",
            ], 500);
        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error deleting Tracker: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error deleting Tracker: " . $err->getMessage(),
            ], 500);
        }
    }

    public function deleteRows(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        // Validate the request data
        $request->validate([
            'unique_ids' => 'required|array', // Make sure unique_ids is an array
            'unique_ids.*' => 'exists:trackers,unique_id', // Validate each unique_id exists in your database
        ]);

        // Extract unique_ids from the request
        $uniqueIds = $request->input('unique_ids');

        try {
            // Delete rows from the database based on unique_ids
            Tracker::whereIn('unique_id', $uniqueIds)->delete();

            return response()->json(['message' => 'Rows deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any errors
            return response()->json(['error' => 'Failed to delete rows'], 500);
        }
    }
}
