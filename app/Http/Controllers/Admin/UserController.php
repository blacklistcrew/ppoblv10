<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{

    public function index(): Response
    {
        return Inertia::render('Admin/User/Index');
    }

    public function list(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string'],
            'per_page' => ['nullable', 'int'],
        ]);

        $q = $validated['q'] ?? '';
        $perPage = $validated['per_page'] ?: 10;

        $models = User::when($q, function ($qry, $q) {
            $qry->where('username', 'LIKE', "%$q%")
                ->orWhere('name', 'LIKE', "%$q%")
                ->orWhere('email', 'LIKE', "%$q%")
                ->orWhere('saldo', 'LIKE', "%$q%")
                ->orWhere(DB::raw("(CASE WHEN status=1 THEN 'active' ELSE 'inactive' END)"), 'LIKE', "%$q%");
        })
            ->paginate($perPage);

        return response()->json($models);
    }

    public function edit(Request $request, User $user): Response
    {
        return Inertia::render('Admin/User/Edit', compact('user'));
    }

    public function updateProfile(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'username' => ['required', 'string', 'lowercase', 'string', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'name' => ['required', 'string'],
            'status' => ['required', Rule::in([0, 1])]
        ]);

        try {
            $user->fill($validated);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Success update profile'
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Something wrong.' . $th->getMessage(),
            ]);
        }
    }

    public function updatePassword(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Success update password'
        ]);
    }
}
