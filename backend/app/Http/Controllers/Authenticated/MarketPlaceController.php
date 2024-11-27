<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Models\Offers;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth; // Don't forget to include this

class MarketPlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('MarketPlace/index');
    }

    public function fetchOffers(Request $request)
    {
        // Start building the query with base conditions (status = active)
        $query = Offers::with('category')->where('status', 'active'); // Eager load the category relationship

        // Check if the user is authenticated
        if (Auth::check()) {
            // Get the authenticated user
            $user = Auth::user();

            // Filter offers based on the user's role
            switch ($user->role) {
                case 'administrator':
                    // Optionally add condition for administrator
                    break;

                case 'admin':
                    $query->where('visibility', 'admin');
                    break;

                case 'manager':
                    $query->where('visibility', 'manager');
                    break;

                case 'user':
                    $query->where('visibility', 'user');
                    break;
            }
        } else {
            // If not authenticated, show only public offers
            $query->where('visibility', 'public');
        }

        // Apply category filter if present in the request
        if ($request->has('category') && !empty($request->category)) {
            $query->where('category_id', $request->category);
        }

        // Apply search query (q) filter if present in the request
        if ($request->has('q') && !empty($request->q)) {
            $query->where('offer_name', 'like', '%' . $request->q . '%');
        }

        // Paginate and return the results (30 per page)
        $offers = $query->orderBy('id', 'desc')->paginate(30);

        $response = [];
        foreach ($offers as $offer) {
            $response[] = [
                'id' => $offer->id,
                'unique_id' => $offer->unique_id,
                'image' => '/assets/default-image.jpg',
                'title' => $offer->offer_name,
                'category' => $offer->category ? $offer->category->name : null,  // Now this should not be null
                'created_at' => Carbon::parse($offer->created_at)->format('Y-m-d H:i:s'),
                'updated_at' => Carbon::parse($offer->updated_at)->format('Y-m-d H:i:s'),
                'status' => $offer->status,
            ];
        }

        return response()->json($response);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
