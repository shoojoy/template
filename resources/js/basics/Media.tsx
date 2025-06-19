import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Slider from 'react-slick'
import { usePage, Link } from '@inertiajs/react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface MediaProps {
    medias: any[];
}

export default function MediaCarousel() {
    const [medias, setMedias] = useState<MediaProps[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { props } = usePage()
    const configs = props.configs as { config: string; value: string }[]

    const mediaTitle = configs.find(i => i.config === 'media_title')?.value || ''

    useEffect(() => {
        axios
            .get<{ status: boolean; medias: MediaProps[] }>('/media')
            .then(res => {
                if (!res.data.status) throw new Error()
                setMedias(res.data.medias)
            })
            .catch(() => setError('미디어를 불러오는 중 오류가 발생했습니다.'))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        )
    }
    if (error) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-red-500">{error}</p>
            </div>
        )
    }
    if (!medias.length) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <p className="text-gray-500">등록된 미디어가 없습니다.</p>
            </div>
        )
    }

    const count = medias.length
    const getShow = (max: number) => Math.min(count, max)
    const infiniteLoop = count >= 2

    const settings = {
        dots: true,
        speed: 500,
        slidesToShow: getShow(5),
        slidesToScroll: 1,
        infinite: infiniteLoop,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: getShow(3),
                    infinite: infiniteLoop,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: getShow(2),
                    infinite: infiniteLoop,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: getShow(1),
                    infinite: infiniteLoop,
                },
            },
        ],
    }

    return (
        <div
            id="media"
            className="w-full h-screen py-20 bg-gradient-to-b from-[#EDECE9] to-white"
        >
            <div className="max-w-screen-2xl mx-auto px-4">
                <Slider {...settings}>
                    {medias.map(m => (
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
