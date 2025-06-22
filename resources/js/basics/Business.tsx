// resources/js/basics/Business.tsx
import React, { useEffect } from 'react'
import { usePage } from '@inertiajs/react'

interface BusinessImage {
    token: string
    image_filename?: string
    image?: string
}

interface Config {
    config: string
    value: string
}

// Inertia.usePage 제약을 만족시키기 위해 인덱스 시그니처 포함
interface BusinessPageProps {
    configs?: Config[]
    businessImages?: BusinessImage[]
    [key: string]: any
}

export default function BusinessSection() {
    const { props } = usePage<BusinessPageProps>()

    // 서버에서 넘어온 배열을 안전하게 받아오기
    const configs = Array.isArray(props.configs) ? props.configs : []
    const imagesRaw = Array.isArray(props.businessImages) ? props.businessImages : []

    // 설정값
    const title = configs.find(c => c.config === 'business_title')?.value || ''
    const subtitle = configs.find(c => c.config === 'business_subtitle')?.value || ''

    // 유효 URL만 걸러내기
    const validImages = imagesRaw
        .map(img => ({ ...img, _url: (img.image_filename ?? img.image ?? '').trim() }))
        .filter(img => img._url)

    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    // 디버깅
    useEffect(() => {
        console.log('Business configs:', configs)
        console.log('Business images:', validImages)
    }, [configs, validImages])

    return (
        <section id="business" className="py-20 bg-white">
            <div className="max-w-screen-xl mx-auto px-4 text-center space-y-4">
                {title && <h2 className="text-4xl font-bold">{title}</h2>}
                {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
            </div>

            <div className="max-w-screen-xl mx-auto px-4 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {validImages.length > 0
                    ? validImages.map(m => {
                        const src = m._url.startsWith('http')
                            ? m._url
                            : `${baseUrl}${m._url}`

                        return (
                            <div key={m.token} className="overflow-hidden rounded-lg shadow-lg">
                                <img
                                    src={encodeURI(src)}
                                    alt=""
                                    className="w-full h-48 object-cover"
                                    onError={e => console.error('Business image failed:', e.currentTarget.src)}
                                />
                            </div>
                        )
                    })
                    : (
                        <p className="col-span-full text-center text-gray-500">
                            등록된 이미지가 없습니다.
                        </p>
                    )
                }
            </div>
        </section>
    )
}
