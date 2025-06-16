<?php

namespace App\Http\Controllers\Hero\Services;

use App\Http\Service\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DestroyService extends Service
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
            'token' => ['required', 'string', 'exists:heroes,token']
        ], [
            'token.required' => '삭제할 페이지가 존재하지 않습니다.',
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
        $hero = DB::table('heroes')
            ->where('token', $this->token)
            ->first();

        if (! $hero) {
            return [
                'status'  => false,
                'message' => '삭제할 Hero 를 찾을 수 없습니다.',
            ];
        }

        if (! empty($hero->image_filename)) {
            $filename = basename($hero->image_filename);
            $this->destroyImage('hero', $filename);
        }

        DB::table('heroes')
            ->where('token', $this->token)
            ->delete();

        return [
            'status'  => true,
            'message' => 'Hero 가 성공적으로 삭제되었습니다.',
        ];
    }
}
