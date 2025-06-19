<?php

namespace App\Http\Controllers\Media\Service;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreService extends Service
{
    private string $title;
    private UploadedFile $imageFilename;

    public function __construct(string $title, UploadedFile $imageFilename)
    {
        $this->title = $title;
        $this->imageFilename = $imageFilename;
    }

    public function main()
    {
        $validator = $this->validator();

        if (!$validator['status']) {
            return $validator;
        }

        $storeImage = $this->storeImage($this->imageFilename, 'media');

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
            'title' => $this->title,
            'imageFilename' => $this->imageFilename,
        ], [
            'title' => ['required', 'string', 'max:255'],
            'imageFilename' => ['required', 'file', 'mimes:jpg,jpeg,png,svg,gif']
        ], [
            'title.required' => '미디어 제목을 입력하여 주세요.',
            'title.max' => '미디어는 최대 20글자까지 입력이 가능합니다.',
            'imageFilename.required' => '미디어 이미지를 등록하여 주세요.',
            'imageFilename.file' => '이미지는 파일 형식으로 업로드하여 주세요.',
            'imageFilename.mimes' => '이미지는 jpg,jpeg,png,svg,gif 형식만 업로드하여 주세요.'
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
            DB::table('medias')->insert([
                'title' => $this->title,
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
                'message' => '미디어 정보 저장중 오류가 발생하였습니다.',
                'error' => $e->getMessage()
            ];
        }
    }
}
