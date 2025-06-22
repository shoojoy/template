import React from 'react'
import { Link, usePage } from '@inertiajs/react'

const menuItems = [
    { label: 'Hero', href: '/admin/hero' },
    { label: 'Media', href: '/admin/media' },
    { label: 'About', href: '/admin/about' },
    { label: 'Business', href: '/admin/business' },
]

export default function AdminMenu() {
    // 현재 URL (예: "/admin/business")
    const { url } = usePage<{ url: string }>()

    return (
        <ul className="flex flex-col space-y-1">
            {menuItems.map(item => {
                const isActive = url === item.href

                return (
                    <li key={item.href}>
                        <Link
                            href={item.href}
                            className={`
                block px-4 py-2 rounded transition
                hover:bg-gray-700
                ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300'}
              `}
                        >
                            {item.label}
                        </Link>
                    </li>
                )
            })}
        </ul>
    )
}
