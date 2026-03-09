<?php

use App\Http\Controllers\AccountController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'dashboard')->name('home');
Route::resource('accounts', AccountController::class)->only([
    'index',
    'store',
    'update',
    'destroy',
]);
