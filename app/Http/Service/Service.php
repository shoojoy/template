<?php

namespace App\Http\Service;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class Service
{
    public function storeImage(UploadedFile $image, string $pathname): array
    {
        $imageFilename = uniqid() . '.' . $image->getClientOriginalExtension();

        $directory = 'uploads/' . $pathname;

        try {
            $path = $image->storeAs($directory, $imageFilename, 'public');

            return [
                'status' => true,
                'imagePath' => Storage::url($path),
                'pathname' => $pathname,
                'imageFilename' => $imageFilename
            ];
        } catch (\Exception $e) {
            return [
                'status' => false,
                'message' => '이미지 파일을 저장하는 과정에서 오류가 발생했습니다.',
                'error' => $e->getMessage()
            ];
        }
    }

    public function destroyImage(string $pathname, string $filename): array
    {
        if (Storage::disk('public')->exists('uploads/' . $pathname . '/' . $filename)) {
            Storage::disk('public')->delete('uploads/' . $pathname . '/' . $filename);

            return [
                'status' => true,
                'message' => '이미지 파일이 성공적으로 삭제되었습니다.'
            ];
        }

        return [
            'status' => false,
            'message' => '기존 이미지를 삭제하는 과정에서 오류가 발생했습니다.'
        ];
    }
}
