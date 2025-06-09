import Menu from "../basics/Menu";

export default function NavBar() {
    const menuItems = [
        { href: "#home", name: "홈" },
        { href: "#media", name: "장비소개" },
        { href: "#about", name: "업체소개" },
        { href: "#business", name: "비즈니스" },
        { href: "#contact", name: "문의하기" },
    ];

    return (
        <div className="hidden lg:flex flex-row gap-x-10 text-white">
            {menuItems.map((item, index) => (
                <Menu key={index} href={item.href} name={item.name} />
            ))}
        </div>
    );
}

