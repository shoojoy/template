import React, { useEffect, useState, FormEvent } from 'react'
import axios from 'axios'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/react'

interface Inquiry {
    name: string
    phone_number: string
    email: string | null
    title: string
    text: string
    is_checked: number
    token: string
}

export default function AdminInquiry() {
    const { props } = usePage<{ configs: { config: string; value: string }[] }>()
    const configs = props.configs
    const [title, setTitle] = useState(configs.find(c => c.config === 'inquiry_title')?.value || '')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [selected, setSelected] = useState<Inquiry | null>(null)

    // Config 저장
    const onSubmitConfig = async (e: FormEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            setError('문의 섹션 제목을 입력해주세요.')
            return
        }
        setSaving(true)
        try {
            const res = await axios.post('/admin/config', {
                config: 'inquiry_title',
                value: title
            }, { withCredentials: true })
            if (!res.data.status) throw new Error(res.data.message || '저장 실패')
            Inertia.reload({ preserveState: true })
        } catch (err: any) {
            setError(err.message || '저장 중 오류가 발생했습니다.')
        } finally {
            setSaving(false)
        }
    }

    // 문의 목록 불러오기
    const fetchInquiries = async () => {
        try {
            const res = await axios.get('/inquiry')
            if (res.data.status && res.data.medias) {
                setInquiries(res.data.medias)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchInquiries()
    }, [])

    // 문의 확인 업데이트
    const markAsChecked = async (inquiry: Inquiry) => {
        try {
            if (inquiry.is_checked === 0) {
                await axios.put('/inquiry/update', {
                    token: inquiry.token,
                    isChecked: 1
                }, { withCredentials: true })

                // 프론트 상태도 즉시 반영
                setInquiries(prev => prev.map(i =>
                    i.token === inquiry.token ? { ...i, is_checked: 1 } : i
                ))
            }
            setSelected(inquiry) // 모달 오픈
        } catch (e) {
            alert('확인 처리 실패')
        }
    }

    // 문의 삭제
    const deleteInquiry = async (token: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        try {
            const res = await axios.delete(`/inquiry/${token}`, { withCredentials: true })
            if (res.data.status) {
                setInquiries(prev => prev.filter(i => i.token !== token))
                setSelected(null)
                alert('삭제되었습니다.')
            } else {
                alert(res.data.message || '삭제 실패')
            }
        } catch (e) {
            alert('삭제 중 오류 발생')
        }
    }

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow space-y-10">

                {/* 타이틀 설정 */}
                <form onSubmit={onSubmitConfig} className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-xl font-semibold">문의 섹션 설정</h2>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="문의 섹션 타이틀 입력"
                    />
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded disabled:opacity-50"
                    >
                        {saving ? '저장 중...' : '저장'}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>

                {/* 문의 목록 */}
                <div className="bg-white p-4 rounded shadow space-y-2">
                    <h2 className="text-xl font-semibold mb-2">문의 목록</h2>
                    {inquiries.length === 0 ? (
                        <p className="text-gray-500">등록된 문의가 없습니다.</p>
                    ) : (
                        inquiries.map(inquiry => (
                            <div
                                key={inquiry.token}
                                onClick={() => markAsChecked(inquiry)}
                                className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
                            >
                                <div className="font-semibold">{inquiry.title}</div>
                                <div className="text-sm text-gray-500">{inquiry.name}</div>
                                <div className={`text-xs ${inquiry.is_checked ? 'text-green-600' : 'text-red-500'}`}>
                                    {inquiry.is_checked ? '확인됨' : '미확인'}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* 팝업 모달 */}
                {selected && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow max-w-lg w-full relative space-y-4">
                            <button
                                onClick={() => setSelected(null)}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                            >
                                ✕
                            </button>
                            <h3 className="text-xl font-bold">{selected.title}</h3>
                            <div><strong>성함:</strong> {selected.name}</div>
                            <div><strong>연락처:</strong> {selected.phone_number}</div>
                            <div><strong>이메일:</strong> {selected.email || '없음'}</div>
                            <div className="whitespace-pre-line"><strong>내용:</strong><br />{selected.text}</div>
                            <div className="text-sm text-gray-400">
                                확인 상태: {selected.is_checked ? '확인됨' : '미확인'}
                            </div>

                            <button
                                onClick={() => deleteInquiry(selected.token)}
                                className="w-full py-2 mt-4 bg-red-600 hover:bg-red-700 text-white rounded"
                            >
                                문의 삭제
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}
