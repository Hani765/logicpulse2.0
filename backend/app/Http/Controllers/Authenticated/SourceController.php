<?php

namespace App\Http\Controllers\Authenticated;

use App\Http\Controllers\Controller;
use App\Http\Requests\Authenticated\SourceRequest;
use App\Models\Source;
use App\Services\MetricsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Str;

class SourceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        try {
            $metricsService = new MetricsService();
            $today = $metricsService->getTodayDateInUserTimezone();
            $user = $metricsService->getUser();

            $perPage = $request->input('per_page', 50);
            $page = $request->input('page', 1);
            $q = $request->input('q', '');

            $roleToColumnMap = [
                'administrator' => '',
                'admin' => 'admin_id',
                'manager' => 'manager_id',
                'user' => 'user_id',
            ];

            if (!isset($roleToColumnMap[$user->role])) {
                return response()->json(['error' => 'Invalid role'], 400);
            }

            $domainsQuery = $this->getRowsquery($roleToColumnMap[$user->role]);

            if ($q) {
                $domainsQuery->where('value', 'like', "%$q%");
            }

            $domains = $domainsQuery->paginate($perPage, ['*'], 'page', $page);
            $response = [];
            $clickColumn = $roleToColumnMap[$user->role];

            foreach ($domains as $domain) {
                $metrics = $metricsService->getClicksAndConversions(
                    'domain',
                    $domain->unique_id,
                    $today,
                    $clickColumn
                );

                $response[] = [
                    'id' => $domain->id,
                    'unique_id' => $domain->unique_id,
                    'name' => $domain->name,
                    'clicks' => $metrics['clicks'],
                    'conversions' => $metrics['conversions'],
                    'cvr' => $metrics['cvr'],
                    'created_at' => $domain->created_at,
                    'updated_at' => $domain->updated_at,
                    'status' => $domain->status,
                ];
            }

            $paginationData = [
                'current_page' => $domains->currentPage(),
                'last_page' => $domains->lastPage(),
                'first_page' => 1,
                'per_page' => $domains->perPage(),
                'total' => $domains->total(),
                'next_page' => $domains->currentPage() < $domains->lastPage() ? $domains->currentPage() + 1 : null,
                'prev_page' => $domains->currentPage() > 1 ? $domains->currentPage() - 1 : null,
            ];

            return Inertia::render('Sources/index', [
                'data' => $response,
                'pagination' => $paginationData,
            ]);
        } catch (\Exception $err) {
            Log::error("Domain index error => " . $err->getMessage());
            return response()->json([
                "message" => "Something went wrong. Please try again later!"
            ], 500);
        }
    }
    private function getRowsquery(string $clickColumn)
    {
        $user = Auth::user();

        if ($user->role === 'administrator') {
            return Source::query();
        } else {
            abort(403, "Invalid role. You are not allowed to access this resource.");
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(SourceRequest $request)
    {
        $payload = $request->validated();
        try {
            $payload["unique_id"] = Str::uuid();
            $Source = Source::create($payload);
        } catch (\Exception $err) {
            Log::info("Source create error =>" . $err->getMessage());
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
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
