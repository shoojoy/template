<?php

namespace App\Http\Controllers\AboutCounter\Service;

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
            'medias' => $this->getAboutCounters()
        ];
    }

    private function getAboutCounters()
    {
        return DB::table('about_counters')
            ->select([
                'title',
                'value',
                'token',
            ])
            ->get();
    }
}
