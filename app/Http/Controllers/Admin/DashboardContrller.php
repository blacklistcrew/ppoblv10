<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MstSetting;
use Inertia\Inertia;

class DashboardContrller extends Controller
{

    public function index()
    {
        $setting = MstSetting::first();

        return Inertia::render('Admin/Dashboard/Index', compact('setting'));
    }
}
