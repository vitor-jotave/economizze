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
