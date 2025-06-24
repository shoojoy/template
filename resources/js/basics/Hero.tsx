import { useEffect, useState } from "react";

interface HeroProps {
    heroes: any[];
}

export default function HeroComponent({ heroes }: HeroProps) {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        if (heroes.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIdx((i) => (i + 1) % heroes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroes]);

    if (!heroes.length) return <p>Heroes not found</p>;

    // 1) 제목 전용 클래스 (크기, 색상, 섀도우, 얇은 폰트)
    const titleClass = "text-2xl sm:text-3xl md:text-5xl font-light text-[#FFFFFF] drop-shadow";

    // 2) 부제목 전용 클래스 (같은 크기·색상·섀도우 + 볼드 + margin-top)
    const subtitleClass = "text-2xl sm:text-3xl md:text-5xl font-bold text-[#FFFFF0] drop-shadow mt-4";

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
                        <div className="absolute inset-0 bg-black opacity-40" />

                        {/* 컨텐츠 */}
                        <div className="container mx-auto h-full px-4 grid grid-cols-1 md:grid-cols-2 items-center">
                            <div className="py-8">
                                <h2 className={titleClass}>{hero.title}</h2>
                                <p className={subtitleClass}>{hero.subtitle}</p>
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
