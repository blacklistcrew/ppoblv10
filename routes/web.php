<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardContrller;
use App\Http\Controllers\Admin\DepositController as AdminDepositController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TransactionController as AdminTransactionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Transaction\TransactionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Transaction\HistoryController;
use App\Http\Controllers\DepositController;
use App\Http\Controllers\DigiflazzWebhookController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;

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

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');
Route::get('/product', [WelcomeController::class, 'productList'])->name('welcome');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/transaction', [TransactionController::class, 'index'])->name('transaction');
    Route::get('/transaction/list-product/{category}', [TransactionController::class, 'listProduct'])->name('transaction.list-product');
    Route::get('/transaction/validate-pln', [TransactionController::class, 'validateNoPln'])->name('transaction.validate-pln');
    Route::post('/transaction/prepaid', [TransactionController::class, 'createPrepaid'])->name('transaction.prepaid');
    Route::post('/transaction/postpaid', [TransactionController::class, 'checkPostpaid'])->name('transaction.check-postpaid');
    Route::put('/transaction/postpaid/{transaction}', [TransactionController::class, 'payPostpaid'])->name('transaction.pay-postpaid');
    Route::get('/transaction/{code}', [TransactionController::class, 'show'])->name('transaction.process');

    Route::get('/deposit/list', [DepositController::class, 'list'])->name('deposit.list');
    Route::resource('deposit', DepositController::class)->except(['edit']);

    Route::get('/history', [HistoryController::class, 'index'])->name('history');
    Route::get('/history/list', [HistoryController::class, 'list'])->name('history.list');
    Route::get('/history/{transaction}', [HistoryController::class, 'show'])->name('history.show');
});

Route::group(['prefix' => 'admin',  'middleware' => ['auth', 'verified', 'role:admin']], function () {
    Route::get('/', [DashboardContrller::class, 'index'])->name('admin');

    Route::get('category', [CategoryController::class, 'index'])->name('admin.category');
    Route::get('category/{category}/edit', [CategoryController::class, 'edit'])->name('admin.category.edit');
    Route::put('category/{category}', [CategoryController::class, 'update'])->name('admin.category.update');

    Route::get('/product', [ProductController::class, 'index'])->name('admin.product');
    Route::get('/product/list', [ProductController::class, 'list'])->name('admin.product.list');
    Route::get('/product/{product}', [ProductController::class, 'show'])->name('admin.product.show');
    Route::put('/product/{product}', [ProductController::class, 'update'])->name('admin.product.update');

    Route::get('/user', [UserController::class, 'index'])->name('admin.user');
    Route::get('/user/list', [UserController::class, 'list'])->name('admin.user.list');
    Route::get('/user/{user}/edit', [UserController::class, 'edit'])->name('admin.user.edit');
    Route::put('/user/profile/{user}', [UserController::class, 'updateProfile'])->name('admin.user.profile.update');
    Route::put('/user/password/{user}', [UserController::class, 'updatePassword'])->name('admin.user.password.update');

    Route::get('/transaction', [AdminTransactionController::class, 'index'])->name('admin.transaction');
    Route::get('/transaction/list', [AdminTransactionController::class, 'list'])->name('admin.transaction.list');
    Route::get('/transaction/{transaction}', [AdminTransactionController::class, 'show'])->name('admin.transaction.show');

    Route::get('/deposit', [AdminDepositController::class, 'index'])->name('admin.deposit');
    Route::get('/deposit/list', [AdminDepositController::class, 'list'])->name('admin.deposit.list');
    Route::get('/deposit/{deposit}', [AdminDepositController::class, 'show'])->name('admin.show');
    Route::put('/deposit/{deposit}', [AdminDepositController::class, 'update'])->name('admin.update');

    Route::get('/setting', [SettingController::class, 'index'])->name('admin.setting');
    Route::put('/setting', [SettingController::class, 'update'])->name('admin.setting.update');
});

Route::group(['prefix' => 'webhook'], function () {
    Route::post('/digiflazz', [DigiflazzWebhookController::class, 'listen']);
});

require __DIR__ . '/auth.php';
