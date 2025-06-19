<?php

namespace App\Http\Controllers\Media\Service;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UpdateService extends Service
{
    private ?string $title;
    private ?UploadedFile $imageFilename;
    private string $token;

    public function __construct(?string $title, ?UploadedFile $imageFilename, string $token)
    {
        $this->title = $title;
        $this->imageFilename = $imageFilename;
        $this->token = $token;
    }

    public function main(): array
    {
        DB::beginTransaction();
        try {
            $v = $this->validator();
            if (! $v['status']) {
                return $v;
            }

            if ($this->imageFilename) {
                $old = $this->getImageFilename();

                if (! empty($old->image_filename)) {
                    $destroy = $this->destroyImage(
                        'media',
                        basename($old->image_filename)
                    );
                    if (! $destroy['status']) {
                        return $destroy;
                    }
                }

                $store = $this->storeImage($this->imageFilename, 'media');
                if (! $store['status']) {
                    return $store;
                }

                $newFilename = $store['publicUrl'];
            }
            $update = $this->update(
                $this->title,
                $this->imageFilename ? $newFilename : null
            );
            if (! $update['status']) {
                return $update;
            }

            DB::commit();
            return ['status' => true];
        } catch (\Throwable $e) {
            DB::rollBack();
            return [
                'status'  => false,
                'message' => '예기치 못한 오류가 발생했습니다.',
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function validator(): array
    {
        $v = Validator::make([
            'title' => $this->title,
            'imageFilename' => $this->imageFilename,
            'token' => $this->token,
        ], [
            'title'         => ['nullable', 'string', 'max:255', 'required_without:imageFilename'],
            'imageFilename' => ['nullable', 'file', 'mimes:jpg,jpeg,png,svg,gif', 'required_without:title'],
            'token'         => ['required', 'string', 'exists:medias,token'],
        ], [
            'title.max'                => '타이틀은 최대 255자까지 가능합니다.',
            'title.required_without'   => '제목 또는 이미지를 하나는 입력해야 합니다.',
            'imageFilename.mimes'      => '이미지는 jpg, jpeg, png, svg, gif 형식만 업로드할 수 있습니다.',
            'imageFilename.required_without' => '제목 또는 이미지를 하나는 입력해야 합니다.',
            'token.required'           => '수정 가능한 미디어가 없습니다.',
            'token.exists'             => '유효한 미디어가 아닙니다.',
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

    private function update(?string $title, ?string $imageFilename): array
    {
        $data = [];
        if ($title !== null) {
            $data['title'] = $title;
        }
        if ($imageFilename !== null) {
            $data['image_filename'] = $imageFilename;
        }

        try {
            DB::table('medias')
                ->where('token', $this->token)
                ->update($data);

            return ['status' => true];
        } catch (\Exception $e) {
            return [
                'status'  => false,
                'message' => '미디어 정보 저장중 오류가 발생했습니다.',
                'error'   => $e->getMessage(),
            ];
        }
    }

    private function getImageFilename()
    {
        return DB::table('medias')
            ->where('token', $this->token)
            ->first();
    }
}
