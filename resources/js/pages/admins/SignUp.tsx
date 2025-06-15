import React from 'react';
import { useForm, router } from '@inertiajs/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp: React.FC = () => {
    const form = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        address: '',
        company_name: '',
        ceo_name: '',
        business_number: '',
        phone: '',
        fax: '',
        email: '',
        logo_image_filename: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admins/SignUp', {
            forceFormData: true,
            onSuccess: () => {
                toast.success('🎉 가입에 성공하였습니다!', {
                    position: 'top-center',
                    autoClose: 2000,
                });
                setTimeout(() => {
                    router.visit('/admins/SignIn');
                }, 2000);
            },
            onError: () => {
                toast.error('❌ 가입 중 오류가 발생했습니다.', {
                    position: 'top-center',
                    autoClose: 2000,
                });
            },
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-8 rounded shadow text-black"
                encType="multipart/form-data"
            >
                <h2 className="text-2xl font-bold mb-6 text-black">관리자 회원가입</h2>

                {/* Username */}
                <input
                    type="text"
                    name="username"
                    placeholder="아이디"
                    value={form.data.username}
                    onChange={e => form.setData('username', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.username && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.username}</div>
                )}

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.data.password}
                    onChange={e => form.setData('password', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.password && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.password}</div>
                )}

                {/* Confirm Password */}
                <input
                    type="password"
                    name="password_confirmation"
                    placeholder="비밀번호 확인"
                    value={form.data.password_confirmation}
                    onChange={e => form.setData('password_confirmation', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.password_confirmation && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.password_confirmation}</div>
                )}

                {/* Address */}
                <input
                    type="text"
                    name="address"
                    placeholder="회사 주소"
                    value={form.data.address}
                    onChange={e => form.setData('address', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.address && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.address}</div>
                )}

                {/* Company Name */}
                <input
                    type="text"
                    name="company_name"
                    placeholder="회사명"
                    value={form.data.company_name}
                    onChange={e => form.setData('company_name', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.company_name && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.company_name}</div>
                )}

                {/* CEO Name */}
                <input
                    type="text"
                    name="ceo_name"
                    placeholder="대표자 성함"
                    value={form.data.ceo_name}
                    onChange={e => form.setData('ceo_name', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.ceo_name && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.ceo_name}</div>
                )}

                {/* Business Number */}
                <input
                    type="text"
                    name="business_number"
                    placeholder="사업자등록번호"
                    value={form.data.business_number}
                    onChange={e => form.setData('business_number', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.business_number && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.business_number}</div>
                )}

                {/* Phone */}
                <input
                    type="text"
                    name="phone"
                    placeholder="연락처"
                    value={form.data.phone}
                    onChange={e => form.setData('phone', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.phone && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.phone}</div>
                )}

                {/* Fax */}
                <input
                    type="text"
                    name="fax"
                    placeholder="팩스"
                    value={form.data.fax}
                    onChange={e => form.setData('fax', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.fax && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.fax}</div>
                )}

                {/* Email */}
                <input
                    type="email"
                    name="email"
                    placeholder="이메일"
                    value={form.data.email}
                    onChange={e => form.setData('email', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2 text-black placeholder-black"
                />
                {form.errors.email && (
                    <div className="text-red-500 text-sm mb-2">{form.errors.email}</div>
                )}

                {/* Logo Image */}
                <label className="w-full inline-flex items-center justify-center border border-gray-300 p-2 rounded mb-2 cursor-pointer hover:bg-gray-50">
                    로고 이미지 선택
                    <input
                        type="file"
                        name="logo_image_filename"
                        className="hidden"
                        onChange={e => {
                            const file = e.currentTarget.files ? e.currentTarget.files[0] : null;
                            form.setData('logo_image_filename', file);
                        }}
                    />
                </label>
                {form.data.logo_image_filename && (
                    <div className="text-gray-700 text-sm mb-2">
                        선택된 파일: {form.data.logo_image_filename.name}
                    </div>
                )}
                {form.errors.logo_image_filename && (
                    <div className="text-red-500 text-sm mb-2">
                        {form.errors.logo_image_filename}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={form.processing}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {form.processing ? '가입 중…' : '가입하기'}
                </button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default SignUp;
