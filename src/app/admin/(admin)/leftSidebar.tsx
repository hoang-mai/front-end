'use client';
import Image from 'next/image';
import { faHome, faSignOut, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import { toast } from 'react-toastify';
import { post, get } from '@/app/Services/callApi';
import { authTest, logout } from '@/app/Services/api';

const LeftSidebar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const handleLogout = () => {
        toast.promise(
            post(logout, {}),
            {
                pending: "Đang xử lý...",
                success: "Đăng xuất thành công",
                error: "Đăng xuất thất bại",
            }
        ).then((res) => {
            localStorage.removeItem("token");
            router.push("/admin/login");
        })
    }
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/admin/login");
        } else {
            get(authTest).then((res) => {
                if (res.data.user.role !== 'admin') {
                    toast.error('Quyền truy cập không hợp lệ')
                    router.push("/admin/login");
                }
            }
            )
                .catch((err) => {
                    toast.error("Phiên đăng nhập hết hạn");
                    localStorage.removeItem("token");
                    router.push("/admin/login");
                });
        }
    }, [])
    return (
        <aside className={` lg:w-64 md:w-48 bg-gray-100 flex flex-col justify-between border-r border-(--border-color) shadow-2xl`}>
            <div>
                <ul className="mt-4">
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin"
                            className={`p-2 w-full h-full block ${pathname !== "/admin" ? "relative z-10" : ""}`}


                        >
                            <FontAwesomeIcon icon={faHome} className='mr-2' />
                            Quản lý học kỳ
                        </Link>

                        {pathname !== '/admin' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/class"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/class"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/class" ? "relative z-10" : ""}`}

                        >
                            <Image src="/class.svg" alt="class" width={22} height={20} className="mr-1 inline " />
                            Quản lý lớp học
                        </Link>

                        {pathname !== "/admin/class" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/admin-manager"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/admin-manager"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/admin-manager" ? "relative z-10" : ""}`}

                        >
                            <FontAwesomeIcon icon={faUserTie} className='mr-2' />
                            Quản lý quản lý học viên
                        </Link>

                        {pathname !== "/admin/admin-manager" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/class-manager"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/class-manager"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/class-manager" ? "relative z-10" : ""}`}

                        >
                            <Image src="/class-manager.svg" alt="classManager" width={20} height={20} className="mr-1 inline " />
                            Quản lý lớp quản lý
                        </Link>

                        {pathname !== "/admin/class-manager" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/register"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/register"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/register" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faUserPlus} className='mr-2' />
                            Đăng ký tài khoản
                        </Link>

                        {pathname !== '/admin/register' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                </ul>
            </div>
            <div >

                <button className="m-2 p-2 cursor-pointer flex items-center transition-all duration-300 active:scale-95"
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOut} />
                    <span className="ml-2">Đăng xuất</span>
                </button>

                <hr className="mx-4 border border-gray-400" />
                <Link href="/admin/profile" >
                    <div className={`m-2 p-2 cursor-pointer flex items-center ${pathname === '/admin/profile' ? "shadow rounded-lg shadow-gray-300" : ""} transition-all duration-300 active:scale-95`}>
                        <div className='relative flex items-center justify-center w-8 h-8'>
                            <Image fill src="/avatarDefault.svg" alt="profile" className="rounded-full border border-(--border-color)" />
                        </div>
                        <span className="ml-2">Cá nhân</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
};

export default LeftSidebar;