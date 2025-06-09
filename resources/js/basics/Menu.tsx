import React from "react";

interface GuestMenuProps {
    href: string;
    name: string;
    onClick?: () => void;
}

export default function GuestMenu({ href, name, onClick }: GuestMenuProps) {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        const targetElement = document.querySelector(href);

        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 200);
        }

        if (onClick) {
            onClick();
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            style={{
                textDecoration: "none",
                color: "white",
                fontSize: "18px",
                fontWeight: "light",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "10px",
                display: "block",
                transition: "background 0.3s ease-in-out, transform 0.3s ease-in-out",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "scale(1)";
            }}
        >
            {name}
        </a>
    );
}
