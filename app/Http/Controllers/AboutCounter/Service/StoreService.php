<?php

namespace App\Http\Controllers\AboutCounter\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreService
{
    private ?string $title;
    private ?int $value;
    public function __construct(?string $title, ?int $value)
    {
        $this->title = $title;
        $this->value = $value;
    }

    public function main()
    {
        $validator = $this->validator();

        if (!$validator['status']) {
            return $validator;
        }

        $store = $this->store();

        if (!$store['status']) {
            return $store;
        }

        return [
            'status' => true
        ];
    }

    private function validator()
    {
        $validator = Validator::make([
            'title' => $this->title,
            'value' => $this->value,
        ], [
            'title' => ['required', 'string', 'max:255'],
            'value' => ['required', 'integer']
        ], [
            'title' => '업체소개 제목을 입력하여 주세요/',
            'value' => '업체소개 데이터를 입력하여 주세요.'
        ]);

        if ($validator->fails()) {
            return [
                'status' => false,
                'return' => $validator->errors()->first(),
                'error' => $validator->errors(),
            ];
        }

        return [
            'status' => true
        ];
    }

    private function store()
    {
        try {
            DB::table('about_counters')->insert([
                'title' => $this->title,
                'value' => $this->value,
                'created_at' => now(),
                'updated_at' => now(),
                'token' => Str::uuid()->toString()
            ]);

            return [
                'status' => true
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => '업체소개 정보 저장중 오류가 발생하였습니다.',
                'error' => $e->getMessage()
            ];
        }
    }
}
