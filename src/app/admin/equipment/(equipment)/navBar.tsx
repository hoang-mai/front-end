"use client"
import { usePathname, useRouter } from "next/navigation";

function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { name: 'Đợt cấp phát', path: '/admin/equipment' },
        { name: 'Học viên chưa nhận', path: '/admin/equipment/not-received' },
        { name: 'Quân tư trang học viên', path: '/admin/equipment/student' }
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };
    return (
        <>
            <h1 className='font-bold text-2xl text-center text-(--color-text) mb-6'>
                {pathname === '/admin/equipment' && 'Đợt cấp phát'}
                {pathname === '/admin/equipment/not-received' && 'Học viên chưa nhận'}
                {pathname === '/admin/equipment/student' && 'Quân tư trang học viên'}

            </h1>

            <div className="w-full flex justify-center mb-6">
                <div className="bg-gray-50 p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path || (pathname === '/admin/equipment' && tab.path === '/admin/equipment');

                        return (
                            <button
                                key={tab.path}
                                onClick={() => handleNavigation(tab.path)}
                                className={`relative py-2.5 px-6 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 
                                     ${isActive
                                        ? 'bg-white text-(--color-text) shadow-sm translate-y-[-1px]'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'}`}
                            >
                                {tab.name}
                                {isActive && (
                                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 bg-(--color-text)"></span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default Navbar;