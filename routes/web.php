<?php

use App\Http\Controllers\Auth\SignInController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\SignUpController;
use App\Http\Controllers\Hero\HeroController;

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

Route::middleware('auth.admin')->group(function () {
    Route::get('/admin/footer', fn() => Inertia::render('adminComponents/AdminFooter'))
        ->name('admin.footer');
    Route::get('/admin/hero', fn() => Inertia::render('adminComponents/AdminHero'))
        ->name('admin.hero');

    Route::prefix('hero')->group(function () {
        //
    });
});

Route::prefix('hero')->group(function () {
    Route::get('/', [HeroController::class, 'index']);
});

require __DIR__ . '/auth.php';
