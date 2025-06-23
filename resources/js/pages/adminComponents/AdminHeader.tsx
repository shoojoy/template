import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface HeaderData {
    image: string;  // backend에서 alias 한 'image' 필드 사용
    token: string;
}

export default function AdminHeader() {
    const [header, setHeader] = useState<HeaderData | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 초기 데이터 로드 (GET /header)
    useEffect(() => {
        (async () => {
            try {
                const res = await axios.get<{ status: boolean; medias: HeaderData[] }>(
                    '/header',
                    { withCredentials: true }
                );
                if (!res.data.status || res.data.medias.length === 0) {
                    setError('헤더 정보를 불러오지 못했습니다.');
                    return;
                }
                const hd = res.data.medias[0];
                setHeader(hd);
                // 기존에 저장된 파일명이 넘어올 경우 storage 경로를 붙여 줍니다
                setPreview(
                    hd.image.startsWith('http')
                        ? hd.image
                        : `/storage/${hd.image}`
                );
            } catch (err) {
                console.error('Header fetch error', err);
                setError('헤더 정보를 불러오지 못했습니다.');
            }
        })();
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] || null;
        setFile(selected);
        if (selected) {
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!file || !header) {
            setError('새 이미지를 선택해 주세요.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // CSRF 쿠키 획득
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('LogoimageFilename', file);
            formData.append('token', header.token);

            const res = await axios.post<{ status: boolean; media?: HeaderData; message?: string }>(
                '/header/update',
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );

            if (!res.data.status) {
                setError(res.data.message || '알 수 없는 오류가 발생했습니다.');
                return;
            }

            if (res.data.media) {
                setHeader(res.data.media);
                setPreview(
                    res.data.media.image.startsWith('http')
                        ? res.data.media.image
                        : `/storage/${res.data.media.image}`
                );
            }

            alert('헤더 이미지가 성공적으로 변경되었습니다.');
        } catch (err: unknown) {
            console.error('Header update error:', err);
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="p-6 text-red-500">{error}</div>;
    }
    if (!header) {
        return <div className="p-6">로딩 중...</div>;
    }

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-2xl mx-auto p-6 bg-gray-100 shadow rounded">
                <h2 className="text-xl font-semibold mb-4 text-black">헤더 로고 이미지 수정</h2>

                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow space-y-4">
                    {/* 파일 선택 버튼 */}
                    <label className="block w-full text-center py-3 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer transition">
                        {file ? file.name : '새 로고 이미지 선택'}
                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/gif,svg+xml"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>

                    {/* 기존 이미지 / 새로 선택한 파일 미리보기 */}
                    {preview && (
                        <div className="mt-2 h-40 flex justify-center items-center border border-dashed border-gray-300 rounded overflow-hidden">
                            <img src={preview} alt="Header Preview" className="max-h-full object-contain" />
                        </div>
                    )}

                    {/* 저장 버튼 */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white transition disabled:opacity-50
                            ${loading
                                ? 'bg-gray-400'
                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300'}`}
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                </form>
            </div>
        </div>
    );
}
