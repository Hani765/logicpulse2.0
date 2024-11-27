<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationReminderMail;
use Illuminate\Support\Carbon;

class VerificationController extends Controller
{
    // Verify email
    public function verify(Request $request, $id, $hash)
    {
        $user = \App\Models\User::findOrFail($id);

        // Check if the hash matches the user's email verification hash
        if (hash_equals((string) $hash, (string) \Illuminate\Support\Facades\Hash::make($user->getEmailForVerification()))) {
            if ($user->hasVerifiedEmail()) {
                return response()->json([
                    'status' => 'success',
                    'message' => 'Email already verified.'
                ], 200);
            }

            $user->markEmailAsVerified();
            event(new Verified($user));

            return response()->json([
                'status' => 'success',
                'message' => 'Email verified successfully.'
            ], 200);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Invalid verification link or expired.'
        ], 400);
    }

    public function resendVerificationEmail(Request $request)
    {
        // Ensure the user is authenticated
        $user = Auth::user();

        if ($user && !$user->hasVerifiedEmail()) {
            // Send verification email
            $user->sendEmailVerificationNotification();

            return response()->json([
                'status' => 'success',
                'message' => 'A new verification link has been sent to your email address.'
            ], 200);
        }

        // If email is already verified
        return response()->json([
            'status' => 'error',
            'message' => 'Your email is already verified.',
            "user" => $user,
        ], 400);
    }
}
