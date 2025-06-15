<?php

namespace App\Http\Controllers\Hero;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Hero\Services\IndexService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function index(): JsonResponse
    {
        $wrapper = ['status' => true, 'heroes' => (new IndexService())->main()['heroes'],];

        return response()->json($wrapper);
    }
}
