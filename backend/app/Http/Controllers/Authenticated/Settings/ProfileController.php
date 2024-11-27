<?php

namespace App\Http\Controllers\Authenticated\Settings;

use App\Http\Controllers\Controller;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\NotificationsSettings;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{

    public function edit(Request $request): Response
    {
        return Inertia::render('Settings/Profile/index', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
    public function changeLanguageTimeZone(Request $request): RedirectResponse
    {
        $request->validate([
            'language' => ['required', 'string'],
            'time_zone' => ['required', 'string'],
        ]);
        $user = Auth::user();
        $user = User::where('unique_id', $user->unique_id)->first();
        $user->language = $request->input('language');
        $user->time_zone = $request->input('time_zone');
        $user->save();
        return Redirect::route('profile.edit');
    }
    public function updateNotificationSettings()
    {
        $user = Auth::user();
        $notificationSettings = NotificationsSettings::firstOrCreate(
            ['user_id' => $user->id]
        );
        return response()->json($notificationSettings);
    }

}
