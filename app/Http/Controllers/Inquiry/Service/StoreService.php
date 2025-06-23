<?php

namespace App\Http\Controllers\Inquiry\Service;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreService
{
    private string $name;
    private string $phoneNumber;
    private ?string $email;
    private string $title;
    private string $text;

    public function __construct(string $name, string $phoneNumber, ?string $email, string $title, string $text)
    {
        $this->name = $name;
        $this->phoneNumber = $phoneNumber;
        $this->email = $email;
        $this->title = $title;
        $this->text = $text;
    }

    public function main()
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
            'status' => true,
        ];
    }

    private function validator()
    {
        $validator = Validator::make([
            'name' => $this->name,
            'phoneNumber' => $this->phoneNumber,
            'email' => $this->email,
            'title' => $this->title,
            'text' => $this->text
        ], [
            'name' => ['required', 'string', 'max:255'],
            'phoneNumber' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'text' => ['required', 'string', 'max:255']
        ], [
            'name.required' => "성함을 입력하여 주세요.",
            'name.max' => "성함은 255자 이하로 입력 가능합니다.",
            'phoneNumber.required' => "연락 가능한 연락처를 입력하여 주세요.",
            'phoneNumber.max' => "휴대폰은 255자 이하로 입력 가능합니다.",
            'email.max' => "이메일은 255자 이하로 입력 가능합니다.",
            'title.required' => "문의글 제목을 입력하여 주세요.",
            'title.max' => "문의 제목은 255자 이하로 입력 가능합니다.",
            'text.required' => "문의 내용을 입력하여 주세요.",
            'text.max' => "문의 내용은 255자 이하로 입력 가능합니다."
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

    private function store()
    {
        try {
            DB::table('inquiries')->insert([
                'name' => $this->name,
                'phone_number' => $this->phoneNumber,
                'email' => $this->email,
                'title' => $this->title,
                'text' => $this->text,
                'is_checked' => 0,
                'created_at' => now(),
                'updated_at' => now(),
                'token' => Str::uuid()->toString()
            ]);
            return [
                'status' => true
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => '문의 저장중 오류가 발생하였습니다.',
                'error' => $e->getMessage()
            ];
        }
    }
}
