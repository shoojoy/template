<?php

namespace App\Http\Controllers\Hero\Services;

use Illuminate\Support\Facades\Storage;

use App\Http\Service\Service;
use Illuminate\Support\Facades\DB;

class IndexService extends Service
{
    public function __construct()
    {
        //
    }

    public function main()
    {
        return [
            'status' => true,
            'heroes' => $this->getHeroes()
        ];
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
}
