import React, { useState, useEffect, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';

export default function MediaHero() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreview('');
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setError('제목을 입력해주세요.');
            return;
        }
        if (!file) {
            setError('이미지 파일을 선택해주세요.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new FormData();
            formData.append('title', title.trim());
            formData.append('imageFilename', file);

            const response = await axios.post('/media/store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(response);

            setSuccess(true);
            setTitle('');
            setFile(null);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosErr = err as AxiosError<{ message?: string }>;
                console.error(axiosErr.response?.data || axiosErr.message);
            } else {
                console.error(err);
            }
            setError('저장 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto px-6 py-8">
            <div className="bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">미디어 등록</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-base font-medium mb-2">
                            제목
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:ring focus:ring-indigo-200"
                        />
                    </div>

                    <div>
                        <label htmlFor="file" className="block text-base font-medium mb-2">
                            이미지 파일
                        </label>
                        <input
                            id="file"
                            type="file"
                            accept="image/*"
                            onChange={e => setFile(e.target.files?.[0] ?? null)}
                            className="w-full text-base"
                        />
                    </div>

                    {preview && (
                        <div className="text-center">
                            <img
                                src={preview}
                                alt="preview"
                                className="inline-block max-h-48 rounded shadow-sm"
                            />
                        </div>
                    )}

                    {error && <p className="text-red-500 text-base text-center">{error}</p>}
                    {success && <p className="text-green-600 text-base text-center">등록 완료!</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 text-base bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                </form>
            </div>
        </div>
    );
}
