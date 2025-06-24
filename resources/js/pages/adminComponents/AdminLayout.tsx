// resources/js/pages/adminComponents/AdminLayout.tsx
import React, { ReactNode } from 'react'
import AdminNavBar from './AdminNavBar'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex flex-col lg:flex-row overflow-x-hidden">
            {/* 좌측 사이드바 */}
            <AdminNavBar />

            {/* 우측 콘텐츠 영역 */}
            <main className="flex-1 bg-gray-100 min-h-screen px-4 py-6 lg:ml-60">
                {children}
            </main>
        </div>
    )
}
