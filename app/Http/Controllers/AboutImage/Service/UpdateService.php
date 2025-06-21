<?php

namespace App\Http\Controllers\AboutImage\Service;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class UpdateService extends Service
{
    private UploadedFile $imageFilename;
    private string $token;

    public function __construct(UploadedFile $imageFilename, string $token)
    {
        $this->imageFilename = $imageFilename;
        $this->token = $token;
    }

    public function main()
    {
        DB::beginTransaction();
        try {
            $validator = $this->validator();

            if (!$validator['status']) {
                return $validator;
            }

            if ($this->imageFilename) {
                $old = $this->getImageFilename();

                if (! empty($old->image_filename)) {
                    $destroy = $this->destroyImage(
                        'about',
                        basename($old->image_filename)
                    );
                    if (! $destroy['status']) {
                        return $destroy;
                    }
                }

                $store = $this->storeImage($this->imageFilename, 'about');
                if (! $store['status']) {
                    return $store;
                }

                $newFilename = $store['publicUrl'];
            }
            $update = $this->update(
                $this->imageFilename ? $newFilename : null
            );
            if (! $update['status']) {
                return $update;
            }
            DB::commit();
            return ['status' => true];
        } catch (\Exception $e) {
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
            'imageFilename' => $this->imageFilename,
            'token' => $this->token
        ], [
            'imageFilename' => ['required', 'file', 'mimes:png,jpg,jpeg,gif,svg'],
            'token' => ['required', 'string', 'exists:about_images,token']
        ], [
            'imageFilename.required' => '어바웃 이미지를 등록하여 주세요.',
            'imageFilename.mimes' => '이미지는 png,jpg,jpeg,gif,svg 형태로 등록하여 주세요.',
            'token' => '수정할 이미지가 존재하지 않습니다.'
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

    private function update(?string $newFilename)
    {
        try {
            $data = ['updated_at' => now()];
            if ($newFilename !== null) {
                $data['image_filename'] = $newFilename;
            }

            DB::table('about_images')
                ->where('token', $this->token)
                ->update($data);

            return ['status' => true];
        } catch (\Exception $e) {
            return [
                'status'  => false,
                'message' => '어바웃 이미지 저장중 오류가 발생하였습니다.',
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function getImageFilename()
    {
        return DB::table('about_images')
            ->where('token', $this->token)
            ->first();
    }
}
