import React, { useState } from 'react'
import AdminMenu from './AdminMenu'
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi'

export default function AdminNavBar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* 모바일 햄버거 버튼 */}
            <div className="fixed top-4 left-4 z-50 lg:hidden">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="p-2 bg-gray-800 text-gray-100 rounded-md shadow-md focus:outline-none"
                >
                    {open ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
                </button>
            </div>

            {/* 사이드바 / 오버레이 */}
            <nav
                className={`
          fixed top-0 left-0 h-screen bg-gray-800 text-gray-100 shadow-lg
          transition-transform duration-200 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}  /* 모바일 토글 */
          lg:translate-x-0 lg:w-60  /* md 이상의 뷰포트에선 항상 보여줌 */
          w-64  /* 모바일에서 연 상태일 때 너비 */
        `}
            >
                <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
                    관리자 페이지
                </div>
                <div className="p-4 overflow-y-auto">
                    <AdminMenu />
                </div>
            </nav>
        </>
    )
}
