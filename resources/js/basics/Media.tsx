import React from 'react'
import Slider from 'react-slick'
import { usePage, Link } from '@inertiajs/react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface Media {
    token: string
    image_filename: string
    title: string
}
interface Config {
    config: string
    value: string
}
interface PageProps {
    medias: Media[]
    configs: Config[]
    // Inertia.PageProps 제약을 만족하기 위한 인덱스 서명
    [key: string]: any
}

export default function MediaCarousel() {
    const {
        props: { medias, configs },
    } = usePage<PageProps>()

    const mediaTitle = configs.find((c) => c.config === 'media_title')?.value || ''
    const count = medias.length

    // 슬라이드에 보여줄 개수 계산
    const getShow = (max: number) => Math.min(count, max)
    const infiniteLoop = count >= 2

    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: getShow(5),
        slidesToScroll: 1,
        infinite: infiniteLoop,
        autoplay: infiniteLoop,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: getShow(3), infinite: infiniteLoop },
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: getShow(2), infinite: infiniteLoop },
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: getShow(1), infinite: infiniteLoop },
            },
        ],
    }

    if (!count) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">등록된 미디어가 없습니다.</p>
            </div>
        )
    }

    return (
        <div
            id="media"
            className="w-full h-screen py-20 bg-gradient-to-b from-[#EDECE9] to-white"
        >
            <div className="max-w-screen-2xl mx-auto px-4">
                <Slider {...settings}>
                    {medias.map((m) => (
                        <div key={m.token} className="px-2">
                            <div className="bg-white shadow-xl rounded-2xl overflow-hidden h-[320px] relative">
                                <img
                                    src={m.image_filename}
                                    alt={m.title}
                                    className="w-full h-full object-cover"
                                />
                                <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow">
                                    {m.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </Slider>

                {mediaTitle && (
                    <div className="flex justify-between items-center mt-12 px-4">
                        <h2 className="text-4xl font-bold">{mediaTitle}</h2>
                        <Link
                            href="/contact"
                            className="bg-neutral-700 hover:bg-black text-white font-semibold py-2 px-4 rounded"
                        >
                            상담 바로가기
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
