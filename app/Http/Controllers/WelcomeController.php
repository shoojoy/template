<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

use function PHPUnit\Framework\isEmpty;

class WelcomeController extends Controller
{
    public function index()
    {
        $heroes = $this->getHeroes();

        if ($heroes->isEmpty()) {
            return redirect('/admins/SignIn');
        };

        $medias = $this->getMedias();

        if ($medias->isEmpty()) {
            return redirect('/admins/SignIn');
        }

        return Inertia::render('welcome', [
            'heroes' => $heroes,
            'medias' => $medias
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

    private function getMedias()
    {
        return DB::table('medias')
            ->select([
                'title',
                'image_filename AS image',
                'token'
            ])
            ->get();
    }
}
