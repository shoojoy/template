// resources/js/pages/adminComponents/AdminLayout.tsx
import React, { ReactNode } from 'react'
import AdminNavBar from './AdminNavBar'

interface AdminLayoutProps {
    children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="flex">
            {/* 좌측 사이드바 */}
            <AdminNavBar />

            {/* 우측 콘텐츠 영역 */}
            <main className="ml-60 flex-1 bg-gray-100 min-h-screen p-6">
                {children}
            </main>
        </div>
    )
}
