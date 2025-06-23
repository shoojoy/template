<?php

namespace App\Http\Controllers\Inquiry\Service;

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
            'token' => ['required', 'string', 'exists:business_images,token']
        ], [
            'token.required' => '삭제할 이미지가 존재하지 않습니다.',
            'token.exists' => '유효한 이미지가 아닙니다.'
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
        DB::table('inquiries')
            ->where('token', $this->token)
            ->delete();

        return [
            'status'  => true,
            'message' => '문의 내용이 성공적으로 삭제되었습니다.',
        ];
    }
}
