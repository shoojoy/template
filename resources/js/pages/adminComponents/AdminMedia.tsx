import React, { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/react'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface MediaDto {
    title: string
    image: string
    token: string
}
interface SaveResponse {
    status: boolean
    media?: MediaDto
    message?: string
}
interface ApiMediaResponse {
    status: boolean
    media?: MediaDto[]
    medias?: MediaDto[]
}

interface MediaStep {
    token: string
    title: string
    file: File | null
    imageUrl: string
}

export default function AdminMedia() {
    const { props } = usePage()
    const configs = props.configs as { config: string; value: string }[]

    // --- media_title 설정 폼 상태
    const initialTitle = configs.find(c => c.config === 'media_title')?.value || ''
    const [mediaTitle, setMediaTitle] = useState(initialTitle)
    const [savingTitle, setSavingTitle] = useState(false)
    const [titleError, setTitleError] = useState<string | null>(null)

    // 1) media_title 수정
    const updateTitle = (e: FormEvent) => {
        e.preventDefault()
        if (!mediaTitle.trim()) {
            setTitleError('제목을 입력해주세요.')
            return
        }
        setSavingTitle(true)
        axios
            .post('/admin/config', { config: 'media_title', value: mediaTitle })
            .then(res => {
                if (!res.data.status) {
                    setTitleError(res.data.message)
                } else {
                    setTitleError(null)
                    Inertia.reload({ preserveState: true })
                }
            })
            .catch(() => {
                setTitleError('저장 중 오류가 발생했습니다.')
            })
            .finally(() => setSavingTitle(false))
    }

    // --- media CRUD 상태
    const [items, setItems] = useState<MediaStep[]>([])
    const [loading, setLoading] = useState<Record<string, { saving: boolean; updating: boolean; deleting: boolean }>>({})

    // 2) 초기 데이터 로드
    useEffect(() => {
        axios
            .get<ApiMediaResponse>('/media', { withCredentials: true })
            .then(res => {
                if (!res.data.status) return
                const list = res.data.media ?? res.data.medias ?? []
                const init = list.map(m => ({
                    token: m.token,
                    title: m.title,
                    file: null,
                    imageUrl: m.image,
                }))
                setItems(init)
                const initLoad: typeof loading = {}
                init.forEach(i => {
                    initLoad[i.token] = { saving: false, updating: false, deleting: false }
                })
                setLoading(initLoad)
            })
            .catch(console.error)
    }, [])

    const updateItem = (token: string, upd: Partial<Pick<MediaStep, 'title' | 'file'>>) => {
        setItems(prev => prev.map(it => (it.token === token ? { ...it, ...upd } : it)))
    }

    const handleSave = async (token: string) => {
        setLoading(l => ({ ...l, [token]: { ...l[token], saving: true } }))
        const item = items.find(it => it.token === token)!
        const fd = new FormData()
        fd.append('title', item.title)
        if (item.file) fd.append('imageFilename', item.file)
        try {
            const res = await axios.post<SaveResponse>('/media/store', fd, { withCredentials: true })
            if (!res.data.status) {
                alert(res.data.message ?? '저장 실패')
                return
            }
            if (res.data.media) {
                const m = res.data.media
                setItems(prev =>
                    prev.map(it =>
                        it.token === token
                            ? { token: m.token, title: m.title, file: null, imageUrl: m.image }
                            : it
                    )
                )
            }
            alert('저장 완료!')
        } catch {
            alert('저장 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], saving: false } }))
        }
    }

    const handleUpdate = async (token: string) => {
        setLoading(l => ({ ...l, [token]: { ...l[token], updating: true } }))
        const item = items.find(it => it.token === token)!
        const fd = new FormData()
        fd.append('_method', 'PUT')
        fd.append('token', token)
        fd.append('title', item.title)
        if (item.file) fd.append('imageFilename', item.file)
        try {
            const res = await axios.post<SaveResponse>('/media/update', fd, { withCredentials: true })
            if (!res.data.status) {
                alert(res.data.message ?? '수정 실패')
                return
            }
            if (res.data.media) {
                const m = res.data.media
                setItems(prev =>
                    prev.map(it =>
                        it.token === token
                            ? { token: m.token, title: m.title, file: null, imageUrl: m.image }
                            : it
                    )
                )
            }
            alert('수정 완료!')
        } catch {
            alert('수정 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], updating: false } }))
        }
    }

    const handleDelete = async (token: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        setLoading(l => ({ ...l, [token]: { ...l[token], deleting: true } }))
        try {
            await axios.delete(`/media/${token}`, { withCredentials: true })
            setItems(prev => prev.filter(it => it.token !== token))
            alert('삭제 완료!')
        } catch {
            alert('삭제 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], deleting: false } }))
        }
    }

    const addNew = () => {
        const tempToken = `temp-${Date.now()}`
        setItems(prev => [{ token: tempToken, title: '', file: null, imageUrl: '' }, ...prev])
        setLoading(l => ({ ...l, [tempToken]: { saving: false, updating: false, deleting: false } }))
    }

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow space-y-8 text-black">
                {/* 1. media_title 수정 폼 */}
                <form onSubmit={updateTitle} className="bg-white p-4 rounded shadow space-y-2 text-black">
                    <h2 className="text-xl font-semibold text-black">미디어 섹션 타이틀</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={mediaTitle}
                            onChange={e => setMediaTitle(e.target.value)}
                            className="flex-1 border rounded px-3 py-2 w-full text-black"
                            placeholder="타이틀을 입력하세요"
                        />
                        <button
                            type="submit"
                            disabled={savingTitle}
                            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-black rounded disabled:opacity-50"
                        >
                            {savingTitle ? '저장 중...' : '저장'}
                        </button>
                    </div>
                    {titleError && <p className="text-red-500 text-sm">{titleError}</p>}
                </form>

                {/* 2. Media CRUD */}
                <div className="text-black">
                    <h2 className="text-2xl font-semibold mb-4 text-black">Media 정보 관리</h2>
                    <button
                        onClick={addNew}
                        className="mb-4 px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700"
                    >
                        새 미디어 추가
                    </button>

                    {items.map(item => {
                        const state = loading[item.token] || { saving: false, updating: false, deleting: false }
                        const isNew = item.token.startsWith('temp-')
                        return (
                            <div key={item.token} className="bg-white p-4 rounded shadow mb-4 space-y-4 text-black">
                                <div>
                                    <label className="block font-medium text-black">제목</label>
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={e => updateItem(item.token, { title: e.target.value })}
                                        className="w-full border rounded p-2 text-black"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium text-black">이미지</label>
                                    <div className="flex items-center space-x-4 mt-2">
                                        <label
                                            htmlFor={`file-${item.token}`}
                                            className="bg-blue-600 text-black px-4 py-2 rounded cursor-pointer"
                                        >
                                            파일 선택
                                        </label>
                                        <input
                                            id={`file-${item.token}`}
                                            type="file"
                                            accept="image/*"
                                            onChange={e =>
                                                updateItem(item.token, { file: e.target.files?.[0] ?? null })
                                            }
                                            className="hidden"
                                        />
                                        {item.file && <span className="text-sm text-black">{item.file.name}</span>}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    {isNew ? (
                                        <button
                                            onClick={() => handleSave(item.token)}
                                            disabled={state.saving}
                                            className="flex-1 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                                        >
                                            {state.saving ? '저장 중...' : '저장'}
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleUpdate(item.token)}
                                                disabled={state.updating}
                                                className="flex-1 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                                            >
                                                {state.updating ? '수정 중...' : '수정'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.token)}
                                                disabled={state.deleting}
                                                className="flex-1 py-2 bg-red-600 text-white rounded disabled:opacity-50"
                                            >
                                                {state.deleting ? '삭제 중...' : '삭제'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
