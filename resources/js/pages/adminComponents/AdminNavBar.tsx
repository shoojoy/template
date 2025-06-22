// resources/js/pages/adminComponents/AdminNavBar.tsx
import React from 'react'
import AdminMenu from './AdminMenu'

export default function AdminNavBar() {
    return (
        <nav className="w-60 h-screen fixed top-0 left-0 bg-gray-800 text-gray-100 shadow-lg">
            <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
                어드민
            </div>
            <div className="p-4">
                <AdminMenu />
            </div>
        </nav>
    )
}
