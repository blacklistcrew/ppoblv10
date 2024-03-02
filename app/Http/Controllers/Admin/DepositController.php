<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrxDeposit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DepositController extends Controller
{

    public function index()
    {
        return Inertia::render('Admin/Deposit/Index');
    }

    public function list(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string'],
            'per_page' => ['nullable', 'int'],
        ]);

        $q = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?: 10;

        $deposits = TrxDeposit::when($q, function ($qry, $q) {
            $qry->where('bank', 'like', "%$q%")
                ->orWhere('account_number', 'like', "%$q%");
        })
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json($deposits);
    }

    public function show(TrxDeposit $deposit)
    {
        return Inertia::render('Admin/Deposit/Show', compact('deposit'));
    }

    public function update(Request $request, TrxDeposit $deposit)
    {
        $validated = $request->validate([
            'stat' => ['required', Rule::in([TrxDeposit::STAT_SUCCCESS, TrxDeposit::STAT_FAILED])],
        ]);

        try {
            $isApproved = $validated['stat'] == TrxDeposit::STAT_SUCCCESS;

            if ($isApproved) {
                $user = $deposit->user;
                $user->saldo += $deposit->nominal;
                $user->save();
            }

            $deposit->status = $isApproved ? TrxDeposit::STAT_SUCCCESS : TrxDeposit::STAT_FAILED;
            $deposit->save();

            return response()->json([
                'success' => true,
                'message' => 'Success process deposit'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Please try again. ' . $th->getMessage(),
            ]);
        }
    }
}
