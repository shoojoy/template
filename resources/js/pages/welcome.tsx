import Hero from "@/basics/Hero";
import Midea from "@/basics/Media";
import About from "@/basics/About";
import Layout from "@/layouts/Layouts";
import { usePage } from "@inertiajs/react";

export default function Welcome() {
    const contents = usePage().props;

    return (
        <Layout>
            <Hero heroes={contents.heroes} />
            <Midea medias={contents.medias} />
            <About abouts={contents.abouts} />
        </Layout>
    );
}
