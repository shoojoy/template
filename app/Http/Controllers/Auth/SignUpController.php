<?php

namespace App\Http\Controllers\Auth;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SignUpController
{
    public function main(Request $request)
    {
        $validator = $this->validator($request);

        if (!$validator['status']) {
            return response()->json($validator, 422);
        }

        $signup = $this->signUp($request);
        if (! $signup['status']) {
            return response()->json($signup, 500);
        }

        return response()->json([
            'status'  => true,
            'message' => '성공적으로 계정을 생성하였습니다.',
        ]);
    }
    public function validator(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|min:5|max:20|unique:admins,username',
            'password' => 'required|string|min:8|max:64|confirmed',
            'address' => 'nullable|string|max:255',
            'company_name' => 'nullable|string|max:20',
            'ceo_name' => 'nullable|string|max:20',
            'business_number' => 'nullable|string|max:20',
            'phone' => 'nullable|string|max:20',
            'fax' => 'nullable|string|max:30',
            'email' => 'nullable|string|max:255|',
            'logo_image_filename' => 'required|file|mimes:jpg,jpeg,png,svg,gif'
        ], [
            'username.required' => '아이디를 입력하여 주세요.',
            'username.min' => '아이디는 최소 5글자 이상이여야 합니다.',
            'username.max' => '아이디는 최대 20글자까지 가능합니다.',
            'username.unique' => '이미 사용중인 아이디 입니다.',
            'password.required' => '비밀번호를 입력하여 주세요.',
            'password.min' => '비밀번호는 최소 8글자 이상이여야 합니다.',
            'password.max' => '비밀번호는 최대 64글자까지 가능합니다.',
            'password.confirmed' => '비밀번호가 일치하지 않습니다.',
            'address.max' => '회사주소는 최대 255글자까지 가능합니다.',
            'company_name.max' => '회사명은 최대 20글자까지 가능합니다.',
            'ceo_name.max' => '대표자 성함은 최대 20글자까지 가능합니다.',
            'business_number' => '사업자등록번호를 입력하여 주세요.',
            'business_max' => '사업자등록번호는 최대 20글자까지 가능합니다.',
            'phone.max' => '번호는 최대 20글자까지 가능합니다.',
            'fax.max' => '팩스 번호는 최대 30글자까지 가능합니다.',
            'email.max' => '이메일은 최대 255글자까지 가능합니다.',
            'logo_image_filename.required' => '로고 이미지를 등록하여 주세요.',
            'logo_image_filename.file' => '이미지는 파일형식 이여야 합니다.',
            'logo_image_filename.mimes' => '이미지는 jpg,jpeg,png,svg,gif 형식만 업로드 가능합니다.'
        ]);

        if ($validator->fails()) {
            return [
                'status' => false,
                'return' => $validator->errors()->first(),
                'error'  => $validator->errors()
            ];
        }

        return [
            'status' => true
        ];
    }

    public function signUp(Request $request)
    {
        try {
            DB::beginTransaction();

            Admin::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'address' => $request->address,
                'company_name' => $request->company_name,
                'ceo_name' => $request->ceo_name,
                'business_number' => $request->business_number,
                'phone' => $request->phone,
                'fax' => $request->fax,
                'email' => $request->email,
                'logo_image_filename' => $request->logo_image_filename
            ]);

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            return [
                'status' => false,
                'return' => $e->getMessage()
            ];
        }
        return [
            'status' => true,
            'message' => '성공적으로 가입을 완료하였습니다.'
        ];
    }
}
