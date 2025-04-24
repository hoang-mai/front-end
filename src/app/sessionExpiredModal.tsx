'use client';
import React from "react";
import { useSessionExpired } from "./hooks/useSessionExpired";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { usePathname, useRouter } from "next/navigation";
const SessionExpiredModal = () => {
    const router = useRouter();
    const path= usePathname();
    const { isSessionExpired, hideSessionExpiredModal } = useSessionExpired();
    if (!isSessionExpired) return null;
    else if (path === "/login"){
        hideSessionExpiredModal();
        return null;
    }

    return (
        <Modal
            open={isSessionExpired}
            onClose={() => hideSessionExpiredModal()}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[30%] lg:w-[40%] md:w-[50%] h-fit w-[80%] flex flex-col bg-white p-6 md:p-8 rounded-xl shadow-2xl overflow-y-auto border border-gray-200'>
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 bg-green-50 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Phiên đăng nhập đã hết hạn</h2>
                    <p className="text-gray-600 mb-6">Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.</p>

                    <button
                        className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() => {
                            hideSessionExpiredModal();
                            localStorage.removeItem("token");
                            router.push("/login");
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Đăng nhập lại
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default SessionExpiredModal;
