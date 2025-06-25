// resources/js/basics/Business.tsx
import React from 'react'
import { usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'

interface BusinessImage {
    token: string
    image_filename?: string
    image?: string
}

interface BusinessHistory {
    token: string
    content: string
    year: string
}

interface Config {
    config: string
    value: string
}

interface BusinessPageProps {
    configs?: Config[]
    businessImages?: BusinessImage[]
    businessHistories?: BusinessHistory[]
    [key: string]: any
}

export default function BusinessSection() {
    const { props } = usePage<BusinessPageProps>()
    const configs = Array.isArray(props.configs) ? props.configs : []
    const imagesRaw = Array.isArray(props.businessImages) ? props.businessImages : []
    const histories = Array.isArray(props.businessHistories) ? props.businessHistories : []

    const title = configs.find(c => c.config === 'business_title')?.value || ''
    const subtitle = configs.find(c => c.config === 'business_subtitle')?.value || ''

    // 유효 이미지 추출
    const validImages = imagesRaw
        .map(img => ({ ...img, _url: (img.image_filename ?? img.image ?? '').trim() }))
        .filter(img => img._url)
    const firstImage = validImages[0] ?? null
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    // background-image URL
    const imageUrl = firstImage
        ? encodeURI(
            firstImage._url.startsWith('http')
                ? firstImage._url
                : `${baseUrl}${firstImage._url}`
        )
        : ''

    return (
        <section
            id="business"
            className="relative w-full h-screen bg-white overflow-hidden"
        >
            {/* 텍스트 영역: 흰색으로 변경 */}
            <motion.div
                className="relative z-30 w-full text-center py-10 text-white"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                {title && (
                    <motion.h2
                        className="text-4xl font-bold"
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.2, ease: 'backOut' }}
                    >
                        {title}
                    </motion.h2>
                )}
                {subtitle && (
                    <motion.p
                        className="text-2xl mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </motion.div>

            {/* 전체화면 배경 이미지 + 오버레이 */}
            {firstImage ? (
                <div
                    className="absolute inset-0 bg-fixed bg-center bg-cover"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    {/* 어두운 오버레이 */}
                    <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                </div>
            ) : (
                <p className="absolute inset-0 flex items-center justify-center text-gray-500">
                    등록된 이미지가 없습니다.
                </p>
            )}

            {/* 연혁 리스트 */}
            <motion.div
                className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                {histories.length > 0 ? (
                    <ul className="space-y-4">
                        {histories.map(h => (
                            <li key={h.token} className="flex justify-between">
                                <span className="font-semibold">{h.year.slice(0, 4)}.{h.year.slice(4, 6)}</span>
                                <span>{h.content}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-300">등록된 연혁이 없습니다.</p>
                )}
            </motion.div>
        </section>
    )
}
