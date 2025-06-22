<?php

namespace App\Http\Controllers\Business;

use App\Http\Controllers\Business\Service\DestroyService;
use App\Http\Controllers\Business\Service\IndexService;
use App\Http\Controllers\Business\Service\StoreService;
use App\Http\Controllers\Business\Service\UpdateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BusinessController extends Controller
{
    public function store(Request $request)
    {
        $ss = new StoreService($request->file('imageFilename'));

        return response()->json($ss->main());
    }

    public function update(Request $request)
    {
        $us = new UpdateService($request->file('imageFilename'), $request->input('token'));

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
