<?php

namespace App\Http\Requests\Authenticated;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|unique:users',
            'email' => 'required|unique:users',
            'password' => 'required',
            'role' => 'required|string',
            'domain_id' => 'required|string',
            'rate' => 'required|string',
            'phone' => 'required|string',
            'skype' => 'required|string',
            'details' => 'nullable|string',
            'age' => 'nullable|string',
            'dob' => 'nullable|string',
            'country' => 'nullable|string',
            'city' => 'nullable|string',
            'province' => 'nullable|string',
            'time_zone' => 'nullable|string',
            'email_verification_token' => 'nullable|string',
            'profile_image' => 'nullable|string',
            'status' => 'required|string',
            'notification' => 'required|string',
            'isVerified' => 'required|string',
            'email_verified_at' => 'nullable|string',
            'offer_ids' => 'nullable|string',
        ];
    }
}
