'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('username:', username);
        console.log('password:', password);
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-radial to-green-300 from-gray-300 from-30% " >
            <div className="w-full max-w-md p-8 space-y-6 border-gray-400 bg-gray-250 backdrop-blur-sm rounded-lg shadow-md border ">
                <h2 className="text-2xl font-bold text-center text-(--color-text)">Đăng nhập</h2>
                <form onSubmit={handleOnSubmit} className="space-y-4">
                    <div className="relative">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                            Tài khoản
                        </label>
                        {username === '' && <FontAwesomeIcon icon={faUser} className='absolute opacity-50 bottom-3.5 left-1' />}
                        <input
                            autoComplete='off'
                            type="text"
                            id="username"
                            placeholder='Tài khoản'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-6 py-2 mt-1  rounded-lg shadow-sm focus:outline-none border border-(--border-color) hover:border-(--border-color-hover) "
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        {password === '' && <FontAwesomeIcon icon={faLock} className='absolute opacity-50 bottom-3.5 left-1' />}
                        <input
                            autoComplete='off'
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            placeholder='Mật khẩu'
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-2 mt-1 rounded-lg shadow-sm focus:outline-none border border-(--border-color) hover:border-(--border-color-hover)  "

                        />
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className='absolute opacity-50 bottom-3.5 right-1 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-3">
                            <label htmlFor='rememberMe' className="flex items-center cursor-pointer relative">
                                <input id='rememberMe' type="checkbox" className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border checked:bg-green-600 checked:border-green-600" />
                                <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </label>
                            <p> Nhớ lựa chọn </p>
                        </div>
                        <div className="text-sm">
                            <Link href={'/register'} className="font-medium text-(--color-text) hover:text-(--color-text-hover) active:text-(--color-text-active)">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Link href={'/'}>
                            <button
                                type="submit"
                                className="btn-text w-40 px-4 py-2 text-white rounded-md focus:outline-none"
                            >
                                Đăng nhập
                            </button>
                        </Link>
                    </div>
                </form>
                <p className="text-sm text-center">
                    Bạn chưa có tài khoản?{' '}
                    <Link href={'/register'} className="font-medium text-(--color-text) hover:text-(--color-text-hover) active:text-(--color-text-active)">
                        Đăng ký
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;