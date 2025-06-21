import React, { useEffect } from 'react'
import Slider from 'react-slick'
import { usePage, Link } from '@inertiajs/react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// 실제로 내려오는 데이터 필드에 맞춰 interface 수정
interface Media {
    token: string
    title: string
    // 서버에서 'image' 프로퍼티로 내려올 수도 있으므로 optional로 추가
    image?: string
    // 또는 'image_filename' 로 내려올 수도 있음
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
    const page = usePage<PageProps>()
    const rawMedias = Array.isArray(page.props.medias) ? page.props.medias : []
    const configs = Array.isArray(page.props.configs) ? page.props.configs : []

    // 실제 이미지 URL 필드(potential fields) 중 유효한 값만 추출
    const validMedias = rawMedias
        .map((m) => ({
            ...m,
            // image_filename 우선, 없으면 image 사용
            _url: (m.image_filename ?? m.image ?? '').trim(),
        }))
        // URL이 문자열이고 비어있지 않아야 유효
        .filter((m) => typeof m._url === 'string' && m._url !== '')

    // base URL (env or current origin)
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    const mediaTitle = configs.find((c) => c.config === 'media_title')?.value || ''
    const count = validMedias.length

    // react-slick 설정
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
            { breakpoint: 1024, settings: { slidesToShow: getShow(3), infinite: infiniteLoop } },
            { breakpoint: 768, settings: { slidesToShow: getShow(2), infinite: infiniteLoop } },
            { breakpoint: 480, settings: { slidesToShow: getShow(1), infinite: infiniteLoop } },
        ],
    }

    // 디버그 로그: 프론트에서 유효 미디어 확인
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

    return (
        <div id="media" className="w-full h-screen py-20 bg-gradient-to-b from-[#EDECE9] to-white">
            <div className="max-w-screen-2xl mx-auto px-4">
                <Slider {...settings}>
                    {validMedias.map((m) => {
                        // 필터된 _url 사용
                        const rawUrl = m._url
                        // 절대/상대 URL 처리
                        const src = rawUrl.startsWith('http') ? rawUrl : `${baseUrl}${rawUrl}`

                        return (
                            <div key={m.token} className="px-2">
                                <div className="bg-white shadow-xl rounded-2xl overflow-hidden h-[320px] relative">
                                    <img
                                        src={encodeURI(src)}
                                        alt={m.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => console.error('🖼 img load fail ▶', e.currentTarget.src)}
                                    />
                                    <h3 className="absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow">
                                        {m.title}
                                    </h3>
                                </div>
                            </div>
                        )
                    })}
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
