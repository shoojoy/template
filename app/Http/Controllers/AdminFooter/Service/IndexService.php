<?php

namespace App\Http\Controllers\AdminFooter\Service;

use App\Models\Admin;

class IndexService
{
    public function main()
    {
        return Admin::select([
            'username',
            'password',
            'address',
            'company_name',
            'ceo_name',
            'business_number',
            'phone',
            'fax',
            'email',
        ])
            ->orderBy('id', 'asc')
            ->get();
    }
}
