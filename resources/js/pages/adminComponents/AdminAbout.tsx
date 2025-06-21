import React, { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/react'

// --- DTO & Step Interfaces
interface CounterDto { title: string; value: number; token: string }
interface ImageDto { image_filename: string; token: string }

interface CounterStep { token: string; title: string; value: number | '' }
interface ImageStep { token: string; file: File | null; imageUrl: string }

interface LoadingState { saving: boolean; updating: boolean; deleting: boolean }

// --- useCounterCrud Hook
function useCounterCrud() {
    const [counters, setCounters] = useState<CounterStep[]>([])
    const [loading, setLoading] = useState<Record<string, LoadingState>>({})

    useEffect(() => {
        axios.get<{ status: boolean; medias: CounterDto[] }>('/about-counter', { withCredentials: true })
            .then(res => {
                if (!res.data.status) return
                const init = res.data.medias.map(m => ({
                    token: m.token,
                    title: m.title,
                    value: m.value
                }))
                setCounters(init)
                const initLoad: Record<string, LoadingState> = {}
                init.forEach(i => {
                    initLoad[i.token] = { saving: false, updating: false, deleting: false }
                })
                setLoading(initLoad)
            })
            .catch(console.error)
    }, [])

    const addNew = () => {
        const temp = `temp-${Date.now()}`
        setCounters(prev => [{ token: temp, title: '', value: '' }, ...prev])
        setLoading(l => ({ ...l, [temp]: { saving: false, updating: false, deleting: false } }))
    }

    const updateField = (token: string, upd: Partial<Pick<CounterStep, 'title' | 'value'>>) => {
        setCounters(prev => prev.map(it => it.token === token ? { ...it, ...upd } : it))
    }

    const save = async (temp: string) => {
        setLoading(l => ({ ...l, [temp]: { ...l[temp], saving: true } }))
        const item = counters.find(it => it.token === temp)!
        try {
            const res = await axios.post<{ status: boolean; counter?: CounterDto; message?: string }>(
                '/about-counter/store',
                { title: item.title, value: item.value },
                { withCredentials: true }
            )
            if (!res.data.status) { alert(res.data.message || '저장 실패'); return }
            if (res.data.counter) {
                const c = res.data.counter
                setCounters(prev => prev.map(it => it.token === temp ? {
                    token: c.token, title: c.title, value: c.value
                } : it))
                setLoading(l => {
                    const { [temp]: old, ...rest } = l
                    return { ...rest, [c.token]: old }
                })
            }
            alert('저장 완료!')
        } catch {
            alert('저장 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [temp]: { ...l[temp], saving: false } }))
        }
    }

    const update = async (token: string) => {
        setLoading(l => ({ ...l, [token]: { ...l[token], updating: true } }))
        const item = counters.find(it => it.token === token)!
        try {
            const res = await axios.put<{ status: boolean; counter?: CounterDto; message?: string }>(
                '/about-counter/update',
                { token, title: item.title, value: item.value },
                { withCredentials: true }
            )
            if (!res.data.status) { alert(res.data.message || '수정 실패'); return }
            if (res.data.counter) {
                const c = res.data.counter
                setCounters(prev => prev.map(it => it.token === token ? {
                    token: c.token, title: c.title, value: c.value
                } : it))
            }
            alert('수정 완료!')
        } catch {
            alert('수정 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], updating: false } }))
        }
    }

    const remove = async (token: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        setLoading(l => ({ ...l, [token]: { ...l[token], deleting: true } }))
        try {
            await axios.delete(`/about-counter/${token}`, { withCredentials: true })
            setCounters(prev => prev.filter(it => it.token !== token))
            alert('삭제 완료!')
        } catch {
            alert('삭제 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], deleting: false } }))
        }
    }

    return { counters, loading, addNew, updateField, save, update, remove }
}

// --- useImageCrud Hook
function useImageCrud() {
    const [images, setImages] = useState<ImageStep[]>([])
    const [loading, setLoading] = useState<Record<string, LoadingState>>({})

    useEffect(() => {
        axios.get<{ status: boolean; medias: ImageDto[] }>('/about-image', { withCredentials: true })
            .then(res => {
                if (!res.data.status) return
                const init = res.data.medias.map(m => ({
                    token: m.token, file: null, imageUrl: m.image_filename
                }))
                setImages(init)
                const initLoad: Record<string, LoadingState> = {}
                init.forEach(i => {
                    initLoad[i.token] = { saving: false, updating: false, deleting: false }
                })
                setLoading(initLoad)
            })
            .catch(console.error)
    }, [])

    const addNew = () => {
        const temp = `temp-${Date.now()}`
        setImages(prev => [{ token: temp, file: null, imageUrl: '' }, ...prev])
        setLoading(l => ({ ...l, [temp]: { saving: false, updating: false, deleting: false } }))
    }

    const updateField = (token: string, file: File | null) => {
        setImages(prev => prev.map(it => it.token === token ? { ...it, file } : it))
    }

    const save = async (temp: string) => {
        setLoading(l => ({ ...l, [temp]: { ...l[temp], saving: true } }))
        const item = images.find(it => it.token === temp)!
        const fd = new FormData()
        if (item.file) fd.append('imageFilename', item.file)
        try {
            const res = await axios.post<{ status: boolean; media?: ImageDto; message?: string }>(
                '/about-image/store', fd, { withCredentials: true }
            )
            if (!res.data.status) { alert(res.data.message || '저장 실패'); return }
            if (res.data.media) {
                const m = res.data.media
                setImages(prev => prev.map(it => it.token === temp ? {
                    token: m.token, file: null, imageUrl: m.image_filename
                } : it))
                setLoading(l => {
                    const { [temp]: old, ...rest } = l
                    return { ...rest, [m.token]: old }
                })
            }
            alert('저장 완료!')
        } catch {
            alert('저장 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [temp]: { ...l[temp], saving: false } }))
        }
    }

    const update = async (token: string) => {
        setLoading(l => ({ ...l, [token]: { ...l[token], updating: true } }))
        const item = images.find(it => it.token === token)!
        const fd = new FormData()
        fd.append('_method', 'PUT')
        fd.append('token', token)
        if (item.file) fd.append('imageFilename', item.file)
        try {
            const res = await axios.post<{ status: boolean; media?: ImageDto; message?: string }>(
                '/about-image/update', fd, { withCredentials: true }
            )
            if (!res.data.status) { alert(res.data.message || '수정 실패'); return }
            if (res.data.media) {
                const m = res.data.media
                setImages(prev => prev.map(it => it.token === token ? {
                    token: m.token, file: null, imageUrl: m.image_filename
                } : it))
            }
            alert('수정 완료!')
        } catch {
            alert('수정 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], updating: false } }))
        }
    }

    const remove = async (token: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return
        setLoading(l => ({ ...l, [token]: { ...l[token], deleting: true } }))
        try {
            await axios.delete(`/about-image/${token}`, { withCredentials: true })
            setImages(prev => prev.filter(it => it.token !== token))
            alert('삭제 완료!')
        } catch {
            alert('삭제 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], deleting: false } }))
        }
    }

    return { images, loading, addNew, updateField, save, update, remove }
}

// --- Section Components
const CounterSection: React.FC<ReturnType<typeof useCounterCrud>> = ({
    counters, loading, addNew, updateField, save, update, remove
}) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">About Counters 관리</h2>
        <button onClick={addNew} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">
            새 카운터 추가
        </button>
        {counters.map(item => {
            const state = loading[item.token]
            const isNew = item.token.startsWith('temp-')
            return (
                <div key={item.token} className="bg-white p-4 rounded shadow mb-4 space-y-4">
                    <input
                        type="text"
                        placeholder="제목"
                        value={item.title}
                        onChange={e => updateField(item.token, { title: e.target.value })}
                        className="w-full border rounded p-2"
                    />
                    <input
                        type="number"
                        placeholder="값"
                        value={item.value}
                        onChange={e => updateField(item.token, { value: e.target.value === '' ? '' : Number(e.target.value) })}
                        className="w-full border rounded p-2"
                    />
                    <div className="flex space-x-2">
                        {isNew
                            ? <button onClick={() => save(item.token)} disabled={state?.saving}
                                className="flex-1 py-2 bg-green-600 text-white rounded disabled:opacity-50">
                                {state?.saving ? '저장 중...' : '저장'}
                            </button>
                            : <>
                                <button onClick={() => update(item.token)} disabled={state?.updating}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                                    {state?.updating ? '수정 중...' : '수정'}
                                </button>
                                <button onClick={() => remove(item.token)} disabled={state?.deleting}
                                    className="flex-1 py-2 bg-red-600 text-white rounded disabled:opacity-50">
                                    {state?.deleting ? '삭제 중...' : '삭제'}
                                </button>
                            </>
                        }
                    </div>
                </div>
            )
        })}
    </div>
)

const ImageSection: React.FC<ReturnType<typeof useImageCrud>> = ({
    images, loading, addNew, updateField, save, update, remove
}) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">About Images 관리</h2>
        <button onClick={addNew} className="mb-4 px-4 py-2 bg-green-600 text-white rounded">
            새 이미지 추가
        </button>
        {images.map(item => {
            const state = loading[item.token]
            const isNew = item.token.startsWith('temp-')
            return (
                <div key={item.token} className="bg-white p-4 rounded shadow mb-4 space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => updateField(item.token, e.target.files?.[0] ?? null)}
                        className="w-full"
                    />
                    <div className="h-40">
                        {item.file
                            ? <img src={URL.createObjectURL(item.file)} alt="preview" className="h-full object-contain" />
                            : item.imageUrl && <img src={item.imageUrl} alt="stored" className="h-full object-contain" />
                        }
                    </div>
                    <div className="flex space-x-2">
                        {isNew
                            ? <button onClick={() => save(item.token)} disabled={state?.saving}
                                className="flex-1 py-2 bg-green-600 text-white rounded disabled:opacity-50">
                                {state?.saving ? '저장 중...' : '저장'}
                            </button>
                            : <>
                                <button onClick={() => update(item.token)} disabled={state?.updating}
                                    className="flex-1 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                                    {state?.updating ? '수정 중...' : '수정'}
                                </button>
                                <button onClick={() => remove(item.token)} disabled={state?.deleting}
                                    className="flex-1 py-2 bg-red-600 text-white rounded disabled:opacity-50">
                                    {state?.deleting ? '삭제 중...' : '삭제'}
                                </button>
                            </>
                        }
                    </div>
                </div>
            )
        })}
    </div>
)

// --- Main Component
export default function AdminAbout() {
    const countersCrud = useCounterCrud()
    const imagesCrud = useImageCrud()

    // Inertia configs
    const { props } = usePage()
    const configs = props.configs as { config: string, value: string }[]

    // about_title form
    const initial = configs.find(c => c.config === 'about_title')?.value || ''
    const [aboutTitle, setAboutTitle] = useState(initial)
    const [savingT, setSavingT] = useState(false)
    const [titleErr, setTitleErr] = useState<string | null>(null)

    const onSubmitTitle = (e: FormEvent) => {
        e.preventDefault()
        if (!aboutTitle.trim()) {
            setTitleErr('제목을 입력해주세요.'); return
        }
        setSavingT(true)
        axios.post('/admin/config', { config: 'about_title', value: aboutTitle })
            .then(res => {
                if (!res.data.status) setTitleErr(res.data.message)
                else Inertia.reload({ preserveState: true })
            })
            .catch(() => setTitleErr('저장 중 오류'))
            .finally(() => setSavingT(false))
    }

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow space-y-10">
                {/* about_title 설정 폼 */}
                <form onSubmit={onSubmitTitle} className="bg-white p-4 rounded shadow space-y-2">
                    <h2 className="text-xl font-semibold">About 섹션 타이틀</h2>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={aboutTitle}
                            onChange={e => setAboutTitle(e.target.value)}
                            className="flex-1 border rounded px-3 py-2"
                            placeholder="섹션 타이틀 입력"
                        />
                        <button
                            type="submit"
                            disabled={savingT}
                            className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
                        >
                            {savingT ? '저장 중...' : '저장'}
                        </button>
                    </div>
                    {titleErr && <p className="text-red-500 text-sm">{titleErr}</p>}
                </form>

                {/* Counters & Images 관리 */}
                <CounterSection {...countersCrud} />
                <ImageSection   {...imagesCrud} />
            </div>
        </div>
    )
}
