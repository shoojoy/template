<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ConfigController extends Controller
{
    public function main(Request $request)
    {
        $v = $this->validator($request);
        if (! $v['status']) {
            return response()->json($v, 422);
        }

        $u = $this->update($request);
        if (! $u['status']) {
            return response()->json($u, 500);
        }

        return response()->json(['status' => true]);
    }

    private function validator(Request $request): array
    {
        $validator = Validator::make(
            $request->all(),
            [
                'config' => ['required', 'exists:configs,config'],
                'value'  => ['required', 'string', 'max:255'],
            ],
            [
                'config.exists' => '시더를 먼저 실행하여 주세요.',
                'value.max'     => '최대 255글자까지 입력이 가능합니다.',
            ]
        );

        if ($validator->fails()) {
            return [
                'status'  => false,
                'message' => $validator->errors()->first(),
                'error'   => $validator->errors(),
            ];
        }

        return ['status' => true];
    }

    private function update(Request $request): array
    {
        try {
            DB::table('configs')
                ->where('config', $request->input('config'))
                ->update([
                    'value'      => $request->input('value'),
                    'created_at' => now(),
                ]);

            return [
                'status'  => true,
                'message' => '설정 값이 성공적으로 업데이트되었습니다.',
            ];
        } catch (\Throwable $e) {
            return [
                'status'  => false,
                'message' => '설정 업데이트 중 오류가 발생했습니다.',
                'error'   => $e->getMessage(),
            ];
        }
    }
}
