import React, { useState } from 'react';

interface FooterForm {
    address: string;
    companyName: string;
    ceoName: string;
    businessNumber: string;
    phone: string;
    fax: string;
    email: string;
}

interface AdminFooterProps {
    initialData?: Partial<FooterForm>;
    onSubmit?: (data: FooterForm) => void;
}

export default function AdminFooter({ initialData = {}, onSubmit }: AdminFooterProps) {
    const [form, setForm] = useState<FooterForm>({
        address: initialData.address ?? '',
        companyName: initialData.companyName ?? '',
        ceoName: initialData.ceoName ?? '',
        businessNumber: initialData.businessNumber ?? '',
        phone: initialData.phone ?? '',
        fax: initialData.fax ?? '',
        email: initialData.email ?? '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(form);
        } else {
            console.log('Submitted footer data:', form);
        }
    };

    return (
        <div className="bg-white min-h-screen py-10 text-black">
            <div className="max-w-3xl mx-auto p-6 bg-gray-100 shadow rounded">
                <h2 className="text-xl font-semibold mb-4 text-black">Footer 정보 수정</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="address" className="block font-medium text-black">주소</label>
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
                        <label htmlFor="companyName" className="block font-medium text-black">회사명</label>
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
                        <label htmlFor="ceoName" className="block font-medium text-black">대표자 성함</label>
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
                        <label htmlFor="businessNumber" className="block font-medium text-black">사업자등록번호</label>
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
                        <label htmlFor="phone" className="block font-medium text-black">전화번호</label>
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
                        <label htmlFor="fax" className="block font-medium text-black">팩스번호</label>
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
                        <label htmlFor="email" className="block font-medium text-black">이메일</label>
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
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        저장
                    </button>
                </form>
            </div>
        </div>
    );
}
