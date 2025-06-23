import React from "react";
import { usePage } from "@inertiajs/react";
import NavBar from "./NavBar";

interface HeaderData {
    logo_image_filename: string;
}

export default function Header() {
    // Inertia props 에서 header 배열을 꺼냅니다
    const { header } = usePage<{ header: HeaderData[] }>().props;

    // header 데이터가 없으면 로고 없이 렌더링
    const logoFilename = Array.isArray(header) && header.length > 0
        ? header[0].logo_image_filename
        : "";

    // 파일명만 넘어오면 /storage/ 붙여주기
    const logoSrc = logoFilename.startsWith("http")
        ? logoFilename
        : `/storage/${logoFilename}`;

    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-transparent box-border py-3">
            <div className="container mx-auto px-4 flex justify-between items-center">
                {/* 로고 추가 */}
                {logoFilename && (
                    <img
                        src={logoSrc}
                        alt="Site Logo"
                        className="h-8 object-contain"
                    />
                )}

                {/* 기존 NavBar */}
                <NavBar />
            </div>
        </header>
    );
}
