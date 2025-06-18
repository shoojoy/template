<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SignInController
{
    public function main(Request $request)
    {
        $validator = $this->validator($request);

        if (! $validator['status']) {
            return response()->json($validator, 401);
        }

        $admin = Admin::where('username', $request->username)->first();
        if (! $admin || ! Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status'  => false,
                'message' => '아이디 또는 비밀번호가 일치하지 않습니다.',
            ], 401);
        }

        Auth::guard('admin')->login($admin);
        $request->session()->regenerate();

        if ($request->header('X-Inertia')) {
            return Inertia::location(route('admin.hero'));
        }

        return redirect()->route('admin.hero');
    }
    public function show(Request $request)
    {
        if (!$this->authIndex()) {
            return redirect()->route('admins.SignUp');
        }

        return Inertia::render('admins/SignIn');
    }

    private function validator(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
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

    private function authIndex()
    {
        return DB::table('admins')
            ->select([
                'id',
            ])
            ->exists();
    }
}
