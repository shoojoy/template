<?php

namespace App\Http\Controllers\AdminHero\Service;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UpdateService
{
    private ?string $title;
    private ?string $subTitle;
    /** @var UploadedFile[] */
    private array $imageFiles;

    public function __construct(?string $title, ?string $subTitle, array $imageFiles)
    {
        $this->title = $title;
        $this->subTitle = $subTitle;
        $this->imageFiles = $imageFiles;
    }

    public function main(): array
    {
        DB::beginTransaction();
        try {
            if (! $this->validator()['status']) {
                return $this->validator();
            }

            if (! $this->updateHero()['status']) {
                return $this->updateHero();
            }

            DB::commit();
            return ['status' => true];
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
        $v = Validator::make([
            'title' => $this->title,
            'subTitle' => $this->subTitle,
            'images' => $this->imageFiles,
        ], [
            'title' => ['nullable', 'string', 'max:20'],
            'subTitle' => ['nullable', 'string', 'max:20'],
            'images' => ['required', 'array', 'min:1', 'max:3'],
            'images.*' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,svg,gif'],
        ], [
            'title.max' => '타이틀은 최대 20자까지 가능합니다.',
            'subTitle' => '서브 타이틀은 최대 20자까지 가능합니다',
            'images.required' => '이미지를 최소 1장 업로드해야 합니다.',
            'images.min' => '이미지는 최소 1장 이상이어야 합니다.',
            'images.max' => '이미지는 최대 3장까지만 업로드할 수 있습니다.',
            'images.*.mimes' => '이미지는 jpg,jpeg,png,svg,gif 형식만 업로드할 수 있습니다.',
            'images.*.image' => '유효한 이미지 파일만 업로드할 수 있습니다.',
        ]);

        if ($v->fails()) {
            return [
                'status' => false,
                'return' => $v->errors()->first(),
                'error' => $v->errors(),
            ];
        }

        return ['status' => true];
    }

    private function updateHero(): array
    {
        try {
            $adminId = Auth::guard('admin')->id();
            $storedPaths = [];

            foreach ($this->imageFiles as $file) {
                /** @var UploadedFile $file */
                $path = $file->store('uploads/hero', 'public');
                $storedPaths[] = $path;
            }

            DB::table('heroes')
                ->where('id', $adminId)
                ->update([
                    'title' => $this->title,
                    'sub_title' => $this->subTitle,
                    'image_filename' => json_encode($storedPaths, JSON_UNESCAPED_SLASHES),
                ]);

            return ['status' => true];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => '정보 업데이트중 오류가 발생하였습니다.',
                'error' => $e->getMessage(),
            ];
        }
    }
}
