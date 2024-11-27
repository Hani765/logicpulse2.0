<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Models\Offers;
use App\Services\MetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function fetchOffersData(Request $request)
    {
        $metricsService = new MetricsService();

        // Determine start and end dates from the request or defaults
        $start_date = $request->input('from')
            ? $metricsService->convertToUserTimezone($request->input('from'))
            : $metricsService->getTodayDateInUserTimezone();
        $chart_start_date = $request->input('from')
            ? $metricsService->convertToUserTimezone($request->input('from'))
            : $metricsService->getDateInUserTimezone('-7 day');
        $end_date = $request->input('to')
            ? $metricsService->convertToUserTimezone($request->input('to'))
            : $metricsService->getTodayDateInUserTimezone();

        $start_date = Carbon::parse($start_date)->startOfDay();
        $chart_start_date = Carbon::parse($chart_start_date)->startOfDay();
        $end_date = Carbon::parse($end_date)->endOfDay();

        $user = $metricsService->getUser();
        $roleToColumnMap = [
            'administrator' => '',
            'admin' => 'admin_id',
            'manager' => 'manager_id',
            'user' => 'user_id',
        ];

        if (!isset($roleToColumnMap[$user->role])) {
            return response()->json(['error' => 'Invalid role'], 400);
        }

        $role = $user->role;

        // Build offers query based on the user's role
        if ($role === 'administrator') {
            $offersQuery = Offers::query();
        } elseif ($role === 'admin') {
            $adminOffersQuery = Offers::where('user_id', $user->unique_id);
            $offerUser = DB::table('offer_user')->where('user_unique_id', $user->unique_id)->first();
            $offerUniqueIds = $offerUser ? explode(',', $offerUser->offer_unique_ids) : [];
            $offersQuery = Offers::whereIn('unique_id', $offerUniqueIds)
                ->union($adminOffersQuery);
        } else {
            $offerUser = DB::table('offer_user')->where('user_unique_id', $user->unique_id)->first();
            $offerUniqueIds = $offerUser ? explode(',', $offerUser->offer_unique_ids) : [];
            $offersQuery = Offers::whereIn('unique_id', $offerUniqueIds);
        }

        // Fetch offers data with clicks counts from click_details
        $offers = $offersQuery->get();

        if ($offers->isEmpty()) {
            return response()->json([
                'message' => 'No offers found for the given date range.',
                'data' => [
                    'start_date' => $start_date->toDateString(),
                    'end_date' => $end_date->toDateString(),
                    'offers' => [],
                ]
            ], 200);
        }

        // Fetch clicks data grouped by offer and calculate totals
        $clickCounts = DB::table('click_details')
            ->select('offer_id', DB::raw('COUNT(*) as click_count'))
            ->whereBetween('created_at', [$start_date, $end_date])
            ->groupBy('offer_id')
            ->get()
            ->keyBy('offer_id');

        $totalClicks = $clickCounts->sum('click_count');

        // Map offers with click details and percentages, filter out those with 0 clicks
        $offersData = $offers->map(function ($offer) use ($clickCounts, $totalClicks) {
            $clickCount = $clickCounts->get($offer->unique_id)->click_count ?? 0;

            // Skip offers with 0 clicks
            if ($clickCount === 0) {
                return null;
            }

            $percentage = $totalClicks > 0 ? round(($clickCount / $totalClicks) * 100, 2) : 0;

            return [
                'offer_id' => $offer->unique_id,
                'offer_name' => $offer->name,
                'click_count' => $clickCount,
                'percentage' => $percentage,
            ];
        })->filter(); // Remove null entries

        return response()->json([
            'message' => 'Offers data retrieved successfully.',
            'data' => [
                'start_date' => $start_date->toDateString(),
                'end_date' => $end_date->toDateString(),
                'total_clicks' => $totalClicks,
                'offers' => $offersData->values(), // Re-index filtered results
            ]
        ], 200);
    }


}
