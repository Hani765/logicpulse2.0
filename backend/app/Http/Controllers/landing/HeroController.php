<?php

namespace App\Http\Controllers\landing;

use App\Http\Controllers\Controller;
use App\Models\landing\Landing;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class HeroController extends Controller
{
    // Fetch hero data  
    public function index()
    {
        $data = DB::table('landing')->where("key", 'hero')->first()->data;
        return $data;
    }

    // Store or update hero data
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validator = Validator::make($request->all(), [
            'heading' => 'required|string|max:255',
            'description' => 'required|string',
            'link' => 'required|url'
        ]);

        // If validation fails, return a response with errors
        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        // Retrieve existing hero section from the landing table
        $landing = DB::table('landing')->where('key', 'hero')->first();

        // If data exists, update it; otherwise, create new
        if ($landing) {
            DB::table('landing')->where('key', 'hero')->update([
                'data' => json_encode($request->only(['heading', 'description', 'link'])),
            ]);
        } else {
            DB::table('landing')->insert([
                'key' => 'hero',
                'data' => json_encode($request->only(['heading', 'description', 'link'])),
            ]);
        }
    }
}