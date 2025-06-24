import React, { useState } from "react";
import GuestMenu from "../basics/Menu";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

interface NavBarProps {
    scrolled: boolean;
}

export default function NavBar({ scrolled }: NavBarProps) {
    const [open, setOpen] = useState(false);
    const menuItems = [
        { href: "#home", name: "홈" },
        { href: "#media", name: "장비소개" },
        { href: "#about", name: "업체소개" },
        { href: "#business", name: "비즈니스" },
        { href: "#contact", name: "문의하기" },
    ];

    return (
        <>
            {/* 데스크탑 */}
            <div
                className="hidden lg:flex items-center gap-x-10"
                style={{ color: scrolled ? "black" : "white" }}
            >
                {menuItems.map((item, idx) => (
                    <GuestMenu key={idx} href={item.href} name={item.name} />
                ))}
            </div>

            {/* 모바일 햄버거 버튼 */}
            <div className="flex lg:hidden items-center">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="p-2 focus:outline-none"
                    style={{ color: scrolled ? "black" : "white" }}
                >
                    {open ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* 모바일 메뉴 (열렸을 때 전체 화면 오버레이) */}
            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center lg:hidden">
                    {menuItems.map((item, idx) => (
                        <GuestMenu
                            key={idx}
                            href={item.href}
                            name={item.name}
                            onClick={() => setOpen(false)}
                        />
                    ))}
                </div>
            )}
        </>
    );
}
