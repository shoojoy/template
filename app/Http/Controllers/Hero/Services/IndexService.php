<?php

namespace App\Http\Controllers\Hero\Services;

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
        $path = config('app.hero_image_file_path');
        return DB::table('heroes')
            ->select([
                'index',
                'title',
                'subtitle',
                DB::raw("CONCAT('{$path}', image_filename) AS image"),
            ])
            ->get();
    }
}
