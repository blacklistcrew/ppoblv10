<?php

namespace App\Http\Controllers;

use App\Models\MstSetting;
use App\Models\TrxDeposit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepositController extends Controller
{

    public function index()
    {
        return Inertia::render('Deposit/Index');
    }

    public function list(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string'],
            'per_page' => ['nullable', 'int'],
        ]);

        $q = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?: 10;

        $deposits = TrxDeposit::where('user_id', $request->user()->id)
            ->when($q, function ($qry, $q) {
                $qry->where('bank', 'like', "%$q%")
                    ->orWhere('account_number', 'like', "%$q%");
            })
            ->orderByDesc('id')
            ->paginate($perPage);

        return response()->json($deposits);
    }

    public function create()
    {
        return Inertia::render('Deposit/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nominal' => ['required', 'int'],
        ]);

        try {
            $setting = MstSetting::first();

            $model = new TrxDeposit();
            $model->nominal = $validated['nominal'];
            $model->bank = $setting->bank;
            $model->account_number = $setting->account_number;
            $model->user_id = $request->user()->id;
            $model->save();

            return response()->json([
                'success' => true,
                'id' => $model->id,
                'message' => 'Success create deposit. Please transfer to this account number',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Something errors.' . $th->getMessage(),
            ]);
        }
    }

    public function show(TrxDeposit $deposit)
    {
        return Inertia::render('Deposit/Show', compact('deposit'));
    }

    public function update(Request $request, TrxDeposit $deposit)
    {
        $userId = $request->user()->id;

        if ($userId == $deposit->user_id && $deposit->status = TrxDeposit::STAT_WAITING_PAYMENT) {
            $request->validate([
                'image' => ['required', 'image', 'mimes:png,jpg,jpeg', 'max:2048']
            ]);

            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images/deposit'), $imageName);

            try {
                $deposit->status = TrxDeposit::STAT_WAITING_APPROVAL;
                $deposit->image = $imageName;
                $deposit->save();

                return response()->json([
                    'success' => true,
                    'message' => 'Success update deposit'
                ]);
            } catch (\Throwable $th) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please try again. ' . $th->getMessage(),
                ]);
            }
        }
    }

    public function destroy(Request $request, TrxDeposit $deposit)
    {
        $userId = $request->user()->id;

        if ($userId == $deposit->user_id && $deposit->status = TrxDeposit::STAT_WAITING_PAYMENT) {
            $deposit->status = TrxDeposit::STAT_FAILED;
            $deposit->save();

            return response()->json([
                'success' => true,
                'message' => 'Deposit success cancel',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Deposit cannot cancel',
        ]);
    }
}
