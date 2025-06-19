<?php

namespace App\Http\Controllers\Media;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Media\Service\DestroyService;
use App\Http\Controllers\Media\Service\IndexService;
use App\Http\Controllers\Media\Service\StoreService;
use App\Http\Controllers\Media\Service\UpdateService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MediaController extends Controller
{
    public function index(): JsonResponse
    {
        $is = new IndexService();

        return response()->json($is->main());
    }
    public function store(Request $request)
    {
        $ss = new StoreService($request->input('title'), $request->file('imageFilename'));

        return response()->json($ss->main());
    }

    public function update(Request $request)
    {
        $us = new UpdateService($request->input('title'), $request->file('imageFilename'), $request->input('token'));

        return response()->json($us->main());
    }

    public function destroy(string $token)
    {
        $ds = new DestroyService($token);

        return response()->json($ds->main());
    }
}
