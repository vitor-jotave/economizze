<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'dashboard')->name('home');
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
