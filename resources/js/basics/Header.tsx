import React from "react";
import NavBar from "./NavBar";

export default function Header() {
    return (
        <header className="fixed inset-x-0 top-0 z-50 bg-transparent box-border py-3">
            <div className="container flex justify-end items-center">
                <NavBar />
            </div>
        </header>
    );
}
