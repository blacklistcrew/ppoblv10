<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MstBrand;
use Inertia\Inertia;

class DashboardContrller extends Controller
{
 
    public function index()
    {
        return Inertia::render('Admin/Dashboard/Index');
    }

}
