<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;

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
