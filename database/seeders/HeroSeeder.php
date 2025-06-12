<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HeroSeeder extends Seeder
{
    public function run()
    {
        DB::table('heroes')->updateOrInsert(
            ['id' => 1],
            [
                'id'             => 1,
                'title'          => '기본 타이틀',
                'sub_title'      => '기본 서브타이틀',
                'image_filename' => json_encode(
                    ['uploads/hero/Hero.jpeg'],
                    JSON_UNESCAPED_SLASHES
                ),
                'created_at'     => now(),
                'updated_at'     => now(),
            ]
        );
    }
}
