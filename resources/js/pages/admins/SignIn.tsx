// resources/js/pages/admins/Login.tsx
import React from 'react';
import { useForm } from '@inertiajs/react';

const SignIn: React.FC = () => {
    const form = useForm({
        username: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admins/SignIn');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white p-6 rounded shadow text-black"
            >
                <h2 className="text-2xl font-bold mb-4">관리자 로그인</h2>

                {/* Username */}
                <input
                    type="text"
                    name="username"
                    placeholder="아이디"
                    value={form.data.username}
                    onChange={e => form.setData('username', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-3 placeholder-gray-500"
                />
                {form.errors.username && (
                    <div className="text-red-500 text-sm mb-3">
                        {form.errors.username}
                    </div>
                )}

                {/* Password */}
                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.data.password}
                    onChange={e => form.setData('password', e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-3 placeholder-gray-500"
                />
                {form.errors.password && (
                    <div className="text-red-500 text-sm mb-3">
                        {form.errors.password}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={form.processing}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {form.processing ? '로그인 중…' : '로그인'}
                </button>
            </form>
        </div>
    );
};

export default SignIn;
