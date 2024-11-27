<?php
namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stevebauman\Location\Facades\Location;
use Jenssegers\Agent\Agent;

class UserDetailService
{
    public function getUserDetails(Request $request)
    {
        // Fetch real IP address from request
        $ip = $request->header('X-Forwarded-For') ?? $request->ip();
        $ip = '154.208.49.23';
        // Fetch location based on the IP, with fallback
        $location = Location::get($ip);

        if (!$location) {
            $location = (object) [
                'countryName' => 'Pakistan',
                'countryCode' => 'PK',
                'regionName' => 'Unknown',
                'cityName' => 'Unknown',
                'zipCode' => 'Unknown',
                'latitude' => 0,
                'longitude' => 0,
            ];
        }

        // Initialize agent for device detection
        $agent = new Agent();

        // Fetch country details from database
        $country = DB::table('countries')
            ->select('id')
            ->where('name', $location->countryName)
            ->first();

        // Default country ID if not found
        $countryId = $country->id ?? 1; // Set default country ID if not found

        // Fetch timezone details from database
        $timeZone = DB::table('timezones')
            ->select('name')
            ->where('country_id', $countryId)
            ->first();

        // Default timezone if not found
        $timeZoneName = $timeZone->name ?? 'Asia/Karachi';

        // Prepare the user details array
        return [
            'ip_address' => $ip,
            'device' => $agent->device() ?? 'Unknown',
            'device_type' => $agent->isDesktop() ? 'Desktop' : ($agent->isTablet() ? 'Tablet' : 'Mobile'),
            'platform' => $agent->platform() ?? 'Unknown',
            'platform_version' => $agent->version($agent->platform()) ?? 'Unknown',
            'browser' => $agent->browser() ?? 'Unknown',
            'browser_version' => $agent->version($agent->browser()) ?? 'Unknown',
            'is_robot' => $agent->isRobot(),
            'user_agent' => $request->header('User-Agent') ?? 'Unknown',
            'country' => $location->countryName ?? 'Pakistan',
            'country_code' => $location->countryCode ?? 'PK',
            'state' => $location->regionName ?? 'Unknown',
            'time_zone' => $timeZoneName,
            'city' => $location->cityName ?? 'Unknown',
            'postal' => $location->zipCode ?? 'Unknown',
            'latitude' => $location->latitude ?? 0,
            'longitude' => $location->longitude ?? 0,
        ];
    }
}
