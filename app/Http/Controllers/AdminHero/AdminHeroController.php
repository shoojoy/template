<?php

namespace App\Http\Controllers\AdminHero;

use App\Http\Controllers\AdminHero\Service\UpdateService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminHeroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function update(?string $title, ?string $subTitle, array $imageFiles)
    {
        $us = new UpdateService($title, $subTitle, $imageFiles);

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
