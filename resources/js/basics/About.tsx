import React, { useEffect, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

interface AboutCounter {
    token: string
    title: string
    value: number | string
}

interface AboutImage {
    token: string
    image_filename?: string
    image?: string
}

interface Config {
    config: string
    value: string
}

interface PageProps {
    abouts?: AboutCounter[]
    aboutImages?: AboutImage[]
    configs?: Config[]
    [key: string]: any
}

// === 데스크탑 레이아웃용 컴포넌트 (원본 그대로) ===
const ImageGrid: React.FC<{ images: AboutImage[] }> = ({ images }) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    return (
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-8 justify-items-center">
            {images.slice(0, 4).map(({ token, image_filename, image }, idx) => {
                const raw = (image_filename ?? image ?? '').trim()
                const src = raw.startsWith('http') ? raw : `${baseUrl}${raw}`
                const offsetClass = idx % 2 === 0 ? '-mt-8' : ''
                return (
                    <motion.div
                        key={token}
                        className={`w-70 aspect-square ${offsetClass} cursor-pointer border border-black/20 rounded-lg shadow-lg`}
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                        whileHover={{ scale: 1.1 }}
                        style={{ originX: 0.5, originY: 0.5 }}
                    >
                        <img
                            src={encodeURI(src)}
                            alt="About image"
                            className="w-full h-full object-cover rounded-lg"
                            onError={e => console.error('Image load failed:', e.currentTarget.src)}
                        />
                    </motion.div>
                )
            })}
        </div>
    )
}

const CounterRow: React.FC<{ counters: AboutCounter[] }> = ({ counters }) => (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-center divide-x divide-gray-300">
        {counters.map(({ token, title, value }, idx) => {
            const displayValue =
                value !== null && value !== undefined && value !== '' ? `${value}+` : ''
            return (
                <motion.div
                    key={token}
                    className="flex flex-col items-center px-3 sm:px-5 py-2"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                >
                    <motion.span
                        className="text-xs sm:text-sm md:text-lg text-gray-700 mb-1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                    >
                        {title}
                    </motion.span>
                    <motion.span
                        className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-700"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 + 0.3, ease: 'backOut' }}
                    >
                        {displayValue}
                    </motion.span>
                </motion.div>
            )
        })}
    </div>
)

// === 모바일 전용 슬라이더 컴포넌트 (모든 이미지 슬라이드 처리) ===
const MobileImageSlider: React.FC<{ images: AboutImage[] }> = ({ images }) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
    const count = images.length
    const settings = {
        dots: true,
        infinite: count > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: count > 1,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: '0px',
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerMode: true,
                    centerPadding: '0px',
                }
            }
        ]
    }

    return (
        <Slider {...settings} className="w-full">
            {images.map(({ token, image_filename, image }, idx) => {
                const raw = (image_filename ?? image ?? '').trim()
                const src = raw.startsWith('http') ? raw : `${baseUrl}${raw}`
                return (
                    <motion.div
                        key={token}
                        className="w-full max-w-xs mx-auto aspect-square cursor-pointer border border-black/20 rounded-lg shadow-lg"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                        whileHover={{ scale: 1.03 }}
                        style={{ originX: 0.5, originY: 0.5 }}
                    >
                        <img
                            src={encodeURI(src)}
                            alt="About image"
                            className="w-full h-full object-cover rounded-lg"
                            onError={e => console.error('Image load failed:', e.currentTarget.src)}
                        />
                    </motion.div>
                )
            })}
        </Slider>
    )
}

export default function AboutSection() {
    const { props } = usePage<PageProps>()
    const abouts = useMemo(() => Array.isArray(props.abouts) ? props.abouts : [], [props.abouts])
    const images = useMemo(() => Array.isArray(props.aboutImages) ? props.aboutImages : [], [props.aboutImages])
    const aboutTitle = useMemo(
        () => props.configs?.find(c => c.config === 'about_title')?.value || '',
        [props.configs]
    )

    useEffect(() => {
        console.log('About counters:', abouts)
        console.log('About images:', images)
    }, [abouts, images])

    return (
        <section id="about" className="w-full bg-[#FFFFF0]">
            {/* ─── 데스크탑 전용 원본 레이아웃 ─── */}
            <div className="hidden md:block relative min-h-screen">
                <div className="absolute left-50 top-1/4 w-1/3 p-4">
                    <ImageGrid images={images} />
                </div>
                <div className="absolute left-350 top-130 transform -translate-x-1/2 -translate-y-1/2 w-1/3 p-4">
                    <CounterRow counters={abouts} />
                </div>
                {aboutTitle && (
                    <motion.h2
                        className="absolute top-80 left-337 transform -translate-x-1/2 mt-8 text-3xl sm:text-5xl font-bold text-[#2C2B28]"
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.6 }}
                    >
                        {aboutTitle}
                    </motion.h2>
                )}
            </div>

            {/* ─── 모바일 전용 전체 화면 레이아웃 ─── */}
            <div className="md:hidden relative w-full flex flex-col h-screen">
                <div className="absolute inset-0 bg-[#FFFFF0]" />
                {aboutTitle && (
                    <motion.h2
                        className="z-10 text-2xl font-bold text-center text-[#2C2B28] mt-50"
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                    >
                        {aboutTitle}
                    </motion.h2>
                )}
                <div className="z-10 py-6 flex justify-center">
                    <div className="w-full max-w-xs">
                        <MobileImageSlider images={images} />
                    </div>
                </div>
                <div className="z-10 mt-20 md:mt-0 mb-8">
                    <CounterRow counters={abouts} />
                </div>
            </div>
        </section>
    )
}
