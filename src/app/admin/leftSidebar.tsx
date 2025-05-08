'use client';
import Image from 'next/image';
import { faClipboard, faHandHoldingDollar, faHome, faSignOut, faTools, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from 'react-toastify';
import { post } from '@/app/Services/callApi';
import { logout } from '@/app/Services/api';

function LeftSidebar() {
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
            router.push("/login");
        })
    }

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
                            Quản lý cán bộ
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
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/allowance"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/allowance"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/allowance" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faHandHoldingDollar} className='mr-2' />
                            Quản lý trợ cấp
                        </Link>

                        {pathname !== '/admin/allowance' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/equipment"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/equipment"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/equipment" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faTools} className='mr-2' />
                            Quản lý quân tư trang
                        </Link>

                        {pathname !== '/admin/equipment' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/practice"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/practice"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/practice" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faClipboard} className='mr-2' />
                            Quản lý rèn luyện
                        </Link>

                        {pathname !== '/admin/practice' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/admin-student"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/admin-student"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/admin-student" ? "relative z-10" : ""}`}
                        >
                            <FontAwesomeIcon icon={faUserTie} className='mr-2' />
                            Quản lý học viên
                        </Link>

                        {pathname !== '/admin/admin-student' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/admin/register"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/admin/register"
                            className={`p-2 w-full h-full block ${pathname !== "/admin/register" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faUserPlus} className='mr-2' />
                            Tạo tài khoản mới
                        </Link>

                        {pathname !== '/admin/register' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    
                </ul>
            </div>
            <div >
            <hr className="mx-4 border border-gray-400" />
                <button className="m-2 p-2 cursor-pointer flex items-center transition-all duration-300 active:scale-95"
                    onClick={handleLogout}
                >
                    <FontAwesomeIcon icon={faSignOut} />
                    <span className="ml-2">Đăng xuất</span>
                </button>

                {/* <hr className="mx-4 border border-gray-400" />
                <Link href="/admin/profile" >
                    <div className={`m-2 p-2 cursor-pointer flex items-center ${pathname === '/admin/profile' ? "shadow rounded-lg shadow-gray-300" : ""} transition-all duration-300 active:scale-95`}>
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {image ? (
                                <img
                                    src={image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <PersonIcon className="text-gray-500" />
                            )}
                        </div>
                        <span className="ml-2">Cá nhân</span>
                    </div>
                </Link> */}
            </div>
        </aside>
    );
};

export default LeftSidebar;