<?php

namespace App\Http\Controllers\Authenticated;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Http\Requests\Authenticated\DomainRequest;
use App\Models\Domain;
use App\Models\User;
use App\Services\MetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Services\CreateNotificationService;

class DomainController extends Controller
{


    public function index(Request $request)
    {
        try {
            $metricsService = new MetricsService($request);
            $user = $metricsService->getUser();
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

            // Query domains based on the user's role
            $domainsQuery = $this->getDomainsQuery();

            if ($q) {
                $domainsQuery->where('name', 'like', "%$q%");
            }
            if ($status) {
                $domainsQuery->where('status', 'like', "%$status%");
            }

            // Paginate the domains
            $domains = $domainsQuery->paginate($perPage, ['*'], 'page', $page);
            $response = [];
            $clickColumn = $roleToColumnMap[$user->role];
            foreach ($domains as $domain) {
                $metrics = $metricsService->getClicksAndConversions(
                    'domain',
                    $domain->unique_id,
                    $start_date,
                    $end_date,
                    $clickColumn
                );

                $response[] = [
                    'id' => $domain->id,
                    'unique_id' => $domain->unique_id,
                    'name' => $domain->name,
                    'clicks' => $metrics['clicks'],
                    'conversions' => $metrics['conversions'],
                    'cvr' => $metrics['cvr'],
                    'progress' => $metricsService->getProgressData('domain', $domain->unique_id, $clickColumn, ),
                    'created_at' => $domain->created_at,
                    'updated_at' => $domain->updated_at,
                    'status' => $domain->status,
                ];
            }
            $chartData = $metricsService->getChartData('domain', $chart_start_date, $end_date, $clickColumn, );
            $paginationData = [
                'current_page' => $domains->currentPage(),
                'last_page' => $domains->lastPage(),
                'first_page' => 1,
                'per_page' => $domains->perPage(),
                'total' => $domains->total(),
                'next_page' => $domains->currentPage() < $domains->lastPage() ? $domains->currentPage() + 1 : null,
                'prev_page' => $domains->currentPage() > 1 ? $domains->currentPage() - 1 : null,
            ];

            return response()->json([
                'data' => $response,
                'pagination' => $paginationData,
                'chart_data' => $chartData,
            ]);
        } catch (\Exception $err) {
            Log::error("Domain index error => " . $err->getMessage());
            return response()->json([
                "message" => "Something went wrong. Please try again later!"
            ], 500);
        }
    }


    private function getDomainsQuery()
    {
        $user = Auth::user();

        if ($user->role === 'administrator') {
            return Domain::query()->orderByDesc('created_at');
        } elseif ($user->role === 'admin') {
            return Domain::query()->where('user_id', $user->unique_id)->orWhere('visiblity', 'public')->orderByDesc('created_at');
        } else {
            abort(403, "Invalid role. You are not allowed to access this resource.");
        }
    }

    public function store(DomainRequest $request)
    {
        $notificationSerive = new CreateNotificationService();
        try {
            $payload = $request->validated();
            $user = $request->user();
            $payload['user_id'] = $user->unique_id;
            $payload["unique_id"] = Str::uuid();
            $domain = Domain::create($payload);
            if ($domain) {

                $roles = '';
                if ($user->role !== 'administrator') {
                    $roles = 'administrator';
                    $message = $user->username . ' added a new Domain "' . $domain->name . '"';

                } else {
                    if ($domain->visiblity == 'public') {
                        $roles = 'admin';
                    }
                    $message = 'A new domain has been added! Go to domains page and check it out.';
                }

                $notificationSerive->create($message, '', $roles);
                $roles = 'administrator,admin';
                $notificationSerive->clickConversoin('', $roles);
                return response()->json([
                    "status" => "success",
                    "message" => "Domain has been created",
                ], 200);
            }

            // Return error response if domain creation fails
            return response()->json([
                "status" => "error",
                "message" => "Failed to create the domain",
            ], 500);

        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating domain: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating domain: " . $err->getMessage(),
            ], 500);
        }
    }

    public function show($uniqueId)
    {

        // Retrieve the domain based on the unique_id column
        $domain = Domain::where('unique_id', $uniqueId)->first();

        if ($domain) {
            // Retrieve user IDs associated with the domain
            $userIds = DB::table('users')->where('domain_id', $domain->unique_id)->pluck('unique_id')->implode(',');

            // Return the response data as a JSON response
            return response()->json([
                'domain' => [
                    'id' => $domain->id,
                    'unique_id' => $domain->unique_id,
                    'name' => $domain->name,
                    'status' => $domain->status,
                    'created_at' => $domain->created_at,
                    'updated_at' => $domain->updated_at,
                ],
                'user_ids' => $userIds,
            ]);
        } else {
            // Return an error response if the resource is not found
            return response()->json(['error' => 'Resource not found'], 404);
        }

    }

    public function update(Request $request, string $unique_id)
    {
        $notificationSerive = new CreateNotificationService();


        // Find the domain
        $domain = Domain::where('unique_id', $unique_id)->firstOrFail();

        // Validation
        $validated = $request->validate([
            'name' => ['required', 'url', 'max:255', Rule::unique('domains', 'name')->ignore($domain->id)],
            'status' => 'required|string|in:active,inactive',
            'selectedUsers' => 'nullable|string',
        ]);

        // Update the domain
        $domain->name = $validated['name'];
        $domain->status = $validated['status'];
        $domain->save();

        // Parse the comma-separated selected users
        $selectedUserIds = array_filter(explode(',', $validated['selectedUsers']));

        // Update the users' domain_id
        User::where('domain_id', $domain->unique_id)
            ->whereNotIn('unique_id', $selectedUserIds)
            ->update(['domain_id' => null]);

        User::whereIn('unique_id', $selectedUserIds)
            ->update(['domain_id' => $domain->unique_id]);


        $roles = 'administrator,admin';
        $notificationSerive->clickConversoin('', $roles);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $uniqueId)
    {

        $notificationSerive = new CreateNotificationService();
        try {
            // Find and delete the domain
            $domain = Domain::where('unique_id', $uniqueId)->firstOrFail();
            if (!$domain) {
                return response()->json([
                    "status" => "error",
                    "message" => "Failed to delete the domain! Domain not found",
                ], 402);
            }
            $domain->delete();
            User::where('domain_id', $domain->unique_id)
                ->update(['domain_id' => null]);

            $roles = 'administrator,admin';
            $notificationSerive->clickConversoin('', $roles);
            return response()->json([
                "status" => "success",
                "message" => "Domain has been Deleted",
            ], 200);


        } catch (\Exception $err) {
            // Log the error and return a response
            Log::error("Error creating domain: " . $err->getMessage(), [
                'stack' => $err->getTraceAsString(),
            ]);
            return response()->json([
                "status" => "error",
                "mesage" => "Error creating domain: " . $err->getMessage(),
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
            'unique_ids.*' => 'exists:domains,unique_id', // Validate each unique_id exists in your database
        ]);

        // Extract unique_ids from the request
        $uniqueIds = $request->input('unique_ids');

        try {
            // Delete rows from the database based on unique_ids
            Domain::whereIn('unique_id', $uniqueIds)->delete();

            return response()->json(['message' => 'Rows deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any errors
            return response()->json(['error' => 'Failed to delete rows'], 500);
        }
    }
}
