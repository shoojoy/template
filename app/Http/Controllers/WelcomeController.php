<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class WelcomeController extends Controller
{
    public function index()
    {
        $heroes = $this->getHeroes();

        if (!$heroes) {
            return redirect('/admins/SignIn');
        };

        return Inertia::render('welcome', [
            'heroes' => $heroes,
        ]);
    }

    private function getHeroes()
    {
        return DB::table('heroes')
            ->select([
                'index',
                'title',
                'subtitle',
                'token',
                'image_filename AS image',
            ])
            ->get();
    }

    private function getAbouts()
    {
        //
    }
}
