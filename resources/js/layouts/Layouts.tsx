import { ReactNode } from "react";
import Header from "@/basics/Header";
import Footer from "@/basics/Footer";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
