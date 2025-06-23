<?php

namespace App\Http\Controllers\Header\Service;

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
            'medias' => $this->getAdminImage()
        ];
    }

    private function getAdminImage()
    {
        return DB::table('admins')
            ->select([
                'logo_image_filename as image',
                'token',
            ])
            ->get();
    }
}
