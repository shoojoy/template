<?php

namespace App\Http\Controllers\BusinessHistory\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Carbon\Carbon;

class StoreService
{
    private string $content;
    private string $year;

    public function __construct(string $content, string $year)
    {
        $this->content = $content;
        $this->year    = $year;
    }

    public function main(): array
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

    private function validator(): array
    {
        $validator = Validator::make(
            [
                'content' => $this->content,
                'year'    => $this->year,
            ],
            [
                'content' => ['required', 'string', 'max:65535'],
                'year'    => ['required', 'digits:6', 'regex:/^[0-9]{4}(0[1-9]|1[0-2])$/',],
            ],
            [
                'content.required' => '연혁 내용을 입력하여 주세요.',
                'content.max'      => '내용은 최대 65535자까지만 입력 가능합니다.',
                'year.required'    => '연도와 월을 입력하여 주세요.',
                'year.digits'      => '연도와 월은 6자리 숫자여야 합니다.',
                'year.regex'       => '연도와 월은 YYYYMM 형식으로 입력해주세요. 예) 202506',
            ]
        );

        if ($validator->fails()) {
            return [
                'status'  => false,
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ];
        }

        return ['status' => true];
    }

    private function store(): array
    {
        try {
            $dt = Carbon::createFromFormat('Ym', $this->year)
                ->startOfMonth()
                ->toDateTimeString();

            DB::table('business_histories')
                ->insert([
                    'content' => $this->content,
                    'year'    => $dt,
                    'token'   => Str::uuid()->toString(),
                ]);

            return [
                'status' => true,
            ];
        } catch (\Exception $e) {
            return [
                'status'   => false,
                'message'  => '데이터 저장 중 오류가 발생했습니다.',
                'exception' => $e->getMessage(),
            ];
        }
    }
}
