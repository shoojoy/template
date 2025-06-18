<?php

namespace App\Http\Controllers\Media;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Media\Service\IndexService;
use App\Http\Controllers\Media\Service\StoreService;
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
}
