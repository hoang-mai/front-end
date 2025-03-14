'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { post ,get} from '@/app/Services/callApi';
import { authTest, login } from '@/app/Services/api';
import { toast } from 'react-toastify';

import { useRouter } from 'next/navigation'
const LoginPage: React.FC = () => {
    const router = useRouter()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    useEffect(() => {
        if (password.length < 6 && password.length > 0) {
            setErrorPassword('Mật khẩu bao gồm ít nhất 6 ký tự')
        } else {
            setErrorPassword('')
        }
    }, [password])
    useEffect(() => {
        const emailRegex = /@[a-zA-Z0-9]+\./;
        if (!emailRegex.exec(email) && email.length > 0) {
            setErrorEmail('Email không hợp lệ')
        } else {
            setErrorEmail('')
        }
    }, [email])
        const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            toast.promise(
                post(login, { email, password }).then((res) => {
                    if(res.data.data.user.role !== 'student'){
                        return Promise.reject(new Error('Quyền truy cập không hợp lệ'))
                    }
                    localStorage.setItem("token", res.data.data.token);
                    router.push("/");
                    }),
                {
                    pending: "Đang xử lý...",
                    success:  "Đăng nhập thành công",
                    error: "Đăng nhập thất bại",
                }
            )
            .catch((err) => {
                console.log(err);
                setError(err.message);
            });
        }
        useEffect(() => {
            get(authTest, {}).then((res) => {
                if(res.data.user.role === 'student'){
                    router.push("/");
                }
            });
        }, [])
    return (
        <div className="flex items-center justify-center min-h-screen bg-radial to-green-300 from-gray-300 from-30% " >
            <div className="w-full max-w-md p-8 space-y-6 border-gray-400 bg-gray-250 backdrop-blur-sm rounded-lg shadow-md border ">
                <h2 className="text-2xl font-bold text-center text-(--color-text)">Đăng nhập</h2>
                <form onSubmit={handleOnSubmit}>
                    <div className="relative">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        {email === '' && <FontAwesomeIcon icon={faEnvelope} className='absolute opacity-50 bottom-10.5 left-1' />}
                        <input
                            autoComplete='off'
                            type="text"
                            id="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError('')
                            }}
                            className="w-full px-6 py-2 mt-1  rounded-lg shadow-sm focus:outline-none border border-(--border-color) hover:border-(--border-color-hover) "
                        />
                        <p className='h-5 text-red-500 text-sm mt-2'>{errorEmail}</p>
                    </div>
                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        {password === '' && <FontAwesomeIcon icon={faLock} className='absolute opacity-50 bottom-10.5 left-1' />}
                        <input
                            autoComplete='off'
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            placeholder='Mật khẩu'
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setError('')
                            }
                            }
                            className="w-full px-6 py-2 mt-1 rounded-lg shadow-sm focus:outline-none border border-(--border-color) hover:border-(--border-color-hover)  "

                        />
                        <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className='absolute opacity-50 bottom-10.5 right-1 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                        <p className='h-5 text-red-500 text-sm mt-2'>{errorPassword || error}</p>
                    </div>
                    <div className="flex justify-center">
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
    );
};

export default LoginPage;