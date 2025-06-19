<?php

namespace App\Http\Controllers\Hero\Services;

use App\Http\Service\Service;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class UpdateService extends Service
{
    private ?string $title;
    private ?string $subTitle;
    private ?UploadedFile $imageFilename;
    private string $token;

    public function __construct(?string $title, ?string $subTitle, ?UploadedFile $imageFilename, string $token)
    {
        $this->title = $title;
        $this->subTitle = $subTitle;
        $this->imageFilename = $imageFilename;
        $this->token = $token;
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
            'imageFilename' => $this->imageFilename,
            'token' => $this->token,
        ], [
            'title' => ['nullable', 'string', 'max:255'],
            'subTitle' => ['nullable', 'string', 'max:255'],
            'imageFilename' => ['nullable', 'file', 'mimes:jpg,jpeg,png,svg,gif'],
            'token' => ['required', 'string', 'exists:heroes,token']
        ], [
            'title.max' => '타이틀은 최대 255자까지 가능합니다.',
            'subTitle.max' => '서브 타이틀은 최대 255자까지 가능합니다.',
            'imageFilename.mimes' => '이미지는 jpg, jpeg, png, svg, gif 형식만 업로드할 수 있습니다.',
            'token.required' => '수정 가능한 페이지가 없습니다.',
            'token.exists'   => '유효한 페이지가 아닙니다.',
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
        $hero = DB::table('heroes')
            ->where('token', $this->token)
            ->first();

        if (!$hero) {
            return [
                'status'  => false,
                'message' => '수정할 Hero 를 찾을 수 없습니다.',
            ];
        }

        $data = [];

        if (!is_null($this->title)) {
            $data['title'] = $this->title;
        }

        if (!is_null($this->subTitle)) {
            $data['subtitle'] = $this->subTitle;
        }

        if ($this->imageFilename) {
            if (! empty($hero->image_filename)) {
                $this->destroyImage('hero', basename($hero->image_filename));
            }

            $upload = $this->storeImage($this->imageFilename, 'hero');
            if (! $upload['status']) {
                return [
                    'status'  => false,
                    'message' => $upload['message'],
                    'error'   => $upload['error'],
                ];
            }


            $data['image_filename'] = $upload['publicUrl'] ?? $upload['imagePath'];
        }

        if (empty($data)) {
            return [
                'status'  => false,
                'message' => '수정할 데이터가 없습니다.',
            ];
        }

        DB::table('heroes')
            ->where('token', $this->token)
            ->update($data);
        $updated = DB::table('heroes')
            ->where('token', $this->token)
            ->first();


        return [
            'status' => true,
            'hero'   => [
                'index'    => $updated->index,
                'title'    => $updated->title,
                'subtitle' => $updated->subtitle,
                'image'    => $updated->image_filename,
                'token'    => $updated->token,
            ],
        ];
    }
}
