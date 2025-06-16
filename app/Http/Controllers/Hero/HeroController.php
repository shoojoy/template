<?php

namespace App\Http\Controllers\Hero;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Hero\Services\DestroyService;
use App\Http\Controllers\Hero\Services\IndexService;
use App\Http\Controllers\Hero\Services\StoreService;
use App\Http\Controllers\Hero\Services\UpdateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function index(): JsonResponse
    {
        $wrapper = ['status' => true, 'heroes' => (new IndexService())->main()['heroes'],];

        return response()->json($wrapper);
    }

    public function store(Request $request)
    {
        $ss = new StoreService($request->input('title'), $request->input('subTitle'), $request->file('imageFilename'));

        return response()->json($ss->main());
    }
    public function update(Request $request)
    {
        $us = new UpdateService($request->input('title'), $request->input('subTitle'), $request->file('imageFile'), $request->input('token'));

        return response()->json($us->main());
    }

    public function destroy(string $token)
    {
        $ds = new DestroyService($token);

        return response()->json($ds->main());
    }
}
