<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Models\Click;
use App\Services\MetricsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClickController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function index(Request $request)
    {
        return Inertia::render('Reports/clicks/index');

    }

    public function fetchClicks(Request $request)
    {
        $metricsService = new MetricsService();

        // Get start_date and end_date from the request or set defaults (-7 days to today)
        $start_date = $request->input('from')
            ? $metricsService->convertToUserTimezone($request->input('from'))
            : $metricsService->getTodayDateInUserTimezone();

        $end_date = $request->input('to')
            ? $metricsService->convertToUserTimezone($request->input('to'))
            : $metricsService->getTodayDateInUserTimezone();

        // Convert start and end date to Carbon instances
        $start_date = Carbon::parse($start_date)->startOfDay(); // e.g., 2024-10-09 00:00:00
        $end_date = Carbon::parse($end_date)->endOfDay();

        $perPage = (int) $request->input('per_page', 50);
        $page = (int) $request->input('page', 1);

        // Fetch clicks between the given dates with joins to get user, manager, and admin names
        $clicksQuery = DB::table('clicks')
            ->join('click_details', 'clicks.id', '=', 'click_details.click_id')
            ->leftJoin('users as user', 'click_details.user_id', '=', 'user.unique_id')
            ->leftJoin('users as manager', 'click_details.manager_id', '=', 'manager.unique_id')
            ->leftJoin('users as admin', 'click_details.admin_id', '=', 'admin.unique_id')
            ->leftJoin('offers as offer', 'click_details.offer_id', '=', 'offer.unique_id')
            ->whereBetween('clicks.created_at', [$start_date, $end_date])
            ->select(
                'clicks.id',
                'click_details.offer_id',
                'click_details.user_id',
                'click_details.manager_id',
                'click_details.admin_id',
                'click_details.status',
                'click_details.click_id',
                'offer.offer_name as offer_name',
                'user.username as user_name',
                'manager.username as manager_name',
                'admin.username as admin_name'
            );

        $clicks = $clicksQuery->paginate($perPage, ['*'], 'page', $page);


        $clicks = $clicksQuery->paginate($perPage, ['*'], 'page', $page);

        $response = [];
        foreach ($clicks as $click) {
            $response[] = [
                'id' => $click->id,
                'click_id' => $click->click_id,
                'offer_name' => $click->offer_name,
                'user_name' => $click->user_name, // Changed to user_name
                'manager_name' => $click->manager_name, // Changed to manager_name
                'admin_name' => $click->admin_name,
                'status' => $click->status,
            ];
        }

        // Prepare pagination data
        $paginationData = [
            'current_page' => $clicks->currentPage(),
            'last_page' => $clicks->lastPage(),
            'first_page' => 1,
            'per_page' => $clicks->perPage(),
            'total' => $clicks->total(),
            'next_page' => $clicks->currentPage() < $clicks->lastPage() ? $clicks->currentPage() + 1 : null,
            'prev_page' => $clicks->currentPage() > 1 ? $clicks->currentPage() - 1 : null,
        ];

        // Return response with clicks and pagination data
        $response = [
            'data' => $response,
            'pagination' => $paginationData,
        ];

        return response()->json($response);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    public function getClickCount()
    {
        // Get the authenticated user
        $user = Auth::user();

        // Initialize the click count
        $clickCount = 0;

        // Check the user's role
        if ($user->role == 'user') {
            // Count clicks where the user is the owner
            $clickCount = Click::where('user_id', $user->unique_id)->count();
        } elseif ($user->role == 'manager') {
            // Count clicks where the manager is the owner
            $clickCount = Click::where('manager_id', $user->unique_id)->count();
        } elseif ($user->role == 'admin') {
            // Count clicks where the admin is the owner
            $clickCount = Click::where('admin_id', $user->unique_id)->count();
        }

        // Return the click count as a JSON response
        return response()->json(['click_count' => $clickCount]);
    }
}