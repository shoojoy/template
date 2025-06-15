import { useEffect, useState } from "react";

interface Hero {
    title: string;
    subtitle: string;
    imageFilename: string;
}

export default function HeroComponent() {
    const [heroes, setHeroes] = useState<Hero[]>([]);

    async function getHeroes() {
        try {
            const res = await fetch('/hero');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const wrapper = await res.json() as { status: boolean; heroes: Hero[] };

            if (!wrapper.status || wrapper.heroes.length === 0) {
                window.location.href = '/admins/SignUp';
                return;
            }

            setHeroes(wrapper.heroes);
        } catch (err) {
            console.error("Error fetching heroes:", err);
            window.location.href = '/admins/SignUp';
        }
    }

    useEffect(() => {
        getHeroes();
    }, []);

    return (
        <div>
            {heroes.length === 0 ? (
                <p>Heroes not found</p>
            ) : (
                heroes.map((hero, index) => (
                    <div key={index}>
                        <h2>{hero.title}</h2>
                        <h3>{hero.subtitle}</h3>
                        <img src={hero.imageFilename} alt={hero.title} />
                    </div>
                ))
            )}
        </div>
    );
}
