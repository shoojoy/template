<?php

namespace App\Http\Controllers\Inquiry;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Inquiry\Service\DestroyService;
use App\Http\Controllers\Inquiry\Service\IndexService;
use App\Http\Controllers\Inquiry\Service\StoreService;
use App\Http\Controllers\Inquiry\Service\UpdateService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InquiryController extends Controller
{
    public function store(Request $request)
    {
        $ss = new StoreService($request->input('name'), $request->input('phoneNumber'), $request->input('email'), $request->input('title'), $request->input('text'));

        return response()->json($ss->main());
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

    public function update(Request $request)
    {
        $us = new UpdateService($request->input('token'), (int) $request->input('isChecked'));

        return response()->json($us->main());
    }
}
