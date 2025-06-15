<?php

namespace App\Http\Controllers\AdminHero\Service;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UpdateService extends Service
{
    private ?string $title;
    private ?string $subTitle;
    private ?UploadedFile $imageFile;

    public function __construct(?string $title, ?string $subTitle, ?UploadedFile $imageFile)
    {
        $this->title = $title;
        $this->subTitle = $subTitle;
        $this->imageFile = $imageFile;
    }

    public function main(): array
    {
        DB::beginTransaction();
        try {
            if (! $this->validator()['status']) {
                return $this->validator();
            }

            if (! $this->update()['status']) {
                return $this->update();
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
            'image' => $this->imageFile,
        ], [
            'title' => ['nullable', 'string', 'max:20'],
            'subTitle' => ['nullable', 'string', 'max:20'],
            'image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,svg,gif'],
        ], [
            'title.max' => '타이틀은 최대 20자까지 가능합니다.',
            'subTitle' => '서브 타이틀은 최대 20자까지 가능합니다.',
            'image.mimes' => '이미지는 jpg, jpeg, png, svg, gif 형식만 업로드할 수 있습니다.',
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

    private function update(): array
    {
        try {
            $adminId = Auth::guard('admin')->id();
            $updateData = [];

            if (!is_null($this->title)) {
                $updateData['title'] = $this->title;
            }

            if (!is_null($this->subTitle)) {
                $updateData['sub_title'] = $this->subTitle;
            }

            if ($this->imageFile) {
                $existingImagePath = DB::table('heroes')->where('admin_id', $adminId)->value('image_filename');

                if ($existingImagePath) {
                    $this->destroyImage('hero', $existingImagePath);
                }

                $imageResult = $this->storeImage($this->imageFile, 'hero');

                if ($imageResult['status']) {
                    $updateData['image_filename'] = $imageResult['imagePath'];
                }
            }

            if (empty($updateData)) {
                return [
                    'status'  => false,
                    'message' => '수정할 데이터가 없습니다.',
                ];
            }

            DB::table('heroes')
                ->where('admin_id', $adminId)
                ->update($updateData);

            return ['status' => true];
        } catch (\Exception $e) {
            return [
                'status'  => false,
                'message' => '정보 업데이트 중 오류가 발생하였습니다.',
                'error'   => $e->getMessage(),
            ];
        }
    }
}
