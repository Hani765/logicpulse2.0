<?php

namespace App\Http\Controllers\API\Authentication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Auth\Events\Registered; // Import event if you want to trigger registration email
use App\Mail\VerificationReminderMail; // If you want to send custom verification email
use App\Models\User;

class LoginController extends Controller
{

    public function checkCredentials(Request $request)
    {
        // Validate the input
        $validate = $request->validate([
            "email" => "required|email",
            "password" => "required|string"
        ]);
        try {
            //code...
            // Attempt to authenticate the user
            if (Auth::attempt($validate)) {
                $user = Auth::user();

                // Check if the user's email is verified
                if ($user->email_verified_at === null) {
                    // Send the verification email (using Laravel's built-in method)
                    $user->sendEmailVerificationNotification(); // This sends the default verification email

                    return response()->json([
                        "status" => "verification-error",
                        "message" => "Your email is not verified. A verification email has been sent to your email address."
                    ], 401); // Unauthorized status
                }

                return response()->json([
                    "status" => "success",
                    "message" => "Login successful",
                    "user" => $user
                ], 200);
            }
            return response()->json([
                "status" => "error",
                "message" => "Invalid email or password"
            ], 401);
        } catch (\Exception $err) {
            return response()->json([
                "status" => "error",
                "message" => $err->getMessage()
            ], 400);
        }
    }
    public function login(Request $request)
    {
        // Validate the input
        $validate = $request->validate([
            "email" => "required|email",
            "password" => "required"
        ]);
        try {
            $user = User::where("email", $request->email)->first();
            if ($user) {
                if (!Hash::check($request->password, $user->password)) {
                    return response()->json([
                        "status" => "error",
                        "message" => "Invalid email or password"
                    ], 401);
                }
                $toekn = $user->createToken("web")->plainTextToken;
                $authRes = array_merge($user->toArray(), ["token" => $toekn]);
                return response()->json([
                    "message" => "Login successful",
                    "user" => $authRes
                ], 200);
            } else {
                return response()->json([
                    "status" => "error",
                    "message" => "Invalid email or password"
                ], 401);
            }
        } catch (\Exception $err) {
            return response()->json([
                "status" => "error",
                "message" => $err->getMessage()
            ], 400);
        }

    }
}
