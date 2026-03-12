<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KattanaAuthController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

Route::get('auth/kattana/start', [KattanaAuthController::class, 'start'])
    ->name('auth.kattana.start');
Route::get('auth/kattana/callback', [KattanaAuthController::class, 'callback'])
    ->name('auth.kattana.callback');
Route::get('auth/kattana/logged-out', [KattanaAuthController::class, 'loggedOut'])
    ->name('auth.kattana.logged-out');
Route::post('auth/logout', [KattanaAuthController::class, 'logout'])
    ->middleware('auth')
    ->name('auth.logout');

Route::middleware('auth')->group(function (): void {
    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::resource('accounts', AccountController::class)->only([
        'index',
        'store',
        'update',
        'destroy',
    ]);
    Route::resource('categories', CategoryController::class)->only([
        'index',
        'store',
        'update',
        'destroy',
    ]);
    Route::resource('transactions', TransactionController::class)->only([
        'index',
        'store',
        'update',
        'destroy',
    ]);
    Route::get('reports', [ReportsController::class, 'index'])->name('reports');
    Route::get('reports/accounts', [ReportsController::class, 'accounts'])
        ->name('reports.accounts');
    Route::get('reports/cashflow', [ReportsController::class, 'cashflow'])
        ->name('reports.cashflow');
    Route::get('reports/categories', [ReportsController::class, 'categories'])
        ->name('reports.categories');
});
