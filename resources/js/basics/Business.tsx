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
    const historiesRaw = Array.isArray(props.businessHistories) ? props.businessHistories : []

    const title = configs.find(c => c.config === 'business_title')?.value || ''
    const subtitle = configs.find(c => c.config === 'business_subtitle')?.value || ''

    const validImages = imagesRaw
        .map(img => ({ ...img, _url: (img.image_filename ?? img.image ?? '').trim() }))
        .filter(img => img._url)
    const firstImage = validImages[0] ?? null
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin

    const imageUrl = firstImage
        ? encodeURI(
            firstImage._url.startsWith('http')
                ? firstImage._url
                : `${baseUrl}${firstImage._url}`
        )
        : ''

    const histories = historiesRaw.map(h => {
        const date = new Date(h.year)
        const yearStr = date.getFullYear()
        const monthStr = String(date.getMonth() + 1).padStart(2, '0')
        return { ...h, displayYear: `${yearStr}.${monthStr}` }
    })

    //–– Framer Motion variants for staggered history animation ––
    const historyListVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    }

    const historyItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    }

    return (
        <section
            id="business"
            className="
        relative w-full flex flex-col justify-between
        h-screen overflow-hidden
        sm:flex-row sm:items-center sm:h-screen sm:justify-start
      "
        >
            {/* 배경 이미지 */}
            {firstImage ? (
                <div
                    className="absolute inset-0 bg-center bg-cover"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <div className="absolute inset-0 bg-black/60 pointer-events-none" />
                </div>
            ) : (
                <p className="absolute inset-0 flex items-center justify-center text-gray-500">
                    등록된 이미지가 없습니다.
                </p>
            )}

            {/* 메인 컨텐츠 (상단) */}
            <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 flex items-start sm:items-center h-auto sm:h-full pt-8 sm:pt-0">
                <motion.div
                    className="
            flex flex-col justify-center items-start
            max-w-2xl text-left text-white space-y-4
            ml-2            /* 모바일: 좌측 여백 0.5rem */
            sm:ml-4         /* sm 이상: 좌측 여백 1rem */
            md:ml-44        /* md 이상: 좌측 여백 11rem */
            mt-36            /* 모바일: 위쪽 여백 2rem */
            sm:mt-0         /* sm 이상: 위쪽 여백 제거 */
          "
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
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
                            className="text-2xl"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </motion.div>
            </div>

            {/* 연혁 리스트 (하단) */}
            <motion.div
                className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-4 ml-10 sm:ml-0 transform -translate-y-4 sm:translate-y-0"
            >
                <div className="relative">
                    <h3 className="absolute left-3 transform -translate-x-1/2 -top-8 text-2xl font-bold text-white px-2">
                        History
                    </h3>
                    <div className="absolute left-3 top-0 h-full border-l-2 border-white/50" />

                    <motion.ul
                        className="space-y-12 pt-12 pl-12"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ delay: 0.5 }}
                        variants={historyListVariants}
                    >
                        {histories.map(h => (
                            <motion.li
                                key={h.token}
                                className="relative"
                                variants={historyItemVariants}
                            >
                                <span className="absolute left-1.5 top-2 w-4 h-4 bg-white rounded-full ring-2 ring-black/50 transform -translate-x-1/2" />
                                <div className="ml-10">
                                    <div className="text-lg font-semibold">{h.displayYear}</div>
                                    <div className="mt-1 text-base opacity-90">{h.content}</div>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                </div>
            </motion.div>
        </section>
    )
}
