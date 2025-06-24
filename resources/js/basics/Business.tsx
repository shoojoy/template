// resources/js/basics/Business.tsx
import React from 'react'
import { usePage } from '@inertiajs/react'
import { motion } from 'framer-motion'

interface BusinessImage {
    token: string
    image_filename?: string
    image?: string
}

interface Config {
    config: string
    value: string
}

interface BusinessPageProps {
    configs?: Config[]
    businessImages?: BusinessImage[]
    [key: string]: any
}

export default function BusinessSection() {
    const { props } = usePage<BusinessPageProps>()
    const configs = Array.isArray(props.configs) ? props.configs : []
    const imagesRaw = Array.isArray(props.businessImages) ? props.businessImages : []

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
            <motion.div
                className="relative z-30 w-full text-center py-35"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
            >
                {title && (
                    <motion.h2
                        className="text-4xl font-bold text-[#2C2B28]"
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
                        className="text-2xl text-[#2C2B28] mt-2"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </motion.div>

            {/* CSS-only 파랄랙스 배경 + 오버레이 */}
            {firstImage ? (
                <div
                    className="absolute inset-0 top-[30%] bg-fixed bg-center bg-cover"
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
        </section>
    )
}
