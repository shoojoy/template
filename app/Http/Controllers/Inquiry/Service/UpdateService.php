<?php

namespace App\Http\Controllers\Inquiry\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateService
{
    private string $token;
    private int $isChecked;

    public function __construct(string $token, int $isChecked)
    {
        $this->token = $token;
        $this->isChecked = $isChecked;
    }

    public function main()
    {
        $validator = $this->validator();

        if (!$validator['status']) {
            return $validator;
        }

        $update = $this->update($this->isChecked);

        if (!$update['status']) {
            return $update;
        }

        return [
            'status' => true
        ];
    }

    private function validator()
    {
        $validator = Validator::make([
            'token' => $this->token,
            'isChecked' => $this->isChecked
        ], [
            'token' => ['required', 'string', 'exists:inquiries,token'],
            'isChecked' => ['required', 'integer']
        ], [
            'token' => "해당 문의사항은 존재하지 않습니다.",
            'isChecked' => "이미 확인한 문의사항 입니다."
        ]);

        if ($validator->fails()) {
            return [
                'status' => false,
                'message' => $validator->errors()->first(),
                'error' => $validator->errors()
            ];
        }

        return [
            'status' => true
        ];
    }

    private function update(int $isChecked)
    {
        try {
            DB::table('inquiries')
                ->where('token', $this->token)
                ->update([
                    'is_checked' => $isChecked,
                    'updated_at' => now()
                ]);

            return ['status' => true];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => '문의 확인 중 오류 발생',
                'error' => $e->getMessage()
            ];
        }
    }
}
