<?php

namespace App\Http\Controllers\Header;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Header\Service\IndexService;
use App\Http\Controllers\Header\Service\UpdateService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class HeaderController extends Controller
{
    public function update(Request $request)
    {
        $us = new UpdateService($request->file('LogoimageFilename'), $request->input('token'));

        return response()->json($us->main());
    }
    public function index(): JsonResponse
    {
        $is = new IndexService();

        return response()->json($is->main());
    }
}
