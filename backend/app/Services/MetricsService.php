<?php
namespace App\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;


class MetricsService
{
    protected $user;
    protected $role;
    protected $userTimezone;
    protected $applicationTimezone;

    public function __construct(Request $request)
    {
        $this->user = $request->user();
        $this->role = $this->user->role;
        $this->userTimezone = $this->user->time_zone;
        $this->applicationTimezone = Config::get('app.timezone');
        date_default_timezone_set($this->applicationTimezone);
    }

    // Get today's date in user timezone
    public function getTodayDateInUserTimezone(): string
    {
        return Carbon::now($this->applicationTimezone)->setTimezone($this->userTimezone)->toDateString();
    }

    // Get a specific date in the user's timezone (e.g., -7 days)
    public function getDateInUserTimezone($relativeDate): string
    {
        return Carbon::now($this->applicationTimezone)
            ->setTimezone($this->userTimezone)
            ->modify($relativeDate)
            ->toDateString();
    }

    // Convert a given date to the user's timezone
    public function convertToUserTimezone($date): string
    {
        return Carbon::parse($date, $this->applicationTimezone)
            ->setTimezone($this->userTimezone)
            ->toDateString();
    }

    // Fetch clicks and conversions within date range
    public function getClicksAndConversions($model, $uniqueId, $start_date, $end_date, $clickColumn = null)
    {
        $clicksQuery = DB::table('clicks')
            ->join('click_details', 'clicks.id', '=', 'click_details.click_id')
            ->where("click_details.{$model}_id", $uniqueId)
            ->whereBetween('clicks.created_at', [$start_date, $end_date]);



        $conversionsQuery = DB::table('conversions')
            ->join('click_details', 'conversions.click_id', '=', 'click_details.click_id')
            ->where("click_details.{$model}_id", $uniqueId)
            ->whereBetween('conversions.created_at', [$start_date, $end_date])
            ->where('click_details.status', 'approved');

        if ($clickColumn) {
            $clicksQuery->where("click_details.{$clickColumn}", $this->user->unique_id)
            ;
            $conversionsQuery->where("click_details.{$clickColumn}", $this->user->unique_id)
            ;
        }

        $conversionsCount = $conversionsQuery->count();
        $clicksCount = $clicksQuery->count();
        $cvr = $clicksCount > 0 ? ($conversionsCount / $clicksCount) * 100 : 0;

        return [
            'clicks' => $clicksCount,
            'conversions' => $conversionsCount,
            'cvr' => $cvr,
        ];
    }

    // Fetch chart data (date-wise clicks/conversions)
    public function getProgressData($model, $uniqueId, $clickColumn = null)
    {
        // Convert the input date to a Carbon instance
        $today = Carbon::now()->startOfDay();
        $yesterday = $today->copy()->subDay()->startOfDay();
        $endOfYesterday = $yesterday->copy()->endOfDay();
        // Query to get today's count
        $todayQuery = DB::table('click_details')
            ->join('clicks', 'click_details.click_id', '=', 'clicks.id')
            ->where("click_details.{$model}_id", $uniqueId)
            ->whereBetween('clicks.created_at', [$today, $today->copy()->endOfDay()]);

        // Query to get yesterday's count
        $yesterdayQuery = DB::table('clicks')
            ->join('click_details', 'clicks.id', '=', 'click_details.click_id')
            ->where("click_details.{$model}_id", $uniqueId)
            ->whereBetween('clicks.created_at', [$yesterday, $endOfYesterday]);

        if ($clickColumn) {
            $todayQuery->where("click_details.{$clickColumn}", $this->user->unique_id)
            ;
            $yesterdayQuery->where("click_details.{$clickColumn}", $this->user->unique_id)
            ;
        }
        $todayCount = $todayQuery->count();
        $yesterdayCount = $yesterdayQuery->count();
        $progress = $yesterdayCount > 0 ? ($todayCount / $yesterdayCount) * 100 : 0;
        return $progress;
    }
    public function getChartData($model, $chart_start_date, $end_date, $clickColumn)
    {
        // Step 1: Generate all dates between the start and end date
        $datePeriod = new \DatePeriod(
            new \DateTime($chart_start_date),
            new \DateInterval('P1D'),
            new \DateTime($end_date)
        );

        // Step 2: Initialize the default data array for each date
        $defaultData = [];
        foreach ($datePeriod as $date) {
            $formattedDate = $date->format('Y-m-d');
            $defaultData[$formattedDate] = [
                'clicks' => 0,        // Default clicks value for this date
                'conversions' => 0,   // Default conversions value for this date
            ];
        }

        // Step 3: Clicks Query
        $clicksQuery = DB::table('clicks')
            ->select(DB::raw('DATE(clicks.created_at) as date'), DB::raw('COUNT(clicks.id) as clicks'))
            ->join('click_details', 'click_details.click_id', '=', 'clicks.id')
            ->whereBetween('clicks.created_at', [$chart_start_date, $end_date])
            ->groupBy(DB::raw('DATE(clicks.created_at)'));

        // Step 4: Conversions Query
        $conversionsQuery = DB::table('clicks')
            ->select(DB::raw('DATE(clicks.created_at) as date'), DB::raw('COUNT(clicks.id) as conversions'))
            ->join('click_details', 'click_details.click_id', '=', 'clicks.id')
            ->where('click_details.status', 'approved')
            ->whereBetween('clicks.created_at', [$chart_start_date, $end_date])
            ->groupBy(DB::raw('DATE(clicks.created_at)'));

        // Step 5: Apply user-specific filtering if $clickColumn is provided
        if ($clickColumn) {
            $clicksQuery->where(function ($query) use ($clickColumn) {
                $query->where("click_details.{$clickColumn}", $this->user->unique_id)
                    ->orWhere("click_details.user_id", $this->user->unique_id);
            });

            $conversionsQuery->where(function ($query) use ($clickColumn) {
                $query->where("click_details.{$clickColumn}", $this->user->unique_id)
                    ->orWhere("click_details.user_id", $this->user->unique_id);
            });
        }


        // Step 6: Get the results from the queries
        $clicksData = $clicksQuery->get();
        $conversionsData = $conversionsQuery->get();

        // Step 7: Update the default data array with real clicks and conversions data
        foreach ($clicksData as $click) {
            $defaultData[$click->date]['clicks'] = $click->clicks; // Update clicks count
        }
        foreach ($conversionsData as $conversion) {
            $defaultData[$conversion->date]['conversions'] = $conversion->conversions; // Update conversions count
        }

        // Step 8: Prepare the final response array with all dates, clicks, and conversions
        $response = [];
        foreach ($defaultData as $date => $data) {
            $response[] = [
                'date' => $date,               // Date for this entry
                'clicks' => $data['clicks'],   // Clicks count for this date (0 if not found)
                'conversions' => $data['conversions'], // Conversions count for this date (0 if not found)
            ];
        }

        return $response; // Final response containing data for all dates in the range
    }


    public function getUser()
    {
        return $this->user;
    }
}
