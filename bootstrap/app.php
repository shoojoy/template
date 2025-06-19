<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware as ConfigMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\AdminAuth;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
    )
    ->withMiddleware(function (ConfigMiddleware $middleware) {
        // CORS는 제일 먼저
        $middleware->prepend(HandleCors::class);

        // Inertia 미들웨어를 웹 요청 전체에 걸고 싶다면 append() 사용
        $middleware->append(HandleInertiaRequests::class);

        // alias는 선택 (route 그룹에서 개별 지정용)
        $middleware->alias([
            'auth.admin' => AdminAuth::class,
            'inertia'    => HandleInertiaRequests::class,
        ]);
    })
    ->withExceptions()
    ->create();
