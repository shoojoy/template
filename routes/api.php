<?php

use App\Http\Controllers\AdminFooter\AdminFooterController;
use App\Http\Controllers\AdminHero\AdminHeroController;
use App\Http\Controllers\Auth\SignInController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::put('/admin-footer', [AdminFooterController::class, 'update']);
    Route::put('/admin-hero', [AdminHeroController::class, 'update']);
});
Route::post('/admins/SignIn', [SignInController::class, 'main']);
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
