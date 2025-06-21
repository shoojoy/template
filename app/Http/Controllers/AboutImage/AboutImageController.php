<?php

namespace App\Http\Controllers\AboutImage;

use App\Http\Controllers\AboutImage\Service\DestroyService;
use App\Http\Controllers\AboutImage\Service\IndexService;
use App\Http\Controllers\AboutImage\Service\StroreService;
use App\Http\Controllers\AboutImage\Service\UpdateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AboutImageController extends Controller
{
    public function store(Request $request)
    {
        $ss = new StroreService($request->file('imageFilename'));

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
