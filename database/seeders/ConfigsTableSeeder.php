<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConfigsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('configs')->insert([
            [
                'config'     => 'media_title',
                'value'      => '기본 세팅 입니다.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'config'     => 'about_title',
                'value'      => '기본 세팅 입니다.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
