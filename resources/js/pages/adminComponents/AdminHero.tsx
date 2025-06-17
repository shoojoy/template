import React, { useState, useEffect } from 'react'
import axios from 'axios'

// API 응답 정의
interface HeroDto {
    index: number
    title: string
    subtitle: string
    image: string
    token: string
}
interface SaveResponse {
    status: boolean
    hero?: HeroDto
    message?: string
}

interface HeroStep {
    index: number
    title: string
    subTitle: string
    file: File | null
    imageUrl: string
    token?: string
}

const MAX_STEPS = 3

export default function AdminHero() {
    const [heroSteps, setHeroSteps] = useState<HeroStep[]>(
        Array.from({ length: MAX_STEPS }, (_, i) => ({
            index: i + 1,
            title: '',
            subTitle: '',
            file: null,
            imageUrl: '',
            token: undefined,
        }))
    )

    // saving, updating, deleting 플래그 관리
    const [loadingStates, setLoadingStates] = useState<
        { saving: boolean; updating: boolean; deleting: boolean }[]
    >(
        Array.from({ length: MAX_STEPS }, () => ({
            saving: false,
            updating: false,
            deleting: false,
        }))
    )

    // 초기 데이터 로드
    useEffect(() => {
        axios
            .get<{ status: boolean; heroes: HeroDto[] }>('/hero', { withCredentials: true })
            .then(res => {
                if (res.data.status) {
                    setHeroSteps(prev => {
                        const copy = [...prev]
                        res.data.heroes.forEach(h => {
                            if (h.index >= 1 && h.index <= MAX_STEPS) {
                                copy[h.index - 1] = {
                                    index: h.index,
                                    title: h.title,
                                    subTitle: h.subtitle,
                                    imageUrl: h.image,
                                    file: null,
                                    token: h.token,
                                }
                            }
                        })
                        return copy
                    })
                }
            })
            .catch(console.error)
    }, [])

    const updateStep = (
        idx: number,
        upd: Partial<Pick<HeroStep, 'title' | 'subTitle' | 'file'>>
    ) => {
        setHeroSteps(prev =>
            prev.map((step, i) => (i === idx ? { ...step, ...upd } : step))
        )
    }

    const handleSave = async (idx: number) => {
        setLoadingStates(prev =>
            prev.map((s, i) => (i === idx ? { ...s, saving: true } : s))
        )
        const { title, subTitle, file, index } = heroSteps[idx]
        const fd = new FormData()
        fd.append('title', title)
        fd.append('subTitle', subTitle)
        if (file) fd.append('imageFilename', file)

        try {
            const res = await axios.post<SaveResponse>('/hero/store', fd, { withCredentials: true })

            if (!res.data.status) {
                alert(res.data.message ?? '저장 실패')
                return
            }

            if (res.data.hero) {
                const h = res.data.hero
                setHeroSteps(prev =>
                    prev.map((step, i) =>
                        i === idx
                            ? {
                                ...step,
                                title: h.title,
                                subTitle: h.subtitle,
                                imageUrl: h.image,
                                token: h.token,
                                file: null,
                            }
                            : step
                    )
                )
            }

            alert(`페이지 ${index} 저장 완료!`)
        } catch (err: unknown) {
            console.error(err)
            alert('저장 중 오류 발생')
        } finally {
            setLoadingStates(prev =>
                prev.map((s, i) => (i === idx ? { ...s, saving: false } : s))
            )
        }
    }

    const handleUpdate = async (idx: number) => {
        setLoadingStates(prev =>
            prev.map((s, i) => (i === idx ? { ...s, updating: true } : s))
        )

        const { title, subTitle, file, token, index } = heroSteps[idx]
        if (!token) {
            alert('먼저 저장해주세요')
            setLoadingStates(prev =>
                prev.map((s, i) => (i === idx ? { ...s, updating: false } : s))
            )
            return
        }

        const fd = new FormData()
        fd.append('_method', 'PUT')
        fd.append('token', token)
        fd.append('title', title)
        fd.append('subTitle', subTitle)
        if (file) fd.append('imageFilename', file)

        try {
            const res = await axios.post<SaveResponse>('/hero/update', fd, { withCredentials: true })

            if (res.data.status) {
                if (res.data.hero) {
                    const h = res.data.hero
                    setHeroSteps(prev =>
                        prev.map((step, i) =>
                            i === idx
                                ? {
                                    ...step,
                                    title: h.title,
                                    subTitle: h.subtitle,
                                    imageUrl: h.image,
                                    token: h.token,
                                    file: null,
                                }
                                : step
                        )
                    )
                }
                alert(`페이지 ${index} 수정 완료!`)
            } else {
                alert(res.data.message ?? '수정 실패')
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.error('AxiosError:', err.response ?? err.message)
            } else {
                console.error('Unexpected error:', err)
            }
            alert('수정 중 오류 발생')
        } finally {
            setLoadingStates(prev =>
                prev.map((s, i) => (i === idx ? { ...s, updating: false } : s))
            )
        }
    }

    const handleDelete = async (idx: number) => {
        const { token, index } = heroSteps[idx]
        if (!token) {
            alert('삭제할 데이터가 없습니다.')
            return
        }
        if (!window.confirm(`페이지 ${index}을(를) 정말 삭제하시겠습니까?`)) {
            return
        }

        setLoadingStates(prev =>
            prev.map((s, i) => (i === idx ? { ...s, deleting: true } : s))
        )

        try {
            await axios.delete(`/hero/${token}`, { withCredentials: true })
            // 삭제 후 초기화
            setHeroSteps(prev =>
                prev.map((step, i) =>
                    i === idx
                        ? {
                            index: step.index,
                            title: '',
                            subTitle: '',
                            file: null,
                            imageUrl: '',
                            token: undefined,
                        }
                        : step
                )
            )
            alert(`페이지 ${index} 삭제 완료!`)
        } catch (err) {
            console.error(err)
            alert('삭제 중 오류 발생')
        } finally {
            setLoadingStates(prev =>
                prev.map((s, i) => (i === idx ? { ...s, deleting: false } : s))
            )
        }
    }

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow rounded space-y-8">
                <h2 className="text-2xl font-semibold">Hero 정보 관리</h2>

                {heroSteps.map((step, idx) => (
                    <div key={step.index} className="bg-white p-4 shadow rounded">
                        <h3 className="font-semibold mb-2">페이지 {step.index}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block font-medium">타이틀</label>
                                <input
                                    type="text"
                                    value={step.title}
                                    onChange={e => updateStep(idx, { title: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block font-medium">서브타이틀</label>
                                <input
                                    type="text"
                                    value={step.subTitle}
                                    onChange={e => updateStep(idx, { subTitle: e.target.value })}
                                    className="w-full border rounded p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block font-medium">이미지</label>
                                <div className="flex items-center space-x-4 mt-2">
                                    <label
                                        htmlFor={`file-${step.index}`}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700"
                                    >
                                        파일 선택
                                    </label>
                                    <input
                                        id={`file-${step.index}`}
                                        type="file"
                                        accept="image/*"
                                        onChange={e =>
                                            updateStep(idx, { file: e.target.files?.[0] ?? null })
                                        }
                                        className="hidden"
                                    />
                                    {step.file && (
                                        <span className="text-sm text-gray-600">{step.file.name}</span>
                                    )}
                                </div>
                                {/* 미리보기 */}
                                <div className="mt-4">
                                    {step.file ? (
                                        // 새로 선택한 파일 있으면 항상 보여주고
                                        <img
                                            src={URL.createObjectURL(step.file)}
                                            alt="new preview"
                                            className="max-w-full h-auto object-cover rounded"
                                        />
                                    ) : !step.token && step.imageUrl ? (
                                        // 토큰 없는(=아직 저장되지 않은) 기존 이미지일 때만 보여주기
                                        <img
                                            src={step.imageUrl}
                                            alt="existing preview"
                                            className="max-w-full h-auto object-cover rounded"
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                            {!step.token ? (
                                <button
                                    onClick={() => handleSave(idx)}
                                    disabled={
                                        loadingStates[idx].saving ||
                                        loadingStates[idx].updating ||
                                        loadingStates[idx].deleting
                                    }
                                    className={`w-full md:w-auto px-4 py-2 rounded text-white ${loadingStates[idx].saving ? 'bg-gray-400' : 'bg-green-600'
                                        }`}
                                >
                                    {loadingStates[idx].saving ? '저장 중...' : '저장'}
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleUpdate(idx)}
                                        disabled={
                                            loadingStates[idx].saving ||
                                            loadingStates[idx].updating ||
                                            loadingStates[idx].deleting
                                        }
                                        className={`w-full md:w-auto px-4 py-2 rounded text-white ${loadingStates[idx].updating ? 'bg-gray-400' : 'bg-blue-600'
                                            }`}
                                    >
                                        {loadingStates[idx].updating ? '수정 중...' : '수정'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(idx)}
                                        disabled={
                                            loadingStates[idx].saving ||
                                            loadingStates[idx].updating ||
                                            loadingStates[idx].deleting
                                        }
                                        className={`w-full md:w-auto px-4 py-2 rounded text-white ${loadingStates[idx].deleting ? 'bg-gray-400' : 'bg-red-600'
                                            }`}
                                    >
                                        {loadingStates[idx].deleting ? '삭제 중...' : '삭제'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
