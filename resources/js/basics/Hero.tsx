import { useEffect, useState } from "react";

interface Hero {
    title: string;
    subtitle: string;
    image: string;
}

export default function HeroComponent() {
    const [heroes, setHeroes] = useState<Hero[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        fetch('/hero')
            .then(res => {
                if (!res.ok) throw new Error(res.statusText);
                return res.json();
            })
            .then((wrapper: { status: boolean; heroes: Hero[] }) => {
                if (!wrapper.status || wrapper.heroes.length === 0) {
                    window.location.href = '/admins/SignUp';
                    return;
                }
                setHeroes(wrapper.heroes);
            })
            .catch(() => window.location.href = '/admins/SignUp');
    }, []);

    useEffect(() => {
        if (heroes.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIdx(i => (i + 1) % heroes.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroes]);

    if (!heroes.length) return <p>Heroes not found</p>;

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {heroes.map((hero, idx) => {
                const offset = (idx - currentIdx) * 100;
                console.log(idx, hero.image);

                return (
                    <section
                        key={idx}
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-in-out"
                        style={{
                            transform: `translateX(${offset}%)`,
                            backgroundImage: `url("${hero.image}")`
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 max-w-md text-white">
                            <h2 className="text-4xl font-bold drop-shadow">{hero.title}</h2>
                            <p className="mt-2 text-4xl drop-shadow">{hero.subtitle}</p>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
