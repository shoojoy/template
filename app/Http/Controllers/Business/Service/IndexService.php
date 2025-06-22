<?php

namespace App\Http\Controllers\Business\Service;

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
            'medias' => $this->getBusinessImages()
        ];
    }

    private function getBusinessImages()
    {
        return DB::table('business_images')
            ->select([
                'image_filename',
                'token',
            ])
            ->get();
    }
}
