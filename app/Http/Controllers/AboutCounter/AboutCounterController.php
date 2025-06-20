<?php

namespace App\Http\Controllers\AboutCounter;

use App\Http\Controllers\AboutCounter\Service\DestroyService;
use App\Http\Controllers\AboutCounter\Service\IndexService;
use App\Http\Controllers\AboutCounter\Service\StoreService;
use App\Http\Controllers\AboutCounter\Service\UpdateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AboutCounterController extends Controller
{
    public function store(Request $request)
    {
        $ss = new StoreService($request->input('title'), $request->input('value'));

        return response()->json($ss->main());
    }

    public function update(Request $request)
    {
        $us = new UpdateService($request->input('title'), $request->input('value'), $request->input('token'));

        return response()->json($us->main());
    }

    public function destroy(string $token)
    {
        $ds = new DestroyService($token);

        return response()->json($ds->main());
    }

    public function index(): JsonResponse
    {
        $is = new IndexService();

        return response()->json($is->main());
    }
}
