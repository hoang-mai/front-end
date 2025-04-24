'use client';
import Image from 'next/image';
import { faExclamation, faHandHoldingDollar, faHome, faSignOut, faUserPlus, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import PersonIcon from '@mui/icons-material/Person';
import { toast } from 'react-toastify';
import { post } from '@/app/Services/callApi';
import { logout } from '@/app/Services/api';

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
            router.push("/login");
        })
    }
    const [image, setImage] = useState<string | null>(null);
    useEffect(() => {
        const storedImage = localStorage.getItem("image");
        if (storedImage && storedImage !== "null") {
            setImage(storedImage);
        }
    }, []);
    return (
        <aside className={` lg:w-64 md:w-48 bg-gray-100 flex flex-col justify-between border-r border-(--border-color) shadow-2xl`}>
            <div>
                <ul className="mt-4">
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/"
                            className={`p-2 w-full h-full block ${pathname !== "/" ? "relative z-10" : ""}`}
                        >
                            <FontAwesomeIcon icon={faHome} className='mr-2' />
                            Quản lý học kỳ
                        </Link>

                        {pathname !== '/' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/class"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/class"
                            className={`p-2 w-full h-full block ${pathname !== "/class" ? "relative z-10" : ""}`}

                        >
                            <Image src="/class.svg" alt="class" width={22} height={20} className="mr-1 inline " />
                            Lớp học
                        </Link>

                        {pathname !== "/class" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/class-manager"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/class-manager"
                            className={`p-2 w-full h-full block ${pathname !== "/class-manager" ? "relative z-10" : ""}`}

                        ><Image src="/class-manager.svg" alt="classManager" width={20} height={20} className="mr-1 inline " />
                            Lớp quản lý
                        </Link>

                        {pathname !== '/class-manager' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/allowance"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/allowance"
                            className={`p-2 w-full h-full block ${pathname !== "/allowance" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faHandHoldingDollar} className='mr-2' />
                            Trợ cấp
                        </Link>

                        {pathname !== '/allowance' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/violation"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/violation"
                            className={`p-2 w-full h-full block ${pathname !== "/violation" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faExclamation} className='mr-2' />
                            Vi phạm
                        </Link>
                        {pathname !== '/violation' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
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
                <Link href="/profile" >
                    <div className={`m-2 p-2 cursor-pointer flex items-center ${pathname === '/profile' ? "shadow rounded-lg shadow-gray-300" : ""} transition-all duration-300 active:scale-95`}>
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
                </Link>
            </div>
        </aside>
    );
};

export default LeftSidebar;