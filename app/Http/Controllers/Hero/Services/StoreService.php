<?php

namespace App\Http\Controllers\Hero\Services;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StoreService extends Service
{
    private ?string $title;
    private ?string $subTitle;
    private ?UploadedFile $imageFilename;

    public function __construct(?string $title, ?string $subTitle, ?UploadedFile $imageFilename)
    {
        $this->title         = $title;
        $this->subTitle      = $subTitle;
        $this->imageFilename = $imageFilename;
    }

    public function main()
    {
        DB::beginTransaction();
        try {
            $validation = $this->validator();
            if (!$validation['status']) {
                return $validation;
            }

            $store = $this->store();
            if (!$store['status']) {
                return $store;
            }

            DB::commit();
            return $store;
        } catch (\Throwable $e) {
            DB::rollBack();
            return [
                'status' => false,
                'message' => '예기치 못한 오류가 발생했습니다.',
                'error' => $e->getMessage(),
            ];
        }
    }

    private function validator(): array
    {
        $validator = Validator::make(
            [
                'title' => $this->title,
                'subtitle' => $this->subTitle,
                'imageFilename' => $this->imageFilename,
            ],
            [
                'title' => ['nullable', 'string', 'max:20'],
                'subtitle' => ['nullable', 'string', 'max:20'],
                'imageFilename' => ['nullable', 'file', 'mimes:jpg,jpeg,png,svg,gif'],
            ],
            [
                'title.max' => '타이틀은 최대 20자까지 가능합니다.',
                'subtitle.max' => '서브 타이틀은 최대 20자까지 가능합니다.',
                'imageFilename.mimes' => '이미지는 jpg, jpeg, png, svg, gif 형식만 업로드할 수 있습니다.',
            ]
        );

        if ($validator->fails()) {
            return [
                'status' => false,
                'message' => $validator->errors()->first(),
                'error' => $validator->errors(),
            ];
        }

        $count = DB::table('heroes')->count();
        if ($count >= 3) {
            return [
                'status' => false,
                'message' => 'Hero는 최대 3개까지만 생성할 수 있습니다.',
                'error' => null,
            ];
        }

        return [
            'status' => true
        ];
    }

    private function store(): array
    {
        try {
            $token = Str::uuid()->toString();
            $nextIndex = (DB::table('heroes')->max('index') ?? 0) + 1;

            $savedUrl = null;
            if ($this->imageFilename instanceof UploadedFile) {
                $upload = $this->storeImage($this->imageFilename, 'hero');
                if (! $upload['status']) {
                    return [
                        'status' => false,
                        'message' => $upload['message'],
                        'error' => $upload['error'],
                    ];
                }
                $savedUrl = $upload['publicUrl'];
            }

            DB::table('heroes')->insert([
                'title' => $this->title,
                'subtitle' => $this->subTitle,
                'image_filename' => $savedUrl,
                'token' => $token,
                'index' => $nextIndex,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $heroDto = [
                'index' => $nextIndex,
                'title' => $this->title,
                'subtitle' => $this->subTitle,
                'image' => $savedUrl,
                'token' => $token,
            ];

            return [
                'status' => true,
                'hero' => $heroDto,
            ];
        } catch (\Throwable $e) {
            return [
                'status' => false,
                'message' => '저장 중 오류가 발생했습니다.',
                'error' => $e->getMessage(),
            ];
        }
    }
}
