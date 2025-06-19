import { useEffect, useState } from "react";

interface HeroProps {
    heroes: any[];
}

export default function HeroComponent({ heroes }: HeroProps) {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        console.log(heroes);

        if (heroes.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIdx((i) => (i + 1) % heroes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroes]);

    if (!heroes.length) return <p>Heroes not found</p>;

    // title과 subtitle에 동일하게 적용할 Tailwind 클래스
    const textClass = "text-4xl md:text-5xl font-bold text-white drop-shadow";

    return (
        <div id="home" className="relative w-full h-screen overflow-hidden">
            {heroes.map((hero, idx) => {
                const offset = (idx - currentIdx) * 100;
                return (
                    <section
                        key={idx}
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(${offset}%)`,
                            backgroundImage: `url("${hero.image}")`,
                        }}
                    >
                        {/* 어두운 오버레이 */}
                        <div className="absolute inset-0 bg-black opacity-40"></div>

                        {/* Bootstrap container 흉내 */}
                        <div className="container mx-auto h-full px-4 grid grid-cols-1 md:grid-cols-2 items-center">
                            <div className="py-8">
                                <h2 className={textClass}>{hero.title}</h2>
                                <p className={`${textClass} mt-4`}>{hero.subtitle}</p>
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
