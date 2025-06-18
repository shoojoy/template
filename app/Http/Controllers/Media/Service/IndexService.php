<?php

namespace App\Http\Controllers\Media\Service;

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
            'medias' => $this->getMedias()
        ];
    }

    private function getMedias()
    {
        return DB::table('medias')
            ->select([
                'title',
                'image_filename',
                'token',
            ])
            ->get();
    }
}
