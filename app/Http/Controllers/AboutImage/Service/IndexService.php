<?php

namespace App\Http\Controllers\AboutImage\Service;

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
            'medias' => $this->getAboutImages()
        ];
    }

    private function getAboutImages()
    {
        return DB::table('about_images')
            ->select([
                'image_filename',
                'token',
            ])
            ->get();
    }
}
