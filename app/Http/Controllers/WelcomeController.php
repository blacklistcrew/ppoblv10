<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MstProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{

    public function index(): Response
    {
        return Inertia::render('Welcome');
    }

    public function productList(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string'],
            'per_page' => ['nullable', 'int'],
        ]);

        $q = $validated['q'] ?? null;
        $perPage = $validated['per_page'] ?: 10;

        $models = MstProduct::select(['name', 'total', 'status', DB::raw('CASE WHEN status=1 THEN "Active" ELSE "Inactive" END status_name')])
            ->when($q, function ($qry, $q) {
                $qry->where('name', 'LIKE', "%$q%")
                    ->orWhere('total', 'LIKE', "%$q%")
                    ->orWhere(DB::raw("CASE WHEN status=1 THEN 'Active' ELSE 'Inactive' END"), 'LIKE', "%$q%");
            })
            ->paginate($perPage);

        return response()->json($models);
    }
}
