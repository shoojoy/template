<?php

namespace App\Http\Controllers\BusinessHistory\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class UpdateService
{
    private string $content;
    private string $year;
    private string $token;

    public function __construct(string $content, string $year, string $token)
    {
        $this->content = $content;
        $this->year    = $year;
        $this->token   = $token;
    }

    public function main()
    {
        $validator = $this->validator();

        if (! $validator['status']) {
            return $validator;
        }

        $update = $this->update();

        if (!$update['status']) {
            return $update;
        }

        return [
            'status' => true
        ];
    }

    private function validator()
    {
        $validator = Validator::make(
            [
                'content' => $this->content,
                'year'    => $this->year,
                'token'   => $this->token
            ],
            [
                'content' => ['required', 'string', 'max:65535'],
                'year'    => ['required', 'digits:6', 'regex:/^[0-9]{4}(0[1-9]|1[0-2])$/',],
                'token'   => ['required', 'string', 'exists:business_histories,token']
            ],
            [
                'content.required' => '연혁 내용을 입력하여 주세요.',
                'content.max'      => '내용은 최대 65535자까지만 입력 가능합니다.',
                'year.required'    => '연도와 월을 입력하여 주세요.',
                'year.digits'      => '연도와 월은 6자리 숫자여야 합니다.',
                'year.regex'       => '연도와 월은 YYYYMM 형식으로 입력해주세요. 예) 202506',
                'token.exists' => '해당 연혁을 찾을 수 없습니다.',
                'token.required' => '수정할 연혁 식별자가 제공되지 않았습니다.',
            ]
        );

        if ($validator->fails()) {
            return [
                'status'  => false,
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ];
        }

        if ($validator->fails()) {
            return [
                'status'  => false,
                'message' => $validator->errors()->first(),
                'errors'  => $validator->errors(),
            ];
        }

        return ['status' => true];
    }

    private function update()
    {
        try {
            $dt = Carbon::createFromFormat('Ym', $this->year)
                ->startOfMonth()
                ->toDateTimeString();

            $update = DB::table('business_histories')
                ->where('token', $this->token)
                ->update([
                    'content'    => $this->content,
                    'year'       => $dt,
                    'updated_at' => now(),
                ]);

            if ($update) {
                return ['status' => true];
            }

            return [
                'status'  => false,
                'message' => '해당 연혁을 찾을 수 없거나 변경된 내용이 없습니다.',
            ];
        } catch (\Exception $e) {
            return [
                'status'    => false,
                'message'   => '수정 중 오류가 발생했습니다.',
                'exception' => $e->getMessage(),
            ];
        }
    }
}
