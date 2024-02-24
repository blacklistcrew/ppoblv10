<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MstSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{

    public function index(): Response
    {
        $model = MstSetting::first();

        return Inertia::render('Admin/Setting/Index', compact('model'));
    }

    public function update(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'logo' => ['nullable', 'image', 'mimes:png'],
            'bank' => ['required', 'string'],
            'account_number' => ['required', 'string'],
            'use_prod' => ['required', Rule::in([0, 1])],
            'api_username' => ['nullable', 'string'],
            'api_dev_key' => ['nullable', 'string'],
            'api_prod_key' => ['nullable', 'string'],
            'api_secret' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ]);
        }

        $validated = $validator->validated();

        $model = MstSetting::first();
        $model->fill($validated);

        if ($request->image) {
            $imageName = 'logo.' . $request->image->extension();

            if ($model->logo) {
                File::delete('images/' . $model->logo);
            }

            $request->image->move(public_path('images'), $imageName);
            $model->logo = $imageName;
        }

        try {
            $model->save();

            return response()->json([
                'success' => true,
                'message' => 'Success update setting'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Please try again. ' . $th->getMessage(),
            ]);
        }

        return response()->json([]);
    }
}
