<?php

namespace App\Http\Controllers\AdminFooter\Service;

use App\Models\Admin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UpdateService
{
    private ?string $address;
    private ?string $companyName;
    private ?string $ceoName;
    private ?string $businessNumber;
    private ?string $phone;
    private ?string $fax;
    private ?string $email;

    public function __construct(?string $address, ?string $companyName, ?string $ceoName, ?string $businessNumber, $phone, $fax, $email)
    {
        $this->address = $address;
        $this->companyName = $companyName;
        $this->ceoName = $ceoName;
        $this->businessNumber = $businessNumber;
        $this->phone = $phone;
        $this->fax = $fax;
        $this->email = $email;
    }
    public function main()
    {
        DB::beginTransaction();
        try {
            $validator = $this->validator();

            if (!$validator['status']) {
                DB::rollBack();
                return $validator;
            }

            $update = $this->update();

            if (!$update['status']) {
                DB::rollBack();
                return $update;
            }

            DB::commit();

            return [
                'status' => true
            ];
        } catch (\Throwable $e) {
            DB::rollBack();
            return [
                'status'  => false,
                'message' => '예기치 못한 오류가 발생했습니다.',
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function validator()
    {
        $validator = Validator::make([
            'address' => $this->address,
            'companyName' => $this->companyName,
            'ceoName' => $this->ceoName,
            'businessNumber' => $this->businessNumber,
            'phone' => $this->phone,
            'fax' => $this->fax,
            'email' => $this->email
        ], [
            'address' => ['nullable', 'string', 'max:255'],
            'companyName' => ['nullable', 'string', 'max:20'],
            'ceoName' => ['nullable', 'string', 'max:20'],
            'businessNumber' => ['nullable', 'string', 'max:20'],
            'phone' => ['nullable', 'string', 'max:20'],
            'fax' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'max:255'],
        ], [
            'address.max' => '회사주소는 최대 255글자까지 가능합니다.',
            'companyName.max' => '회사명은 최대 20글자까지 가능합니다.',
            'ceoName.max' => '대표자 성함은 최대 20글자까지 가능합니다.',
            'businessNumber_max' => '사업자등록번호는 최대 20글자까지 가능합니다.',
            'phone.max' => '번호는 최대 20글자까지 가능합니다.',
            'fax.max' => '팩스 번호는 최대 30글자까지 가능합니다.',
            'email.max' => '이메일은 최대 255글자까지 가능합니다.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'return' => $validator->errors()->first(),
                'error' => $validator->errors()
            ]);
        }

        return [
            'status' => true
        ];
    }

    private function update()
    {
        try {
            $adminId = Auth::guard('admin')->id();

            DB::table('admins')
                ->where('id', $adminId)
                ->update([
                    'address'         => $this->address,
                    'company_name'    => $this->companyName,
                    'ceo_name'        => $this->ceoName,
                    'business_number' => $this->businessNumber,
                    'phone'           => $this->phone,
                    'fax'             => $this->fax,
                    'email'           => $this->email,
                ]);

            return [
                'status' => true
            ];
        } catch (\Exception $e) {
            return [
                'status'  => false,
                'message' => '정보 업데이트중 오류가 발생하였습니다.',
                'error'   => $e->getMessage()
            ];
        }
    }
}
