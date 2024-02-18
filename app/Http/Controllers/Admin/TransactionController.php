<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{

    public function index()
    {
        return Inertia::render('Admin/Transaction/Index');
    }

    public function list(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string'],
            'per_page' => ['nullable', 'int'],
        ]);

        $q = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?: 10;

        $models = Transaction::with(['user'])
            ->where(function ($query) use ($q) {
                $query->orWhere('note', 'LIKE', "%$q%")
                    ->orWhere('product_name', 'LIKE', "%$q%")
                    ->orWhere('mtrpln', 'LIKE', "%$q%")
                    ->orWhere('token', 'LIKE', "%$q%")
                    ->orWhere('total', 'LIKE', "%$q%");
            })
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json($models);
    }

    public function show(Transaction $transaction)
    {
        $product = $transaction->product;
        $category = $product->category;

        return Inertia::render('Admin/Transaction/Show', compact('transaction', 'category', 'product'));
    }
}
