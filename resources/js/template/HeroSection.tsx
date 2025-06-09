import React from 'react';

const HeroSection: React.FC = () => {
    return (
        <div
            className="w-full h-screen bg-cover bg-center overflow-hidden"
            style={{
                backgroundImage: "url('/images/Hero/Hero.jpeg')",
            }}
        >
        </div>
    );
};

export default HeroSection;
