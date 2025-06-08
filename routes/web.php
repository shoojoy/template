<?php

use App\Http\Controllers\Auth\SignInController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\SignUpController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('admins/SignUp', function () {
    return Inertia::render('admins/SignUp');
})->name('admins.SignUp');
Route::post('admins/SignUp', [SignUpController::class, 'main'])
    ->name('admins.SignUp.post');
Route::get('admins/SignIn', function () {
    return Inertia::render('admins/SignIn');
})->name('admins.SignIn');
Route::post('admins/SignIn', [SignInController::class, 'main'])
    ->name('admins.SignIn.post');

require __DIR__ . '/auth.php';
