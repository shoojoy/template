import React from "react";

interface GuestMenuProps {
    href: string;
    name: string;
    onClick?: () => void;
}

export default function GuestMenu({ href, name, onClick }: GuestMenuProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
        onClick?.();
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            style={{
                color: "inherit",            // ← 부모 NavBar의 color를 그대로 따릅니다
                textDecoration: "none",
                fontSize: "18px",
                fontWeight: "300",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                display: "block",
                transition: "transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
            {name}
        </a>
    );
}
