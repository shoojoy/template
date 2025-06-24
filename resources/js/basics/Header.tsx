import React, { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import NavBar from "./NavBar";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    // 스크롤 이벤트 리스너 추가
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Inertia props에서 header 배열을 꺼냅니다
    const { header } = usePage<{ header: { logo_image_filename: string }[] }>().props;
    const logoFilename = Array.isArray(header) && header.length > 0
        ? header[0].logo_image_filename
        : "";
    const logoSrc = logoFilename.startsWith("http")
        ? logoFilename
        : `/storage/${logoFilename}`;

    // ─── 여기에 로고 클릭 핸들러 추가 ───
    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const heroEl = document.querySelector("#home");
        if (heroEl) {
            // 필요 시 딜레이를 주거나 offset 조절 가능
            heroEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <header
            className="fixed inset-x-0 top-0 z-50 box-border py-3 transition-all duration-300"
            style={{
                backgroundColor: scrolled ? "white" : "transparent",
                boxShadow: scrolled ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none",
            }}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                {logoFilename && (
                    // <img> 대신 <a> 태그로 감싼 뒤 onClick 핸들러 지정
                    <a href="#home" onClick={handleLogoClick}>
                        <img
                            src={logoSrc}
                            alt="Site Logo"
                            className="h-8 object-contain"
                        />
                    </a>
                )}

                {/* 기존 NavBar */}
                <NavBar scrolled={scrolled} />
            </div>
        </header>
    );
}
