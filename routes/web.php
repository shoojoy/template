<?php

use App\Http\Controllers\AboutImage\AboutImageController;
use App\Http\Controllers\AdminFooter\AdminFooterController;
use App\Http\Controllers\Auth\SignInController;
use App\Http\Controllers\Business\BusinessController;
use App\Http\Controllers\ConfigController;
use App\Http\Controllers\Header\HeaderController;
use App\Http\Controllers\Inquiry\InquiryController;
use App\Http\Controllers\Media\MediaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Auth\SignUpController;
use App\Http\Controllers\Hero\HeroController;
use App\Http\Controllers\AboutCounter\AboutCounterController;
use App\Http\Controllers\WelcomeController;

Route::get('/', [WelcomeController::class, 'index'])->name('home');

Route::get('admins/SignUp', function () {
    return Inertia::render('admins/SignUp');
})->name('admins.SignUp');
Route::post('admins/SignUp', [SignUpController::class, 'main'])
    ->name('admins.SignUp.post');
Route::post('admins/SignIn', [SignInController::class, 'main'])
    ->name('admins.SignIn.post');
Route::get('admins/SignIn', [SignInController::class, 'main'])->name('admins.SignIn');
Route::get('admins/SignIn', [SignInController::class, 'show'])->name('admins.SignIn');

Route::middleware('auth.admin')->group(function () {
    Route::get('/admin/footer', fn() => Inertia::render('adminComponents/Footer'))
        ->name('admin.footer');
    Route::get('/admin/hero', fn() => Inertia::render('adminComponents/Hero'))
        ->name('admin.hero');
    Route::get('/admin/media', fn() => Inertia::render('adminComponents/Media'))
        ->name('admin.media');
    Route::get('/admin/about', fn() => Inertia::render('adminComponents/About'))
        ->name('admin.about');
    Route::get('/admin/business', fn() => Inertia::render('adminComponents/Business'))
        ->name('admin.business');
    Route::get('/admin/inquiry', fn() => Inertia::render('adminComponents/Inquiry'))
        ->name('admin.inquiry');
    Route::get('/admin/header', fn() => Inertia::render('adminComponents/Header'))
        ->name('admin.header');
    Route::post('/admin/config', [ConfigController::class, 'main'])
        ->name('admin.config.update');

    Route::prefix('hero')->group(function () {
        Route::post('/store', [HeroController::class, 'store']);
        Route::put('/update', [HeroController::class, 'update']);
        Route::delete('/{token}', [HeroController::class, 'destroy']);
    });
    Route::prefix('media')->group(function () {
        Route::post('/store', [MediaController::class, 'store']);
        Route::put('/update', [MediaController::class, 'update']);
        Route::delete('/{token}', [MediaController::class, 'destroy']);
    });
    Route::prefix('about-counter')->group(function () {
        Route::post('/store', [AboutCounterController::class, 'store']);
        Route::put('/update', [AboutCounterController::class, 'update']);
        Route::delete('/{token}', [AboutCounterController::class, 'destroy']);
    });
    Route::prefix('about-image')->group(function () {
        Route::post('/store', [AboutImageController::class, 'store']);
        Route::put('/update', [AboutImageController::class, 'update']);
        Route::delete('/{token}', [AboutImageController::class, 'destroy']);
    });
    Route::prefix('business-image')->group(function () {
        Route::post('/store', [BusinessController::class, 'store']);
        Route::put('/update', [BusinessController::class, 'update']);
        Route::delete('/{token}', [BusinessController::class, 'destroy']);
    });
    Route::prefix('inquiry')->group(function () {
        Route::post('/store', [InquiryController::class, 'store']);
        Route::delete('/{token}', [InquiryController::class, 'destroy']);
        Route::put('/update', [InquiryController::class, 'update']);
    });
    Route::prefix('footer')->group(function () {
        Route::put('/update', [AdminFooterController::class, 'update']);
    });
    Route::prefix('header')->group(function () {
        Route::put('/update', [HeaderController::class, 'update']);
    });
});

Route::prefix('hero')->group(function () {
    Route::get('/', [HeroController::class, 'index']);
});
Route::prefix('media')->group(function () {
    Route::get('/', [MediaController::class, 'index']);
});
Route::prefix('about-counter')->group(function () {
    Route::get('/', [AboutCounterController::class, 'index']);
});
Route::prefix('about-image')->group(function () {
    Route::get('/', [AboutImageController::class, 'index']);
});
Route::prefix('business-image')->group(function () {
    Route::get('/', [BusinessController::class, 'index']);
});
Route::prefix('inquiry')->group(function () {
    Route::get('/', [InquiryController::class, 'index']);
});
Route::prefix('header')->group(function () {
    Route::get('/', [HeaderController::class, 'index']);
});


require __DIR__ . '/auth.php';
