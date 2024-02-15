<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MstBrand;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
 
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Brand/Index', [
            'models' => MstBrand::all()
        ]);
    }

}
