'use client';
import Image from 'next/image';
import { faHome, faSignOut, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { post } from '@/app/Services/callApi';
import { logout } from '@/app/Services/api';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
const LeftSidebar = () => {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
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
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/manager"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager"
                            className={`p-2 w-full h-full block ${pathname !== "/manager" ? "relative z-10" : ""}`}


                        >
                            <FontAwesomeIcon icon={faHome} className='mr-2' />
                            Trang chủ
                        </Link>

                        {pathname !== '/manager' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/manager/class-manager"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager/class-manager"
                            className={`p-2 w-full h-full block ${pathname !== "/manager/class-manager" ? "relative z-10" : ""}`}

                        >
                            <Image src="/class-manager.svg" alt="classManager" width={20} height={20} className="mr-1 inline " />
                            Quản lý lớp quản lý
                        </Link>

                        {pathname !== "/manager/class-manager" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>


                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/manager/violation"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager/violation"
                            className={`p-2 w-full h-full block ${pathname !== "/manager/violation" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faExclamation} className='mr-2' />
                            Quản lý vi phạm
                        </Link>
                        {pathname !== '/manager/violation' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
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
                <Link href="/manager/profile" >
                    <div className={`m-2 p-2 cursor-pointer flex items-center ${pathname === '/manager/profile' ? "shadow rounded-lg shadow-gray-300" : ""} transition-all duration-300 active:scale-95`}>
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