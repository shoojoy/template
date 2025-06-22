// resources/js/pages/adminComponents/AdminBusiness.tsx
import React, { useState, useEffect, FormEvent } from 'react'
import axios from 'axios'
import { Inertia } from '@inertiajs/inertia'
import { usePage } from '@inertiajs/react'

// --- DTO & Step Interfaces
interface BusinessDto { image_filename: string; token: string }
interface ImageStep { token: string; file: File | null; imageUrl: string }
interface LoadingState { saving: boolean; updating: boolean; deleting: boolean }

// --- useBusinessCrud Hook
function useBusinessCrud() {
    const [images, setImages] = useState<ImageStep[]>([])
    const [loading, setLoading] = useState<Record<string, LoadingState>>({})

    useEffect(() => {
        axios.get<{ status: boolean; medias: BusinessDto[] }>('/business-image', { withCredentials: true })
            .then(res => {
                if (!res.data.status) return
                const init = res.data.medias.map(m => ({
                    token: m.token,
                    file: null,
                    imageUrl: m.image_filename
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
        setImages(prev => prev.map(it =>
            it.token === token ? { ...it, file } : it
        ))
    }

    const save = async (temp: string) => {
        setLoading(l => ({ ...l, [temp]: { ...l[temp], saving: true } }))
        const item = images.find(it => it.token === temp)!
        const fd = new FormData()
        if (item.file) fd.append('imageFilename', item.file)

        try {
            const res = await axios.post<{ status: boolean; media?: BusinessDto; message?: string }>(
                '/business-image/store',
                fd,
                { withCredentials: true }
            )
            if (!res.data.status) {
                alert(res.data.message || '저장 실패')
                return
            }
            if (res.data.media) {
                const m = res.data.media
                setImages(prev => prev.map(it =>
                    it.token === temp
                        ? { token: m.token, file: null, imageUrl: m.image_filename }
                        : it
                ))
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
            const res = await axios.post<{ status: boolean; media?: BusinessDto; message?: string }>(
                '/business-image/update',
                fd,
                { withCredentials: true }
            )
            if (!res.data.status) {
                alert(res.data.message || '수정 실패')
                return
            }
            if (res.data.media) {
                const m = res.data.media
                setImages(prev => prev.map(it =>
                    it.token === token
                        ? { token: m.token, file: null, imageUrl: m.image_filename }
                        : it
                ))
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
            const res = await axios.delete<{ status: boolean; message?: string }>(
                `/business-image/${token}`,
                { withCredentials: true }
            )
            if (!res.data.status) {
                alert(res.data.message || '삭제 실패')
            } else {
                setImages(prev => prev.filter(it => it.token !== token))
                alert('삭제 완료!')
            }
        } catch {
            alert('삭제 중 오류 발생')
        } finally {
            setLoading(l => ({ ...l, [token]: { ...l[token], deleting: false } }))
        }
    }

    return { images, loading, addNew, updateField, save, update, remove }
}

// --- Business Images Section
const BusinessSection: React.FC<ReturnType<typeof useBusinessCrud>> = ({
    images, loading, addNew, updateField, save, update, remove
}) => (
    <div>
        <h2 className="text-2xl font-semibold mb-4">Business Images 관리</h2>

        {/* 이미지가 1장 미만일 때만 버튼 보이기 */}
        {images.length < 1 && (
            <button
                onClick={addNew}
                className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded"
            >
                새 이미지 추가
            </button>
        )}

        {images.map(item => {
            const state = loading[item.token]
            const isNew = item.token.startsWith('temp-')

            return (
                <div key={item.token} className="bg-white p-4 rounded shadow mb-4 space-y-4">
                    {/* 파일 선택 버튼 꾸미기 */}
                    <label className="block w-full text-center py-3 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition">
                        {item.file
                            ? item.file.name
                            : item.imageUrl
                                ? '새 파일 선택'
                                : '이미지 선택'}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => updateField(item.token, e.target.files?.[0] ?? null)}
                            className="hidden"
                        />
                    </label>

                    {/* 미리보기 영역 */}
                    <div className="h-40 border border-dashed border-gray-300 rounded overflow-hidden">
                        {item.file
                            ? <img src={URL.createObjectURL(item.file)} alt="preview" className="h-full w-full object-contain" />
                            : item.imageUrl && <img src={item.imageUrl} alt="stored" className="h-full w-full object-contain" />
                        }
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex space-x-2">
                        {isNew ? (
                            <button
                                onClick={() => save(item.token)}
                                disabled={state?.saving}
                                className="flex-1 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded disabled:opacity-50"
                            >
                                {state?.saving ? '저장 중...' : '저장'}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => update(item.token)}
                                    disabled={state?.updating}
                                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 transition text-white rounded disabled:opacity-50"
                                >
                                    {state?.updating ? '수정 중...' : '수정'}
                                </button>
                                <button
                                    onClick={() => remove(item.token)}
                                    disabled={state?.deleting}
                                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 transition text-white rounded disabled:opacity-50"
                                >
                                    {state?.deleting ? '삭제 중...' : '삭제'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )
        })}
    </div>
)

// --- Main Component with Config Form
export default function AdminBusiness() {
    const businessCrud = useBusinessCrud()

    // Inertia로부터 configs 불러오기
    const { props } = usePage<{ configs: { config: string; value: string }[] }>()
    const configs = props.configs

    // business_title, business_subtitle 상태
    const initialTitle = configs.find(c => c.config === 'business_title')?.value || ''
    const initialSub = configs.find(c => c.config === 'business_subtitle')?.value || ''
    const [title, setTitle] = useState(initialTitle)
    const [subtitle, setSubtitle] = useState(initialSub)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // 폼 제출 핸들러 (422 해결: 각각 별도 요청)
    const onSubmitConfig = async (e: FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !subtitle.trim()) {
            setError('제목과 부제목을 모두 입력해주세요.')
            return
        }
        setSaving(true)
        try {
            const res1 = await axios.post(
                '/admin/config',
                { config: 'business_title', value: title },
                { withCredentials: true }
            )
            if (!res1.data.status) throw new Error(res1.data.message || '타이틀 저장 실패')

            const res2 = await axios.post(
                '/admin/config',
                { config: 'business_subtitle', value: subtitle },
                { withCredentials: true }
            )
            if (!res2.data.status) throw new Error(res2.data.message || '부제목 저장 실패')

            Inertia.reload({ preserveState: true })
        } catch (err: any) {
            setError(err.message || '저장 중 오류가 발생했습니다.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded shadow space-y-10">

                {/* Business 섹션 타이틀 & 부제목 설정 폼 */}
                <form onSubmit={onSubmitConfig} className="bg-white p-4 rounded shadow space-y-4">
                    <h2 className="text-xl font-semibold">Business 섹션 설정</h2>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="섹션 타이틀 입력"
                        />
                        <input
                            type="text"
                            value={subtitle}
                            onChange={e => setSubtitle(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            placeholder="섹션 부제목 입력"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition text-white rounded disabled:opacity-50"
                    >
                        {saving ? '저장 중...' : '저장'}
                    </button>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>

                {/* Business Images 관리 섹션 */}
                <BusinessSection {...businessCrud} />

            </div>
        </div>
    )
}
