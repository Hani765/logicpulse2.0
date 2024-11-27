<?php

namespace App\Http\Controllers\Authenticated\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardAnalytics extends Controller
{
    public function index()
    {
        // Define date ranges
        $startOfLastMonth = Carbon::now()->subMonth()->startOfMonth();
        $endOfLastMonth = Carbon::now()->subMonth()->endOfMonth();
        $startOfCurrentMonth = Carbon::now()->startOfMonth();
        $endOfCurrentMonth = Carbon::now();
        $user = Auth::user();
        $role = $user->role;

        // Generate all dates between the start of last month and today
        $dateRange = [];
        for ($date = $startOfLastMonth->copy(); $date->lte($endOfCurrentMonth); $date->addDay()) {
            $dateRange[$date->toDateString()] = [
                'clicks' => 0,
                'conversions' => 0,
                'cvr' => 0, // Initialize CVR
                'earnings' => 0 // Initialize earnings
            ];
        }

        // Fetch clicks data for the last month and current month, grouped by date
        $clicksQuery = DB::table('click_details')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as clicks'))
            ->whereBetween('created_at', [$startOfLastMonth, $endOfCurrentMonth])
            ->groupBy('date')
            ->orderBy('date', 'asc');

        // Fetch conversions data for the last month and current month, grouped by date
        $conversionsQuery = DB::table('click_details')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as conversions'))
            ->where('status', 'approved')->whereBetween('created_at', [$startOfLastMonth, $endOfCurrentMonth])
            ->groupBy('date')
            ->orderBy('date', 'asc');

        // Fetch rejected conversions data for the last month and current month, grouped by date
        $rejectedConversionsQuery = DB::table('click_details')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('COUNT(*) as rejected_conversions'))
            ->where('status', 'rejected')->whereBetween('created_at', [$startOfLastMonth, $endOfCurrentMonth])
            ->groupBy('date')
            ->orderBy('date', 'asc');

        if ($role === 'administrator') {
            $clicksData = $clicksQuery->get();
            $conversionsData = $conversionsQuery->get();
            $rejectedConversionsData = []; // No rejected conversions for admin
        } else {
            $clicksData = $clicksQuery->where($role . '_id', $user->unique_id)->get();
            $conversionsData = $conversionsQuery->where($role . '_id', $user->unique_id)->get();
            $rejectedConversionsData = $rejectedConversionsQuery->where($role . '_id', $user->unique_id)->get();
        }

        // Fill in the clicks and conversions data
        foreach ($clicksData as $click) {
            $dateRange[$click->date]['clicks'] = $click->clicks;
        }

        foreach ($conversionsData as $conversion) {
            $dateRange[$conversion->date]['conversions'] = $conversion->conversions;
        }

        // Fetch row rate from click details to calculate earnings
        $rowRate = DB::table('click_details')->value('rate'); // Replace 'rate' with your actual column name

        // Prepare separate arrays for clicks, conversions, CVR, rejected conversions, and earnings for each month
        $clicksLastMonth = [];
        $clicksCurrentMonth = [];
        $conversionsLastMonth = [];
        $conversionsCurrentMonth = [];
        $cvrLastMonth = [];
        $cvrCurrentMonth = [];
        $rejectedConversionsLastMonth = [];
        $rejectedConversionsCurrentMonth = [];
        $earningsLastMonth = [];
        $earningsCurrentMonth = [];

        foreach ($dateRange as $date => $data) {
            // Calculate CVR and Earnings
            if ($data['clicks'] > 0) {
                $data['cvr'] = ($data['conversions'] / $data['clicks']) * 100; // CVR as a percentage
                $data['earnings'] = $data['conversions'] * $rowRate; // Earnings calculation
            }

            if ($date >= $startOfCurrentMonth->toDateString()) {
                $clicksCurrentMonth[] = [
                    'date' => $date,
                    'counts' => $data['clicks'],
                ];
                $conversionsCurrentMonth[] = [
                    'date' => $date,
                    'counts' => $data['conversions'],
                ];
                if ($role === 'administrator') {
                    $cvrCurrentMonth[] = [
                        'date' => $date,
                        'counts' => $data['cvr'],
                    ];
                } else {
                    $rejectedConversionsCurrentMonth[] = [
                        'date' => $date,
                        'counts' => isset($rejectedConversionsData[$date]) ? $rejectedConversionsData[$date]->rejected_conversions : 0,
                    ];
                }
                $earningsCurrentMonth[] = [
                    'date' => $date,
                    'counts' => $data['earnings'],
                ];
            } elseif ($date <= $endOfLastMonth->toDateString()) {
                $clicksLastMonth[] = [
                    'date' => $date,
                    'counts' => $data['clicks'],
                ];
                $conversionsLastMonth[] = [
                    'date' => $date,
                    'counts' => $data['conversions'],
                ];
                if ($role === 'administrator') {
                    $cvrLastMonth[] = [
                        'date' => $date,
                        'counts' => $data['cvr'],
                    ];
                } else {
                    $rejectedConversionsLastMonth[] = [
                        'date' => $date,
                        'counts' => isset($rejectedConversionsData[$date]) ? $rejectedConversionsData[$date]->rejected_conversions : 0,
                    ];
                }
                $earningsLastMonth[] = [
                    'date' => $date,
                    'counts' => $data['earnings'],
                ];
            }
        }

        $response = [
            'clicks' => [
                'label' => 'Clicks over time. Adjust the date range to view custom data.',
                'lastMonth' => $clicksLastMonth,
                'currentMonth' => $clicksCurrentMonth,
            ],
            'conversions' => [
                'label' => 'Conversions over time. Adjust the date range to view custom data.',
                'lastMonth' => $conversionsLastMonth,
                'currentMonth' => $conversionsCurrentMonth,
            ],
            'cvr' => $role === 'administrator' || $role === 'admin' ? [
                'label' => 'Conversion Rate over time. Adjust the date range to view custom data.',
                'lastMonth' => $cvrLastMonth,
                'currentMonth' => $cvrCurrentMonth,
            ] : [
                'label' => 'Rejected Conversions over time. Adjust the date range to view custom data.',
                'lastMonth' => $rejectedConversionsLastMonth,
                'currentMonth' => $rejectedConversionsCurrentMonth,
            ],
            'earnings' => [
                'label' => 'Earnings over time. Adjust the date range to view custom data.',
                'lastMonth' => $earningsLastMonth,
                'currentMonth' => $earningsCurrentMonth,
            ],
        ];

        // Return the data as JSON
        return response()->json($response);
    }
}
