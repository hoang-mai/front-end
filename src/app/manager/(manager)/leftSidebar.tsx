'use client';
import Image from 'next/image';
import { faHome, faSignOut, faVest, faHandHoldingDollar, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname,useRouter } from 'next/navigation';
import React,{useEffect} from 'react';
import { post,get } from '@/app/Services/callApi';
import { authTest, logout } from '@/app/Services/api';
import { toast } from 'react-toastify';

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
            router.push("/manager/login");
        })
    }
    useEffect(() => {
        if (!localStorage.getItem("token")) {
            router.push("/manager/login");
        } else {
            get(authTest).then((res) => {
                if (res.data.user.role !== 'manager') {
                    toast.error('Quyền truy cập không hợp lệ')
                    router.push("/manager/login");
                }
            }
            )
            .catch((err) => {
                toast.error("Phiên đăng nhập hết hạn");
                localStorage.removeItem("token");
                router.push("/manager/login");
            });
        }
    }, [])
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
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95 ${pathname !== "/manager/class"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager/class"
                            className={`p-2 w-full h-full block ${pathname !== "/manager/class" ? "relative z-10" : ""}`}

                        >
                            <Image className='inline mr-1' src='/class.svg' alt='class icon' width={24} height={24} />
                            Quản lý lớp học
                        </Link>

                        {pathname !== '/manager/class' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/manager/student"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager/student"
                            className={`p-2 w-full h-full block ${pathname !== "/manager/student" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faUsers} className='mr-2' />
                            Quản lý sinh viên
                        </Link>

                        {pathname !== "/manager/student" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/manager/military-equipment"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager/military-equipment"
                            className={`p-2 w-full h-full block ${pathname !== "/manager/military-equipment" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faVest} className='mr-2' />
                            Quân tư trang
                        </Link>

                        {pathname !== '/manager/military-equipment' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/manager/allowance"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/manager/allowance"
                            className={`p-2 w-full h-full block ${pathname !== "/manager/allowance" ? "relative z-10" : ""}`}

                        ><FontAwesomeIcon icon={faHandHoldingDollar} className='mr-2' />
                            Phụ cấp
                        </Link>
                        {pathname !== '/manager/allowance' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
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