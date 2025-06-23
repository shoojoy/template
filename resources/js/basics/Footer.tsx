import React from 'react'
import { usePage } from '@inertiajs/react'

interface FooterData {
    username: string
    password: string
    address: string
    company_name: string
    ceo_name: string
    business_number: string
    phone: string
    fax: string
    email: string
}

export default function Footer() {
    // Inertia 페이지 props 에서 footers 배열을 꺼냅니다
    const { footers } = usePage<{ footers: FooterData[] }>().props

    // footers가 없거나 비어있으면 아무것도 렌더링하지 않음
    if (!Array.isArray(footers) || footers.length === 0) {
        return null
    }

    // 배열의 첫 번째 요소 사용
    const footer = footers[0]

    return (
        <footer className="bg-[#606060] text-white z-10 py-8">
            <div className="container mx-auto space-y-1 text-sm">
                <div className="font-bold text-lg">{footer.company_name}</div>
                <div>주소: {footer.address}</div>
                <div>대표자: {footer.ceo_name}</div>
                <div>사업자등록번호: {footer.business_number}</div>
                <div>
                    전화: {footer.phone} / 팩스: {footer.fax}
                </div>
                <div>이메일: {footer.email}</div>
                <div className="mt-4 text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} {footer.company_name}. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
