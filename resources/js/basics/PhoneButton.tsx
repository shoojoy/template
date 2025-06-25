import React from 'react'
import { usePage } from '@inertiajs/react'

export default function PhoneButton() {
    const { footers } = usePage<{ footers: { phone: string }[] }>().props
    const phone = Array.isArray(footers) && footers[0]?.phone
    if (!phone) return null

    return (
        <div className="fixed bottom-6 right-4 lg:right-[20px] z-50">
            {/* 모바일 전용: lg 미만에서만 보이는 버튼 */}
            <a
                href={`tel:${phone}`}
                className="block lg:hidden bg-[#FFC0CB] hover:bg-[#808080] text-white p-4 rounded-full shadow-lg"
            >
                📞
            </a>

            {/* 데스크탑 전용: lg 이상에서 보이는 그룹 */}
            <div className="hidden lg:flex items-center group">
                {/* 번호를 먼저 렌더링 */}
                <span
                    className="opacity-0 group-hover:opacity-100 mr-2 bg-black text-white text-sm p-2 rounded-md transition-opacity duration-200 whitespace-nowrap"
                >
                    {phone}
                </span>
                <a
                    href={`tel:${phone}`}
                    className="bg-[#FFC0CB] hover:bg-[#808080] text-white p-4 rounded-full shadow-lg"
                >
                    📞
                </a>
            </div>
        </div>
    )
}
