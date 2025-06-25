<?php

namespace App\Http\Controllers\BusinessHistory;

use App\Http\Controllers\BusinessHistory\Service\DestroyService;
use App\Http\Controllers\BusinessHistory\Service\IndexService;
use App\Http\Controllers\BusinessHistory\Service\StoreService;
use App\Http\Controllers\BusinessHistory\Service\UpdateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BusinessHistoryController extends Controller
{
    public function store(Request $request)
    {
        $ss = new StoreService($request->input('content'), $request->input('year'));

        return response()->json($ss->main());
    }

    public function update(Request $request)
    {
        $us = new UpdateService($request->input('content'), $request->input('year'), $request->input('token'));

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
