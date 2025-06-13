// resources/js/pages/adminComponents/AdminFooter.tsx

import React, { useState } from 'react';
import api from '../../api';
import axios from 'axios';

interface FooterForm {
    address: string;
    companyName: string;
    ceoName: string;
    businessNumber: string;
    phone: string;
    fax: string;
    email: string;
}

export default function AdminFooter() {
    const [form, setForm] = useState<FooterForm>({
        address: '',
        companyName: '',
        ceoName: '',
        businessNumber: '',
        phone: '',
        fax: '',
        email: '',
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
            // CSRF 쿠키가 이미 전역에서 세팅되어 있다면 이 호출은 생략 가능
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });

            const res = await api.put('/admin-footer', form);
            if (res.data.status) {
                alert('저장 완료!');
            } else {
                alert('오류: ' + (res.data.return || res.data.message));
            }
        } catch (err: unknown) {
            console.error('Footer PUT 에러:', err);

            if (axios.isAxiosError(err)) {
                // AxiosError 타입은 직접 import 하지 않아도 됩니다
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
                    Footer 정보 수정
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block font-medium text-black">
                            주소
                        </label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="companyName" className="block font-medium text-black">
                            회사명
                        </label>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={form.companyName}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="ceoName" className="block font-medium text-black">
                            대표자 성함
                        </label>
                        <input
                            id="ceoName"
                            name="ceoName"
                            type="text"
                            value={form.ceoName}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="businessNumber" className="block font-medium text-black">
                            사업자등록번호
                        </label>
                        <input
                            id="businessNumber"
                            name="businessNumber"
                            type="text"
                            value={form.businessNumber}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block font-medium text-black">
                            전화번호
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="fax" className="block font-medium text-black">
                            팩스번호
                        </label>
                        <input
                            id="fax"
                            name="fax"
                            type="text"
                            value={form.fax}
                            onChange={handleChange}
                            className="w-full border rounded p-2 text-black"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium text-black">
                            이메일
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
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
