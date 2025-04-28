'use client';
import { useRouter, usePathname } from "next/navigation";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { name: 'Trợ cấp chưa nhận', path: '/admin/allowance' },
        { name: 'Tất cả trợ cấp', path: '/admin/allowance/all' },
        { name: 'Trợ cấp học viên', path: '/admin/allowance/student' },
    ];

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (

        <div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md p-4 mb-4 lg:p-6 md:p-4">

            <h1 className='font-bold text-2xl text-center text-(--color-text) mb-6'>
                {pathname === '/admin/allowance' && 'Danh sách trợ cấp chưa nhận'}
                {pathname === '/admin/allowance/all' && 'Danh sách tất cả trợ cấp'}
                {pathname === '/admin/allowance/student' && 'Danh sách trợ cấp học viên'}
            </h1>
            
            <div className="w-full flex justify-center mb-6">
                <div className="bg-gray-50 p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.path || (pathname === '/admin/allowance' && tab.path === '/admin/allowance');
                        
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
            
            {children}
        </div>


    );
}
