<?php

namespace App\Http\Controllers\AboutCounter\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UpdateService
{
    private ?string $title;
    private ?int $value;
    private ?string $token;

    public function __construct(?string $title, ?int $value, ?string $token)
    {
        $this->title = $title;
        $this->value = $value;
        $this->token = $token;
    }

    public function main()
    {
        $validator = $this->validator();

        if (!$validator['status']) {
            return $validator;
        }

        $store = $this->update();

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
            'token' => $this->token
        ], [
            'title' => ['required', 'string', 'max:255'],
            'value' => ['required', 'integer'],
            'token' => ['required', 'string']
        ], [
            'title' => '업체소개 제목 수정중 오류가 발생하였습니다.',
            'value' => '업체소개 데이터를 수정중 오류가 발생하였습니다.',
            'token' => '수정할 업체소개가 존재하지 않습니다.'
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

    private function update()
    {
        try {
            DB::table('about_counters')
                ->where('token', $this->token)
                ->update([
                    'title' => $this->title,
                    'value' => $this->value,
                    'updated_at' => now(),
                ]);

            return [
                'status' => true
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => '업체소개 정보 수정중 오류가 발생하였습니다.',
                'error' => $e->getMessage()
            ];
        }
    }
}
