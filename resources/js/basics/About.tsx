import React, { useEffect, useMemo } from 'react'
import { usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import CountUp from 'react-countup'
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

// === 데스크탑용 이미지 그리드 (짝수:좌 슬라이드업, 홀수:우 슬라이드다운) ===
const ImageGridFlexTwoCol: React.FC<{ images: AboutImage[] }> = ({ images }) => {
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    const leftImages = images.filter((_, i) => i % 2 === 0)
    const rightImages = images.filter((_, i) => i % 2 === 1)

    const commonSettings = {
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: false,
        pauseOnHover: false,
        speed: 600,
    }

    const leftSettings = { ...commonSettings, rtl: false }
    const rightSettings = { ...commonSettings, rtl: true }

    const renderImg = (img: AboutImage, idx: number) => {
        const raw = (img.image_filename ?? img.image ?? '').trim()
        const src = raw.startsWith('http') ? raw : `${baseUrl}${raw}`

        return (
            <motion.div
                key={img.token}
                className="w-full aspect-square cursor-pointer border border-black/20 rounded-lg shadow-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
                <img
                    src={encodeURI(src)}
                    alt="About image"
                    className="w-full h-full object-cover"
                    onError={e => console.error('Image load failed:', e.currentTarget.src)}
                />
            </motion.div>
        )
    }

    return (
        <div className="flex w-full gap-4 mt-24">
            <div className="flex flex-col gap-4 w-1/2 relative -top-6 overflow-hidden">
                <Slider {...leftSettings}>
                    {leftImages.map(renderImg)}
                </Slider>
            </div>
            <div className="flex flex-col gap-4 w-1/2 overflow-hidden">
                <Slider {...rightSettings}>
                    {rightImages.map(renderImg)}
                </Slider>
            </div>
        </div>
    )
}

// === 카운터 행 컴포넌트 (flex + 반응형 + CountUp) ===
const CounterRow: React.FC<{ counters: AboutCounter[] }> = ({ counters }) => (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between divide-x divide-gray-300">
        {counters.map(({ token, title, value }, idx) => {
            const numericValue = typeof value === 'number'
                ? value
                : parseInt(value as string, 10) || 0

            return (
                <motion.div
                    key={token}
                    className="flex-1 min-w-0 flex flex-col items-center px-4 py-3"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                >
                    <motion.span
                        className="
                    text-[clamp(1rem,2.2vw,1.2rem)]
                    sm:text-[clamp(1.125rem,2vw,1.3rem)]
                    md:text-[clamp(1rem,1.6vw,1.1rem)]
                    text-gray-700 mb-1
                    "
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                    >
                        {title}
                    </motion.span>
                    <motion.span
                        className="
                    text-[clamp(1.8rem,3vw,2.2rem)]
                    sm:text-[clamp(2rem,3.5vw,2.5rem)]
                    md:text-[clamp(2.2rem,2.5vw,2.8rem)]
                    font-extrabold text-gray-700
                    "
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: idx * 0.1 + 0.3, ease: 'backOut' }}
                    >
                        <CountUp
                            start={1}
                            end={numericValue}
                            duration={2}
                            separator=","
                            suffix="+"
                            enableScrollSpy={true}
                            scrollSpyOnce={true}
                        />
                    </motion.span>
                </motion.div>
            )
        })}
    </div>
)

// === 모바일 이미지 슬라이더 (변경 없음) ===
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
    }

    return (
        <Slider {...settings} className="w-full">
            {images.map(({ token, image_filename, image }, idx) => {
                const raw = (image_filename ?? image ?? '').trim()
                const src = raw.startsWith('http') ? raw : `${baseUrl}${raw}`
                return (
                    <motion.div
                        key={token}
                        className="w-full max-w-xs mx-auto aspect-square cursor-pointer border border-black/20 rounded-lg shadow-lg overflow-hidden"
                        initial={{ y: 50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                        whileHover={{ scale: 1.03 }}
                    >
                        <img
                            src={encodeURI(src)}
                            alt="About image"
                            className="w-full h-full object-cover"
                            onError={e => console.error('Image load failed:', e.currentTarget.src)}
                        />
                    </motion.div>
                )
            })}
        </Slider>
    )
}

// === 메인 컴포넌트 ===
export default function AboutSection() {
    const { props } = usePage<PageProps>()
    const abouts = useMemo(
        () => (Array.isArray(props.abouts) ? props.abouts : []),
        [props.abouts]
    )
    const images = useMemo(
        () => (Array.isArray(props.aboutImages) ? props.aboutImages : []),
        [props.aboutImages]
    )
    const aboutTitle = useMemo(
        () => props.configs?.find(c => c.config === 'about_title')?.value || '',
        [props.configs]
    )

    useEffect(() => {
        console.log('About counters:', abouts)
        console.log('About images:', images)
    }, [abouts, images])

    return (
        <section id="about" className="w-full bg-[#FFFFF0] min-h-screen flex items-center">
            <div className="container mx-auto px-4">
                {/* 데스크탑 레이아웃 */}
                <div className="hidden md:flex items-start gap-8">
                    <div className="w-1/2">
                        <ImageGridFlexTwoCol images={images} />
                    </div>
                    <div className="w-1/2 flex flex-col items-center mt-80">
                        {aboutTitle && (
                            <motion.h2
                                className="text-3xl sm:text-5xl font-bold text-[#2C2B28] mb-8"
                                initial={{ opacity: 0, y: -20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.6 }}
                            >
                                {aboutTitle}
                            </motion.h2>
                        )}
                        <CounterRow counters={abouts} />
                    </div>
                </div>

                {/* 모바일 레이아웃 */}
                <div className="md:hidden flex flex-col items-center gap-6">
                    {aboutTitle && (
                        <motion.h2
                            className="text-4xl font-bold text-center text-[#2C2B28]"
                            initial={{ opacity: 0, y: -10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5 }}
                        >
                            {aboutTitle}
                        </motion.h2>
                    )}
                    <div className="w-full max-w-xs">
                        <MobileImageSlider images={images} />
                    </div>
                    <div className="mt-10 w-full flex justify-center">
                        <CounterRow counters={abouts} />
                    </div>
                </div>
            </div>
        </section>
    )
}
