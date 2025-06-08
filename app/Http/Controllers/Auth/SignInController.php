<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class SignInController
{
    public function main(Request $request)
    {
        $validator = $this->validator($request);

        if (! $validator['status']) {
            return response()->json($validator, 401);
        }

        $admin = Admin::where('username', $request->username)->first();

        if (! Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status'  => false,
                'message' => '비밀번호가 일치하지 않습니다.',
            ], 401);
        }

        return response()->json([
            'status'  => true,
            'message' => '로그인에 성공했습니다.',
        ]);
    }

    private function validator(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|exists:admins,username',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return [
                'status'  => false,
                'message' => $validator->errors()->first(),
            ];
        }

        return ['status' => true];
    }
}
