<?php

namespace App\Http\Controllers\Authenticated\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardMessage extends Controller
{
    public function index()
    {
        $message = DB::table('message')->select('message')->where('id', '1')->first()->message;
        return response()->json(['message' => $message]);
    }
}
