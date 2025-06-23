import React, { useState } from 'react'
import axios from 'axios'
import { usePage } from '@inertiajs/react'

interface Config {
    config: string
    value: string
}

export default function Inquiry() {
    const { props } = usePage<{ configs?: Config[] }>()
    const inquiryTitle = props.configs?.find(c => c.config === 'inquiry_title')?.value || '문의하기'

    const [form, setForm] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        title: '',
        text: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)
        setLoading(true)

        try {
            const res = await axios.post('/inquiry/store', form, { withCredentials: true })
            if (res.data.status) {
                setSuccess(true)
                setForm({ name: '', phoneNumber: '', email: '', title: '', text: '' })
            } else {
                setError(res.data.message || '문의 저장에 실패했습니다.')
            }
        } catch (err: any) {
            setError(err.response?.data?.message || '서버 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="contact" className="bg-gray-100 py-12">
            <div className="max-w-xl mx-auto px-4 bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-6">{inquiryTitle}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="성함"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="연락처"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="이메일 (선택)"
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="문의 제목"
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                    <textarea
                        name="text"
                        value={form.text}
                        onChange={handleChange}
                        placeholder="문의 내용"
                        rows={5}
                        className="w-full border px-3 py-2 rounded"
                        required
                    ></textarea>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50"
                    >
                        {loading ? '전송 중...' : '문의하기'}
                    </button>
                </form>

                {success && <p className="text-green-600 mt-4">문의가 성공적으로 접수되었습니다.</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </section>
    )
}
