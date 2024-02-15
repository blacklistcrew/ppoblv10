<?php

namespace App\Http\Controllers;

use App\Models\MstSetting;
use App\Models\TrxDeposit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepositController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Deposit/Index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Deposit/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
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

    /**
     * Display the specified resource.
     */
    public function show(TrxDeposit $deposit)
    {
        return Inertia::render('Deposit/Show', compact('deposit'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TrxDeposit $deposit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TrxDeposit $deposit)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TrxDeposit $deposit)
    {
        //
    }
}
