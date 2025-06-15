import React, { useState } from 'react';
import api from '../../api';
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
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

            const res = await api.put('/admin-hero', form);
            if (res.data.status) {
                alert('저장 완료!');
            } else {
                alert('오류: ' + (res.data.return || res.data.message));
            }
        } catch (err: unknown) {
            console.error('Hero PUT 에러:', err);

            if (axios.isAxiosError(err)) {
                const msg = err.response?.data?.message ?? err.message;
                alert(msg);
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
                <h2 className="text-xl font-semibold mb-4 text-black">
                    Hero 정보 수정
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block font-medium text-black">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="subTitle" className="block font-medium text-black">
                            SubTitle
                        </label>
                        <input
                            id="subTitle"
                            name="subTitle"
                            type="text"
                            value={form.subTitle}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
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
