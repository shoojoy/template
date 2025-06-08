import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <div
            className="w-screen h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/images/Hero/Hero.jpeg')" }}
        >
            <div className="flex items-center justify-center h-full bg-black bg-opacity-50">
                <h1 className="text-white text-4xl font-bold">
                    Hello World! I'm good
                </h1>
            </div>
        </div>
    );
};

export default HeroSection;
