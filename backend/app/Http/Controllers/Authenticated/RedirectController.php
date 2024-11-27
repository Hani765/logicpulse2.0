<?php

namespace App\Http\Controllers\Authenticated;

use App\Events\ClickConversionRecieved;
use App\Http\Controllers\Controller;
use App\Models\Click;
use App\Models\ClickDetail;
use App\Models\Domain;
use App\Models\Network;
use App\Models\Offers;
use App\Models\Source;
use App\Models\sources;
use App\Models\Tracker;
use App\Models\User;
use App\Services\UserDetailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\CreateNotificationService;

class RedirectController extends Controller
{
    protected $userDetailService;

    // Inject the UserDetailService
    public function __construct(UserDetailService $userDetailService)
    {
        $this->userDetailService = $userDetailService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $notificationSerive = new CreateNotificationService();
        $error = false;
        $userId = $request['p'];
        $offerId = $request['o'];
        $source_id = $request['u'];
        $current_url = url()->current();
        if ($userId && $offerId) {

            if ($source_id) {
                $source = Source::select('value')->where('unqiue_id', $source_id)->first();
            } else {
                $source = '';
            }
            // Fetch user data
            $user = User::select('role', 'manager_id', 'admin_id', 'username', 'unique_id')
                ->where('unique_id', $userId)
                ->where('status', 'active')
                ->first();
            if ($user) {
                // Fetch offer data
                $offer = Offers::where('id', $offerId)->where('status', 'active')->first();

                if ($offer) {
                    $domain = Domain::where('unique_id', $offer->domain_id)->first();
                    $offer_url = $domain->name . '/redirect';
                    if ($offer_url === $current_url) {                       // Fetch network and tracker data
                        $network = Network::where('unique_id', $offer->network_id)->first();
                        $tracker = Tracker::where('unique_id', $network->tracker_id)->first();
                        if (
                            $network && $tracker && // Make sure both $network and $tracker are not null
                            $network->status === 'active' &&
                            $tracker->status === 'active' &&
                            $domain->status === 'active'
                        ) {
                            // Determine user's accessible offers based on role
                            $offersQuery = $this->getAccessibleOffers($user, $userId);
                            if (!empty($offersQuery) || str_contains($offersQuery, $offerId)) {
                                $userDetails = $this->userDetailService->getUserDetails($request);
                                $create = Click::create();
                                $unique_id = Str::uuid();
                                $role = $user->role;

                                $payload = [
                                    'unique_id' => $unique_id,
                                    'click_id' => $create->id,
                                    'offer_id' => $offer->unique_id,
                                    'network_id' => $offer->network_id,
                                    'tracker_id' => $tracker->unique_id,
                                    'domain_id' => $offer->domain_id,
                                    'rate' => 100,
                                    'user_id' => $userId,
                                    'manager_id' => $user->manager_id,
                                    'admin_id' => $user->admin_id,
                                    'source_id' => $source || '',
                                    'ip_address' => $userDetails['ip_address'],
                                    'country' => $userDetails['country'],
                                    'state' => $userDetails['state'],
                                    'city' => $userDetails['city'],
                                    'postal' => $userDetails['postal'],
                                    'latitude' => $userDetails['latitude'],
                                    'longitude' => $userDetails['longitude'],
                                    'device' => $userDetails['device'],
                                    'device_type' => $userDetails['device_type'],
                                    'platform' => $userDetails['platform'],
                                    'platform_version' => $userDetails['platform_version'],
                                    'browser' => $userDetails['browser'],
                                    'browser_version' => $userDetails['browser_version'],
                                    'is_robot' => $userDetails['is_robot'],
                                    'user_agent' => $userDetails['user_agent'],
                                ];
                                $detailsCreate = ClickDetail::create($payload);
                                if ($detailsCreate) {
                                    $urls = $offer->urls; // Assuming $offer->urls returns an array like the one you shared

                                    // Get the user's device type from $userDetails
                                    $userDeviceType = $userDetails['device_type'];

                                    // Find a URL that matches the user's device type
                                    $matchedUrl = null;
                                    // foreach ($urls as $urlObj) {
                                    //     if ($urlObj['deviceType'] === $userDeviceType) {
                                    //         $matchedUrl = $urlObj['url'];
                                    //         break;
                                    //     }
                                    // }

                                    // // If no exact match, check for 'all' device type
                                    // if (!$matchedUrl) {
                                    //     foreach ($urls as $urlObj) {
                                    //         if ($urlObj['deviceType'] === 'all') {
                                    //             $matchedUrl = $urlObj['url'];
                                    //             break;
                                    //         }
                                    //     }
                                    // }

                                    // If a matching URL is found, redirect to it
                                    $user_ids = $userId . ',' . $user->manager_id . ',' . $user->admin_id;
                                    if ($role !== 'administrator') {
                                        $roles = 'administrator';

                                    } else {
                                        $roles = '';
                                    }
                                    $notificationSerive->clickConversoin($user_ids, $roles);
                                    return $matchedUrl;
                                    // return redirect()->away($matchedUrl);

                                } else {
                                    $error = 'Something went wrong! Please try again later or contact the service provider.';
                                }
                            } else {
                                $error = 'The user has not been granted access to this offer.';
                            }
                        } else {
                            $error = 'The offer URL is not correct. Please try again with a correct URL.';
                        }
                    } else {
                        $error = 'This offer is not accesble with that url. Please try again with a correct URL.';
                    }
                } else {
                    $error = 'The offer Id is not correct. Please try again with a correct URL.';
                }
            } else {
                $error = 'The user Id is not correct. Please try again with a correct URL.';
            }
        } else {
            $error = 'The required values not provided in url. Please try to copy paste url or contact with offer provider.';
        }
        return Inertia::render(
            'Redirect/index',
            [
                'error' => $error,
            ]
        );
    }

    private function getAccessibleOffers($user, $userId)
    {
        switch ($user->role) {
            case 'administrator':
                return Offers::pluck('unique_id')->implode(',');
            case 'admin':
                $offersQuery = Offers::where('user_id', $user->unique_id)->pluck('unique_id');
                $userOffersQuery = DB::table('offer_user')
                    ->where('user_unique_id', $userId)
                    ->pluck('offer_unique_ids')
                    ->first();
                return $offersQuery->implode(',') . ',' . $userOffersQuery;
            default:
                return DB::table('offer_user')
                    ->where('user_unique_id', $userId)
                    ->pluck('offer_unique_ids')
                    ->first();
        }
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
}
