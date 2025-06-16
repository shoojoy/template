import React, { useState } from 'react';
import axios from 'axios';

interface HeroForm {
    title: string;
    subTitle: string;
}

export default function AdminHero() {
    const [form, setForm] = useState<HeroForm>({
        title: '',
        subTitle: '',
    });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('subTitle', form.subTitle);
            if (file) {
                formData.append('imageFilename', file);
            }

            const res = await axios.post('/hero/store', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (res.data.status) {
                alert('저장 완료!');
                setForm({ title: '', subTitle: '' });
                setFile(null);
            } else {
                alert('오류: ' + (res.data.return || res.data.message));
            }
        } catch (err: unknown) {
            console.error('Hero POST 에러:', err);
            if (axios.isAxiosError(err)) {
                alert(err.response?.data?.message ?? err.message);
            } else if (err instanceof Error) {
                alert(err.message);
            } else {
                alert(String(err));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow rounded">
                <h2 className="text-xl font-semibold mb-4">Hero 정보 등록</h2>
                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                    <div>
                        <label htmlFor="title" className="block font-medium">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="subTitle" className="block font-medium">
                            SubTitle
                        </label>
                        <input
                            id="subTitle"
                            name="subTitle"
                            type="text"
                            value={form.subTitle}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    <div>
                        <label htmlFor="imageFilename" className="block font-medium">
                            Image
                        </label>
                        <input
                            id="imageFilename"
                            name="imageFilename"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600'
                            }`}
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                </form>
            </div>
        </div>
    );
}
