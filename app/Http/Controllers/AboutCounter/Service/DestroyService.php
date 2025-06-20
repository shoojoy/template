<?php

namespace App\Http\Controllers\AboutCounter\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DestroyService
{
    private string $token;

    public function __construct(string $token)
    {
        $this->token = $token;
    }
    public function main()
    {
        $validator = $this->validator();

        if (!$validator['status']) {
            return $validator;
        }

        $delete = $this->delete();

        if (!$delete['status']) {
            return $delete;
        }

        return [
            'status' => true
        ];
    }
    private function validator()
    {
        $validator = Validator::make([
            'token' => $this->token
        ], [
            'token' => ['required', 'string', 'exists:about_counters,token']
        ], [
            'token.required' => '삭제할 카운터가 존재하지 않습니다.',
            'token.exists' => '유효한 카운터가 아닙니다.'
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

    private function delete(): array
    {
        try {
            DB::table('about_counters')
                ->where('token', $this->token)
                ->delete();

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
