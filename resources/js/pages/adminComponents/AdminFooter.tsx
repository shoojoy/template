// resources/js/Pages/adminComponents/AdminFooter.tsx
import React, { useState, useEffect } from 'react';
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
    const [error, setError] = useState<string | null>(null);

    // 마운트 시점: 기존 Footer 데이터 불러와서 form 상태에 세팅
    useEffect(() => {
        axios
            .get<{ status: boolean; footer: Record<string, any> }>('/footer', { withCredentials: true })
            .then(res => {
                if (!res.data.status || !res.data.footer) return;
                const d = res.data.footer;
                setForm({
                    address: d.address || '',
                    companyName: d.company_name || '',
                    ceoName: d.ceo_name || '',
                    businessNumber: d.business_number || '',
                    phone: d.phone || '',
                    fax: d.fax || '',
                    email: d.email || '',
                });
            })
            .catch(err => {
                console.error('Footer GET 에러:', err);
                setError('데이터 로드 중 오류가 발생했습니다.');
            });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
            const res = await axios.put<{ status: boolean; message?: string }>('/footer/update', form, {
                withCredentials: true,
            });
            if (res.data.status) {
                alert('저장 완료!');
            } else {
                setError(res.data.message || '저장에 실패했습니다.');
            }
        } catch (err: unknown) {
            console.error('Footer PUT 에러:', err);
            if (axios.isAxiosError(err)) setError(err.response?.data?.message ?? err.message);
            else if (err instanceof Error) setError(err.message);
            else setError(String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow rounded">
                <h2 className="text-xl font-semibold mb-4">Footer 정보 수정</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 주소 */}
                    <div>
                        <label htmlFor="address" className="block font-medium">주소</label>
                        <input
                            id="address"
                            name="address"
                            type="text"
                            value={form.address}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* 회사명 */}
                    <div>
                        <label htmlFor="companyName" className="block font-medium">회사명</label>
                        <input
                            id="companyName"
                            name="companyName"
                            type="text"
                            value={form.companyName}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* 대표자 성함 */}
                    <div>
                        <label htmlFor="ceoName" className="block font-medium">대표자 성함</label>
                        <input
                            id="ceoName"
                            name="ceoName"
                            type="text"
                            value={form.ceoName}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* 사업자등록번호 */}
                    <div>
                        <label htmlFor="businessNumber" className="block font-medium">사업자등록번호</label>
                        <input
                            id="businessNumber"
                            name="businessNumber"
                            type="text"
                            value={form.businessNumber}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* 전화번호 */}
                    <div>
                        <label htmlFor="phone" className="block font-medium">전화번호</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* 팩스번호 */}
                    <div>
                        <label htmlFor="fax" className="block font-medium">팩스번호</label>
                        <input
                            id="fax"
                            name="fax"
                            type="text"
                            value={form.fax}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>
                    {/* 이메일 */}
                    <div>
                        <label htmlFor="email" className="block font-medium">이메일</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                        />
                    </div>

                    {error && <p className="text-red-500">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600'}`}
                    >
                        {loading ? '저장 중...' : '저장'}
                    </button>
                </form>
            </div>
        </div>
    );
}
