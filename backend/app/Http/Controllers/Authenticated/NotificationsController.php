<?php
namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $userId = $user->unique_id;

        // Fetch notifications where the user's ID is in the comma-separated user_ids
        $notifications = Notification::whereRaw('FIND_IN_SET(?, user_ids)', [$userId])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Notifications/index', [
            'data' => $notifications,
            'user' => $user,
        ]);
    }


    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = Notification::where('id', $id)->first();

        if ($notification) {
            $notification->pivot->read_at = now();
            $notification->pivot->save();
        }

        return redirect()->back();
    }
}
