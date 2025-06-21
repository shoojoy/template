import React, { useEffect } from 'react'
import { usePage } from '@inertiajs/react'

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

export default function AboutSection() {
    const { props } = usePage<PageProps>()
    const abouts = Array.isArray(props.abouts) ? props.abouts : []
    const imagesRaw = Array.isArray(props.aboutImages) ? props.aboutImages : []
    const configs = Array.isArray(props.configs) ? props.configs : []

    // About 섹션 타이틀
    const aboutTitle = configs.find(c => c.config === 'about_title')?.value || ''

    // 유효한 이미지 URL만 걸러내기
    const validImages = imagesRaw
        .map(img => ({
            ...img,
            _url: (img.image_filename ?? img.image ?? '').trim(),
        }))
        .filter(img => img._url)

    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    useEffect(() => {
        console.log('About counters:', abouts)
        console.log('About images:', validImages)
    }, [abouts, validImages])

    return (
        <section id="about" className="py-20 bg-gray-50">
            <div className="max-w-screen-xl mx-auto px-4 space-y-12">

                {/* 1. About Title */}
                {aboutTitle && (
                    <h2 className="text-4xl font-bold text-center">{aboutTitle}</h2>
                )}

                {/* 2. Counters Grid */}
                {abouts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {abouts.map(({ token, title, value }) => (
                            <div
                                key={token}
                                className="flex flex-col items-center bg-white p-6 rounded-2xl shadow"
                            >
                                <span className="text-5xl font-extrabold text-indigo-600">
                                    {value}
                                </span>
                                <span className="mt-2 text-lg text-gray-700">{title}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">등록된 카운터가 없습니다.</p>
                )}

                {/* 3. Images Grid */}
                {validImages.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {validImages.map(m => {
                            const src = m._url.startsWith('http')
                                ? m._url
                                : `${baseUrl}${m._url}`

                            return (
                                <div
                                    key={m.token}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg"
                                >
                                    <img
                                        src={encodeURI(src)}
                                        alt=""
                                        className="w-full h-48 object-cover"
                                        onError={e => console.error('Image load failed:', e.currentTarget.src)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">등록된 이미지가 없습니다.</p>
                )}

            </div>
        </section>
    )
}
