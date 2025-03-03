'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    return (
        <div className="min-h-screen flex items-center justify-center bg-radial to-green-300 from-gray-300 from-30%">
            <div className=" p-8 rounded-lg shadow-md w-full max-w-md border border-gray-400 bg-gray-250 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-center text-(--color-text)">Đăng ký</h2>
                <form className="space-y-4 mb-4">
                    <div className="mb-4 relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                            Tài khoản
                        </label>
                        {username ==='' && <FontAwesomeIcon icon={faUser} className='absolute opacity-50 bottom-3.5 left-1' />}
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-6 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                            id="username"
                            type="text"
                            placeholder="Tài khoản"
                            autoComplete='off'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="mb-4  relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                            Mật khẩu
                        </label>
                        {password ==='' && <FontAwesomeIcon icon={faLock} className='absolute opacity-50 bottom-3.5 left-1' />}
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-6 text-gray-700  focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder='Mật khẩu'
                            autoComplete='off'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className='absolute opacity-50 bottom-3.5 right-1 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                    </div>
                    <div className="mb-6 relative">
                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                            Nhập lại mật khẩu
                        </label>
                        {confirmPassword ==='' && <FontAwesomeIcon icon={faLock} className='absolute opacity-50 bottom-10.5 left-1' />}
                        <input
                            className="shadow appearance-none border rounded-lg w-full py-2 px-6 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Nhập lại mật khẩu"
                            autoComplete='off'
                            value={confirmPassword}
                            onChange={(e) => {
                                if (e.target.value.length === 0) {
                                    setError('');
                                } else if (e.target.value !== password) {
                                    setError('Mật khẩu không khớp');
                                } else {
                                    setError('');
                                }
                                setConfirmPassword(e.target.value);
                            }}
                        />
                        <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className='absolute opacity-50 bottom-10.5 right-1 cursor-pointer' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                        <p className='h-5 text-red-500 text-sm mt-2'>{error}</p>
                    </div>
                    <div className="flex items-center justify-center">
                        <button
                            className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            Đăng ký
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm">
                    Bạn đã có tài khoản? <Link href={'/login'} className="font-medium text-(--color-text) hover:text-(--color-text-hover) active:text-(--color-text-active)">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;