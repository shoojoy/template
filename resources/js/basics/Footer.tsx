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

    if (!Array.isArray(footers) || footers.length === 0) {
        return null
    }

    const footer = footers[0]

    return (
        <footer className="bg-[#606060] text-white py-8">
            {/* 양측에 padding을 주는 wrapper */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-1 text-sm">
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
