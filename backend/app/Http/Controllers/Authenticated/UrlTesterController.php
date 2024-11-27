<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class UrlTesterController extends Controller
{
    public function index()
    {
        return Inertia::render("UrlTester/index");
    }
    public function store(Request $request)
    {
        return response()->json(['response' => 'working well'], 404);
    }
}
