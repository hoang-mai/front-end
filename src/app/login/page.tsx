'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { post } from '@/app/Services/callApi';
import { login } from '@/app/Services/api';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type ErrorResponse = {
    [key: string]: string[];
};

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

    useEffect(() => {
        if (password.length < 6 && password.length > 0) {
            setErrorPassword('Mật khẩu bao gồm ít nhất 6 ký tự');
        } else {
            setErrorPassword('');
        }
    }, [password]);

    useEffect(() => {
        const emailRegex = /@[a-zA-Z0-9]+\./;
        if (!emailRegex.exec(email) && email.length > 0) {
            setErrorEmail('Email không hợp lệ');
        } else {
            setErrorEmail('');
        }
    }, [email]);

    useEffect(() => {
        if (password.length >= 6 && email.includes('@')) {
            setIsSubmitDisabled(false);
        } else {
            setIsSubmitDisabled(true);
        }
    }, [password, email]);

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        toast.promise(
            post(login, { email, password }).then((res) => {
                localStorage.setItem('token', res.data.data.token);
                localStorage.setItem('image', res.data.data.user.image);
                switch (res.data.data.user.role) {
                    case 'admin':
                        router.push('/admin');
                        break;
                    case 'manager':
                        router.push('/manager');
                        break;
                    default:
                        router.push('/');
                        break;
                }
            }),
            {
                pending: 'Đang xử lý...',
                success: 'Đăng nhập thành công',
                error: 'Đăng nhập thất bại',
            }
        )
            .catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? 'Có lỗi xảy ra!';
                setError(firstValue);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#c2ebaf] to-[#a0d48c]">
            <div className="w-full max-w-xl p-6 md:p-8 mx-4">
                <div className="bg-white rounded-2xl shadow-xl ">
                    {/* Logo section at the top of the card */}
                    <div className="flex flex-col items-center pt-8 pb-4 px-6">
                        <div className="bg-[#f0f9e8] rounded-full  shadow-md mb-3 border-2 border-[#124f33]">
                            <img className="w-30 h-30" src='/favicon.ico' alt="Logo" />
                        </div>
                        <h1 className="text-center text-2xl font-bold text-[#124f33] mt-2">HỆ THỐNG QUẢN LÝ HỌC VIÊN</h1>
                    </div>



                    <div className="p-6 md:p-8">
                        <form onSubmit={handleOnSubmit} className="space-y-2">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email <span className='text-red-500'>*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faEnvelope} className='text-gray-400' />
                                    </div>
                                    <input
                                        autoComplete='off'
                                        type="text"
                                        id="email"
                                        placeholder='Email'
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setError('');
                                        }}
                                        className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#124f33] focus:border-transparent transition-all"
                                    />
                                </div>
                                <p className='h-5 text-red-500 text-sm'>{errorEmail}</p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mật khẩu <span className='text-red-500'>*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faLock} className='text-gray-400' />
                                    </div>
                                    <input
                                        autoComplete='off'
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        placeholder='Mật khẩu'
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#124f33] focus:border-transparent transition-all"
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEye : faEyeSlash}
                                            className='text-gray-400 hover:text-gray-700 transition-colors'
                                        />
                                    </button>
                                </div>

                                <p className='h-6 text-red-500 text-sm'>{errorPassword || error}</p>

                            </div>



                            <div className='flex items-center justify-center '>
                                <button
                                    type="submit"
                                    className={`btn-text w-40 px-4 py-2 text-white rounded-md focus:outline-none`}
                                    disabled={password.length < 6 || email.length === 0 || !email.includes('@')}
                                >
                                    Đăng nhập
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>© {new Date().getFullYear()} Hệ thống Quản lý Học viên.</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;