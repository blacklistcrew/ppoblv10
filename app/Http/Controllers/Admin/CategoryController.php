<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MstCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Category/Index', [
            'models' => MstCategory::all()
        ]);
    }

    public function edit(Request $request, MstCategory $category): Response
    {
        return Inertia::render('Admin/Category/Edit', compact('category'));
    }

    public function update(Request $request, MstCategory $category): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:png,jpg,jpeg', 'max:2048']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
            ]);
        }

        $validated = $validator->validated();
        $imageName = $category->icon;

        if ($request->image) {
            $imageName = time() . '.' . $request->image->extension();
            $request->image->move(public_path('images'), $imageName);

            if ($category->icon) {
                File::delete('images/' . $category->icon);
            }
        }

        try {
            $category->name = $validated['name'];
            $category->icon = $imageName;
            $category->save();

            return response()->json([
                'success' => true,
                'message' => 'Success update category'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Please try again. ' . $th->getMessage(),
            ]);
        }
    }
}
