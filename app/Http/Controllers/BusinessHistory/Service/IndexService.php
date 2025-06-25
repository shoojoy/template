<?php

namespace App\Http\Controllers\BusinessHistory\Service;

use Illuminate\Support\Facades\DB;

class IndexService
{
    public function __construct()
    {
        //
    }

    public function main()
    {
        return [
            'status' => true,
            'history' => $this->getHistories()
        ];
    }

    private function getHistories()
    {
        return DB::table('business_histories')
            ->select([
                'content',
                'year',
                'token',
            ])
            ->get();
    }
}
