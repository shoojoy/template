<?php

namespace App\Http\Controllers\AdminFooter;

use App\Http\Controllers\AdminFooter\Service\IndexService;
use App\Http\Controllers\AdminFooter\Service\UpdateService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class AdminFooterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $data = (new IndexService())->main();

        return response()->json([
            'status' => true,
            'footer' => $data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $us = new UpdateService($request->input('address'),  $request->input('companyName'), $request->input('ceoName'), $request->input('businessNumber'), $request->input('phone'), $request->input('fax'), $request->input('email'));

        return response()->json($us->main());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
