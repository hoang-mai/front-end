'use client';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faEye, faEyeSlash, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import SelectComponent from '@/app/Components/select';
import { post } from '@/app/Services/callApi';
import { register } from '@/app/Services/api';
import { toast } from 'react-toastify';

const options: Option[] = [
    { id: '1', label: 'Học viên' },
    { id: '2', label: 'Quản lý học viên' },
    { id: '3', label: 'Quản trị viên' },
];

const RegisterPage: React.FC = () => {

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [errorEmail, setErrorEmail] = useState<string>('');
    const [errorPassword, setErrorPassword] = useState<string>('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [role, setRole] = useState<Option>({id:'1',label:'Học viên'});
    const validateEmail = (email: string) => {
        const emailRegex = /@[a-zA-Z0-9]+\./;
        if (!emailRegex.exec(email) && email.length > 0) {
            setErrorEmail('Email không hợp lệ')
        } else {
            setErrorEmail('')
        }
    }
    const validatePassword = (password: string) => {
        if (password.length < 6 && password.length > 0) {
            setErrorPassword('Mật khẩu bao gồm ít nhất 6 ký tự')
        } else {
            setErrorPassword('')
        }
    }
    const validateConfirmPassword = (confirmPassword: string) => {
        if (confirmPassword !== password && confirmPassword.length > 0) {
            setErrorConfirmPassword('Mật khẩu không khớp');
        } else {
            setErrorConfirmPassword('');
        }
    }

    const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setError('');
        validateEmail(e.target.value);
    }
    const handleOnChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setError('');
        validatePassword(e.target.value);
    }
    const handleOnChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value);
        setError('');
        validateConfirmPassword(e.target.value);
    }
    const convertRole = (role: Option): string => {
        switch (role.label) {
            case 'Học viên':
                return 'student';
            case 'Quản lý học viên':
                return 'manager';
            case 'Quản trị viên':
                return 'admin';
            default:
                return 'student';
        }
    }

    const handleOnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            post(register, { name: name, email, password, role: convertRole(role) }),
            {
                success: "Đăng ký thành công",
                error: "Đăng ký thất bại",
            }
        ).then(() => {
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            setRole({id:'1',label:'Học viên'});
        })
            .catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);

            });
    }

    return (
        <div className='lg:w-150 w-120 bg-white rounded-lg shadow-md p-4 px-16'>
            <h2 className="text-2xl font-bold mb-6 text-center text-(--color-text)">Tạo tài khoản mới</h2>
            <form className="mb-4">
                <div className="relative mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
                        Họ và tên (<span className='text-red-500'>*</span>)
                    </label>
                    <FontAwesomeIcon icon={faUser} className='absolute opacity-50 bottom-3.5 left-2' />
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-2 px-8 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                        id="name"
                        type="text"
                        placeholder="Họ và tên"
                        autoComplete='off'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
                        Email (<span className='text-red-500'>*</span>)
                    </label>
                    <FontAwesomeIcon icon={faEnvelope} className='absolute opacity-50 bottom-10.5 left-2' />
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-2 px-8 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                        id="email"
                        type="text"
                        placeholder="Email"
                        autoComplete='off'
                        value={email}
                        onChange={handleOnChangeEmail}
                    />
                    <p className='h-5 text-red-500 text-sm mt-2'>{errorEmail}</p>
                </div>

                <div className=" relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
                        Mật khẩu (<span className='text-red-500'>*</span>)
                    </label>
                    <FontAwesomeIcon icon={faLock} className='absolute opacity-50 bottom-10.5 left-2' />
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-2 px-8 text-gray-700  focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Mật khẩu'
                        autoComplete='off'
                        value={password}
                        onChange={handleOnChangePassword}
                    />
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} className='absolute opacity-50 bottom-10.5 right-1 cursor-pointer' onClick={() => setShowPassword(!showPassword)} />
                    <p className='h-5 text-red-500 text-sm mt-2'>{errorPassword}</p>
                </div>
                <div className="relative">
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="confirmPassword">
                        Nhập lại mật khẩu (<span className='text-red-500'>*</span>)
                    </label>
                    <FontAwesomeIcon icon={faLock} className='absolute opacity-50 bottom-10.5 left-2' />
                    <input
                        className="shadow appearance-none border rounded-lg w-full py-2 px-8 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover) "
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        autoComplete='off'
                        value={confirmPassword}
                        onChange={handleOnChangeConfirmPassword}
                    />
                    <FontAwesomeIcon icon={showConfirmPassword ? faEye : faEyeSlash} className='absolute opacity-50 bottom-10.5 right-1 cursor-pointer' onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
                    <p className='h-5 text-red-500 text-sm mt-2'>{errorConfirmPassword}</p>
                </div>
                <div >
                    <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="role">
                        Vai trò (<span className='text-red-500'>*</span>)
                    </label>
                    <SelectComponent selected={role} setSelected={setRole} defaultOption={{id:'1', label:'Học viên'} as Option} options={options} />
                </div>
                <p className='h-5 text-red-500 text-sm mt-2'>{error}</p>
                <div className="flex items-center justify-center">
                    <button
                        onClick={handleOnClick}
                        className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="button"
                        disabled={errorEmail.length > 0 || errorPassword.length > 0 || errorConfirmPassword.length > 0 || email.length === 0 || password.length === 0 || confirmPassword.length === 0 || name.length === 0}
                    >
                        Đăng ký
                    </button>
                </div>
            </form>

        </div>
    );
};

export default RegisterPage;