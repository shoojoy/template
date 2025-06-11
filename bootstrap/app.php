<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Middleware as ConfigMiddleware;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
    )
    ->withMiddleware(function (ConfigMiddleware $middleware) {
        $middleware->prepend(HandleCors::class);

        $middleware->statefulApi();
        $middleware->alias([
            'auth.admin' => \App\Http\Middleware\AdminAuth::class,
        ]);
    })
    ->withExceptions()
    ->create();
