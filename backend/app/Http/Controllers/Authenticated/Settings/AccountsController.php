<?php

namespace App\Http\Controllers\Authenticated\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Authenticated\SettingsRequest;
use App\Models\Setting;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AccountsController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 50); // Default to 50 items per page
        $page = $request->input('page', 1);
        $settingQuery = Setting::query();
        $setting = $settingQuery->paginate($perPage, ['*'], 'page', $page);
        $paginationData = [
            'current_page' => $setting->currentPage(),
            'last_page' => $setting->lastPage(),
            'first_page' => 1, // First page is always 1 in Laravel pagination
            'per_page' => $setting->perPage(),
            'total' => $setting->total(),
            'next_page' => $setting->currentPage() < $setting->lastPage() ? $setting->currentPage() + 1 : null,
            'prev_page' => $setting->currentPage() > 1 ? $setting->currentPage() - 1 : null,
        ];
        return Inertia::render('Settings/Account/index', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'data' => $setting,
            'pagination_data' => $paginationData,
            'error' => session('error'),
        ]);
    }
    public function show(Request $request, $id)
    {
        $perPage = $request->input('per_page', 50); // Default to 50 items per page
        $page = $request->input('page', 1);
        $settingQuery = Setting::select('value')->where('id', $id)->first();
        return response()->json($settingQuery);
    }
    public function store(SettingsRequest $request)
    {
        $user = Auth::user();
        if ($user->role !== 'administrator') {
            return redirect()->back()->with('error', 'Invalid Request! Only administrators can add remove or change these privilages.');
        }
        $payload = $request->validated();
        $settings = Setting::create($payload);
    }

    public function update(Request $request, $id)
    {
        try {
            // Ensure the user is authenticated
            $user = Auth::user();
            if ($user->role !== 'administrator') {
                return redirect()->back()->with('error', 'Invalid Request! Only administrators can add remove or change these privilages.');
            }

            $payload = $request->validat([
                'key' => ['required', 'string'],
                'value' => ['required', 'string'],
                'description' => ['nullable', 'string'],
                'status' => ['required', 'string'],
            ]);
            // Find the value by its id
            $value = Setting::where('id', $id)->first();
            // Delete the value
            $value->update($payload);
            // Return success response
        } catch (\Exception $err) {
            return redirect()->back()->with('error', 'Failed to delete value');
        }
    }
    public function destroy(Request $request, $id)
    {
        try {
            // Ensure the user is authenticated
            $user = Auth::user();
            if ($user->role !== 'administrator') {
                return redirect()->back()->with('error', 'Invalid Request! Only administrators can add remove or change these privilages.');
            }
            // Find the value by its id
            $value = Setting::where('id', $id)->firstOrFail();

            // Delete the value
            $value->delete();
            // Return success response
        } catch (\Exception $err) {
            return redirect()->back()->with('error', 'Failed to delete value');
        }
    }
}
