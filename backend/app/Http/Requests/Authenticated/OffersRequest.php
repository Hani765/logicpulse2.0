<?php

namespace App\Http\Requests\Authenticated;

use Illuminate\Foundation\Http\FormRequest;

class OffersRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Assuming authorization logic here, returning true for simplicity
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:offers,title',
            'description' => 'required|string|max:3000|min:50',
            'image' => 'nullable|string',
            'age' => 'required|integer|min:18',
            'rate' => 'required|numeric',
            'encryption' => 'nullable|string',
            'network_id' => 'required|string',
            'domain_id' => 'required|string',
            'category_id' => 'required|string',
            'keywords' => 'nullable|string|max:1000',
            'users_ids' => 'nullable|string',
            'urls' => 'array',
            'countries' => 'nullable|string',
            'proxy' => 'required|string',
            'status' => 'required|string|in:active,inactive,pause',
            'appliableFor' => 'required|string|in:everyone,admins,managers,users',

        ];
    }
}
