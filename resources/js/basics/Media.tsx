import React, { useEffect } from 'react'
import Slider from 'react-slick'
import { usePage, Link } from '@inertiajs/react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface Media {
    token: string
    title: string
    image?: string
    image_filename?: string
}

interface Config {
    config: string
    value: string
}

interface PageProps {
    medias?: Media[]
    configs?: Config[]
    [key: string]: any
}

export default function MediaCarousel() {
    const { props } = usePage<PageProps>()
    const rawMedias = Array.isArray(props.medias) ? props.medias : []
    const configs = Array.isArray(props.configs) ? props.configs : []

    const validMedias = rawMedias
        .map((media) => ({
            ...media,
            _url: (media.image_filename ?? media.image ?? '').trim(),
        }))
        .filter((media) => media._url !== '')

    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin
    const mediaTitle = configs.find((c) => c.config === 'media_title')?.value || ''
    const count = validMedias.length
    const infiniteLoop = count >= 2

    const settings = {
        dots: true,
        speed: 500,
        arrows: false,
        slidesToShow: Math.min(count, 6),
        slidesToScroll: 1,
        infinite: infiniteLoop,
        autoplay: infiniteLoop,
        autoplaySpeed: 2000,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: Math.min(count, 5) } },
            { breakpoint: 768, settings: { slidesToShow: Math.min(count, 3) } },
            { breakpoint: 480, settings: { slidesToShow: Math.min(count, 1) } },
        ],
    }

    useEffect(() => {
        console.log('validMedias:', validMedias)
    }, [validMedias])

    if (count === 0) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">등록된 미디어가 없습니다.</p>
            </div>
        )
    }

    const scrollToContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        const headerEl = document.querySelector('header')
        const contactEl = document.querySelector<HTMLElement>('#contact')
        if (contactEl) {
            const offset = headerEl?.getBoundingClientRect().height || 0
            const top = contactEl.getBoundingClientRect().top + window.pageYOffset - offset
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    return (
        <div id="media" className="relative w-full h-screen py-20 bg-[#FFFFF0] text-black overflow-x-hidden">
            {/* 제목 + 버튼 */}
            <div className="absolute top-[180px] left-[11%] flex flex-col space-y-18 z-10">
                {mediaTitle && (
                    <h2 className="text-5xl font-semibold text-[#2C2B28]">{mediaTitle}</h2>
                )}
                <a
                    href="#contact"
                    onClick={scrollToContact}
                    className="bg-[#2C2B28] hover:bg-neutral-700 text-white font-medium py-2 px-4 rounded w-fit"
                >
                    상담 바로가기
                </a>
            </div>

            {/* 슬라이더 */}
            <div className="mt-[400px]">
                <div className="w-[90%] mx-auto">
                    <Slider {...settings} className="custom-slick">
                        {validMedias.map((media) => {
                            const rawUrl = media._url
                            const src = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`

                            return (
                                <div key={media.token} className="px-2">
                                    <div className="relative bg-white rounded-2xl overflow-hidden h-[320px]">
                                        <img
                                            src={encodeURI(src)}
                                            alt={media.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => console.error('img load fail ▶', e.currentTarget.src)}
                                        />
                                        <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow">
                                            {media.title}
                                        </h3>
                                    </div>
                                </div>
                            )
                        })}
                    </Slider>
                </div>
            </div>
        </div>
    )
}
