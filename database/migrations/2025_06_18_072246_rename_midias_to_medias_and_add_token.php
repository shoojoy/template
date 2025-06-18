<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1) 테이블명 변경
        Schema::rename('midias', 'medias');

        // 2) token 컬럼 추가
        Schema::table('medias', function (Blueprint $table) {
            $table->string('token');
        });
    }

    public function down(): void
    {
        // 롤백 시 token 제거 후 테이블명 원복
        Schema::table('medias', function (Blueprint $table) {
            $table->dropColumn('token');
        });

        Schema::rename('medias', 'midias');
    }
};
