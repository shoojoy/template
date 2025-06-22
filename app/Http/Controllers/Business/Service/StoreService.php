<?php

namespace App\Http\Controllers\Business\Service;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreService extends Service
{
    private UploadedFile $imageFilename;

    public function __construct(UploadedFile $imageFilename)
    {
        $this->imageFilename = $imageFilename;
    }

    public function main()
    {
        $validator = $this->validator();

        if (!$validator['status']) {
            return $validator;
        }

        $storeImage = $this->storeImage($this->imageFilename, 'business');

        if (!$storeImage['status']) {
            return $storeImage;
        }

        $imageFilename = $storeImage['publicUrl'];

        $store = $this->store($imageFilename);

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
            'imageFilename' => $this->imageFilename
        ], [
            'imageFilename' => ['required', 'file', 'mimes:png,jpg,jpeg,gif,svg'],
        ], [
            'imageFilename.required' => '비즈니스 이미지를 등록하여 주세요.',
            'imageFilename.file' => '이미지는 파일 형태 입니다.',
            'imageFilename.mimes' => '이미지는 png,jpg,jpeg,gif,svg 형태로 등록하여 주세요.'
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

    private function store(string $imageFilename)
    {
        try {
            DB::table('business_images')->insert([
                'image_filename' => $imageFilename,
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
                'message' => '비즈니스 이미지 저장중 오류가 발생하였습니다.',
                'error' => $e->getMessage()
            ];
        }
    }
}
