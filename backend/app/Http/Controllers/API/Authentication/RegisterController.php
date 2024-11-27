<?php

namespace App\Http\Controllers\API\Authentication;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\UserDetailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use App\Rules\NotSimilar;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Str;
use Inertia\Response;
class RegisterController extends Controller
{
    protected $userDetailService;
    public function __construct(UserDetailService $userDetailService)
    {
        $this->userDetailService = $userDetailService;
    }

    public function store(Request $request)
    {
        // List of valid email domains
        $validEmailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'];

        // Validate the request
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|lowercase|string|max:255|unique:users,username',
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                'unique:' . User::class,
                function ($attribute, $value, $fail) use ($validEmailDomains) {
                    $emailDomain = substr(strrchr($value, "@"), 1);
                    if (!in_array($emailDomain, $validEmailDomains)) {
                        $fail('The email address must be from a valid domain.');
                    }
                },
            ],
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'regex:/[a-z]/',
                'regex:/[A-Z]/',
                'regex:/[\W_]/',
                Rules\Password::defaults(),
                new NotSimilar($request->username, $request->email),
            ],
        ], [
            'password.min' => 'The password must be at least 8 characters long.',
            'password.regex' => 'The password must include at least one uppercase letter, one lowercase letter, and one symbol.',
        ]);

        // Get user details
        $userDetails = $this->userDetailService->getUserDetails($request);

        // Create the user
        $user = User::create([
            'unique_id' => Str::uuid(),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'country' => $userDetails['country'],
            'city' => $userDetails['city'],
            'time_zone' => $userDetails['time_zone'],
            'state' => $userDetails['state'],
        ]);

        // Trigger the Registered event
        event(new Registered($user));

        // Log the user in
        Auth::login($user);

        // Redirect to the dashboard
        return response()->json([
            "status" => "success",
            "message" => "Account created successfully!",
        ], 200);
    }
}
