<?php

use App\Http\Controllers\AdminFooter\AdminFooterController;
use Illuminate\Support\Facades\Route;

Route::get('admin-footer', [AdminFooterController::class, 'index']);
Route::put('admin-footer', [AdminFooterController::class, 'update'])
    ->middleware('auth.admin');
