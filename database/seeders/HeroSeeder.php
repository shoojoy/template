<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class HeroSeeder extends Seeder
{
    public function run()
    {
        $adminId = 1;

        $imagePath = 'uploads/hero/Hero.jpeg';

        $imageUrl = Storage::url($imagePath);

        DB::table('heroes')->updateOrInsert(
            ['id' => 1],
            [
                'id'             => 1,
                'title'          => '기본 타이틀',
                'sub_title'      => '기본 서브타이틀',
                'image_filename' => json_encode(
                    $imageUrl,
                    JSON_UNESCAPED_SLASHES
                ),
                'admin_id'       => $adminId,
                'created_at'     => now(),
                'updated_at'     => now(),
            ]
        );
    }
}
