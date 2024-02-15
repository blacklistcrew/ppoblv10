<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MstProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{

    public function index(): Response
    {
        return Inertia::render('Admin/Product/Index');
    }

    public function list(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string'],
            'per_page' => ['nullable', 'int'],
        ]);

        $q = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?: 10;

        $models = MstProduct::where('name', 'LIKE', "%$q%")
            ->paginate($perPage);

        return response()->json($models);
    }
}
