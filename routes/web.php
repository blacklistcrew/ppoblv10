<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardContrller;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Transaction\TransactionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Transaction\HistoryController;
use App\Http\Controllers\DepositController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/transaction', [TransactionController::class, 'index'])->name('transaction');
    Route::get('/transaction/list-product', [TransactionController::class, 'listProduct'])->name('transaction.list-product');
    Route::get('/transaction/validate-pln', [TransactionController::class, 'validateNoPln'])->name('transaction.validate-pln');
    Route::post('/transaction/prepaid', [TransactionController::class, 'createPrepaid'])->name('transaction.prepaid');
    Route::post('/transaction/postpaid', [TransactionController::class, 'checkPostpaid'])->name('transaction.check-postpaid');
    Route::put('/transaction/postpaid/{transaction}', [TransactionController::class, 'payPostpaid'])->name('transaction.pay-postpaid');
    Route::get('/transaction/{code}', [TransactionController::class, 'show'])->name('transaction.process');

    Route::resource('deposit', DepositController::class);

    Route::get('/history', [HistoryController::class, 'index'])->name('history');
    Route::get('/history/list', [HistoryController::class, 'list'])->name('history.list');
    Route::get('/history/{transaction}', [HistoryController::class, 'show'])->name('history.show');
});

Route::group(['prefix' => 'admin',  'middleware' => ['auth', 'verified', 'role:admin']], function () {
    Route::get('/', [DashboardContrller::class, 'index'])->name('admin');

    Route::get('category', [CategoryController::class, 'index'])->name('admin.category');
    Route::get('category/{category}/edit', [CategoryController::class, 'edit'])->name('admin.category.edit');
    Route::put('category/{category}', [CategoryController::class, 'update'])->name('admin.category.update');

    Route::get('/brand', [BrandController::class, 'index'])->name('admin.brand');
    Route::get('/product', [ProductController::class, 'index'])->name('admin.product');
    Route::get('/product/list', [ProductController::class, 'list'])->name('admin.product.list');
});

require __DIR__ . '/auth.php';
