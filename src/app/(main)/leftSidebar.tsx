'use client';
import { faHandFist, faHome, faSignOut, faExclamation, faVest, faHandHoldingDollar, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

interface LeftSidebarProps {
    showLeftSidebar: boolean;
    setShowLeftSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({
    showLeftSidebar,
    setShowLeftSidebar,
}) => {
    
    const pathname = usePathname();
    return (
        <aside className={`fixed z-1 w-64 h-[calc(100vh-32px)] bg-gray-100 flex flex-col justify-between border border-(--border-color) shadow-2xl rounded-lg m-4 ${showLeftSidebar ? "translate-x-0" : "-translate-x-68"} transition-all duration-300`}>
            <div>
                <div className="p-4 flex flex-rơw items-center justify-between h-15">
                    <h1 className="text-xl font-bold">Left Sidebar</h1>
                    <button
                        className={`bg-transparent hover:bg-gray-200 active:bg-gray-400 p-1 rounded transition-all duration-300 relative left-0 ${showLeftSidebar ? "" : "border border-gray-400 left-11"
                            }`}
                        onClick={() => setShowLeftSidebar((prev) => !prev)}
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>



                </div>
                <ul className="mt-4">
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/"
                            className={`p-2 w-full h-full block ${pathname !== "/" ? "relative z-10" : ""}`}
                            onClick={() =>{if(window.innerWidth<768) setShowLeftSidebar(false)}}
                        
                        >
                            <FontAwesomeIcon icon={faHome} className='mr-2' />
                            Trang chủ
                        </Link>

                        {pathname !== '/' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95 ${pathname !== "/practice"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/practice"
                            className={`p-2 w-full h-full block ${pathname !== "/practice" ? "relative z-10" : ""}`}
                            onClick={() =>{if(window.innerWidth<768) setShowLeftSidebar(false)}}
                        >
                            <FontAwesomeIcon icon={faHandFist} className='mr-2' />
                            Rèn luyện
                        </Link>

                        {pathname !== '/practice' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/violation"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/violation"
                            className={`p-2 w-full h-full block ${pathname !== "/violation" ? "relative z-10" : ""}`}
                            onClick={() =>{if(window.innerWidth<768) setShowLeftSidebar(false)}}
                        ><FontAwesomeIcon icon={faExclamation} className='mr-2' />
                            Lỗi vi phạm
                        </Link>

                        {pathname !== "/violation" && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/military-equipment"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/military-equipment"
                            className={`p-2 w-full h-full block ${pathname !== "/military-equipment" ? "relative z-10" : ""}`}
                            onClick={() =>{if(window.innerWidth<768) setShowLeftSidebar(false)}}
                        ><FontAwesomeIcon icon={faVest} className='mr-2' />
                            Quân tư trang
                        </Link>

                        {pathname !== '/military-equipment' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                    <li className={`rounded-md cursor-pointer m-2 transition-all duration-300 active:scale-95  ${pathname !== "/allowance"
                        ? "group relative"
                        : "bg-gradient-to-r from-green-300 to-gray-300"
                        }`}>
                        <Link
                            href="/allowance"
                            className={`p-2 w-full h-full block ${pathname !== "/allowance" ? "relative z-10" : ""}`}
                            onClick={() =>{if(window.innerWidth<768) setShowLeftSidebar(false)}}
                        ><FontAwesomeIcon icon={faHandHoldingDollar} className='mr-2' />
                            Phụ cấp
                        </Link>
                        {pathname !== '/allowance' && <span className="rounded-md absolute inset-0 w-0 bg-gradient-to-r from-green-300 to-gray-300 transition-all duration-300 group-hover:w-full"></span>}
                    </li>
                </ul>
            </div>
            <div >
                <Link href="/login">
                    <div className="m-2 p-2 cursor-pointer flex items-center transition-all duration-300 active:scale-95">
                        <FontAwesomeIcon icon={faSignOut} />
                        <span className="ml-2">Đăng xuất</span>
                    </div>
                </Link>
                <hr className="mx-4 border border-gray-400" />
                <Link href="/profile" onClick={() =>{if(window.innerWidth<768) setShowLeftSidebar(false)}}>
                    <div className={`m-2 p-2 cursor-pointer flex items-center ${pathname === '/profile' ? "shadow rounded-lg shadow-gray-300" : ""} transition-all duration-300 active:scale-95` }>
                        <img src="/avatarDefault.svg" alt="profile" className="w-8 h-8 rounded-full border border-(--border-color)" />
                        <span className="ml-2">Cá nhân</span>
                    </div>
                </Link>
            </div>
        </aside>
    );
};

export default LeftSidebar;