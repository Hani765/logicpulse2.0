<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Models\Sessions;
use App\Services\UserDetailService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class SessionController extends Controller
{
    protected $userDetailService;

    // Inject the UserDetailService
    public function __construct(UserDetailService $userDetailService)
    {
        $this->userDetailService = $userDetailService;
    }
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $user = Auth::user();
        $sessions = Sessions::query()
            ->where("user_id", $user->id)
            ->get()
            ->map(function ($session) {
                $session->is_active = $session->id === session()->getId();
                return $session;
            });
        return response()->json($sessions);
    }
    public function update(Request $request)
    {

        $newSessionId = session()->getId();
        // Get the user details
        $userDetails = $this->userDetailService->getUserDetails($request);

        // Log the query for debugging
        $sessionQuery = Sessions::where('id', $newSessionId);

        $session = $sessionQuery->first();
        if (!$session) {
            // Redirect back with an error message
            return response()->json(['session' => 'Session not found']);
        }
        // Update the session with the new data
        $session->update($userDetails);
        return redirect()->intended(route('dashboard', absolute: false));
    }

    public function destroy(Request $request, $id): RedirectResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $session = Sessions::find($id);
        if ($session && $session->user_id === Auth::id()) {
            $session->delete();
            return Redirect::route('profile.edit');
        } else {
            return response()->json(['message' => 'Session not found or unauthorized'], 404);
        }
    }
}
