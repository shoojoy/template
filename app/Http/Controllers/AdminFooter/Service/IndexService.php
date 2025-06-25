<?php
// app/Http/Controllers/AdminFooter/Service/IndexService.php
namespace App\Http\Controllers\AdminFooter\Service;

use App\Models\Admin;

class IndexService
{
    /**
     * @return array|null
     */
    public function main(): ?array
    {
        // 가장 첫 번째(=유일) 레코드를 배열로 반환
        $footer = Admin::select([
            'address',
            'company_name',
            'ceo_name',
            'business_number',
            'phone',
            'fax',
            'email',
        ])
            ->orderBy('id', 'asc')
            ->first();

        return $footer
            ? $footer->toArray()
            : null;
    }
}
