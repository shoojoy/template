<?php

namespace App\Http\Controllers\Inquiry\Service;

use Illuminate\Support\Facades\DB;

class IndexService
{

    public function main()
    {
        return [
            'status' => true,
            'medias' => $this->getBusinessImages()
        ];
    }

    private function getBusinessImages()
    {
        return DB::table('inquiries')
            ->select([
                'name',
                'phone_number',
                'email',
                'title',
                'text',
                'is_checked',
                'token'
            ])
            ->get();
    }
}
