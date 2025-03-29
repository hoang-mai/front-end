'use client';
import React from "react";
import { useSessionExpired } from "./hooks/useSessionExpired";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { useRouter } from "next/navigation";
const SessionExpiredModal = () => {
    const router = useRouter();
    const { isSessionExpired, hideSessionExpiredModal } = useSessionExpired();
    if (!isSessionExpired) return null;

    return (
        <Modal
            open={isSessionExpired}
            onClose={() => hideSessionExpiredModal()}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[30%] lg:w-[40%] md:w-[50%] h-fit w-[80%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <h2 className="text-xl font-bold ">Phiên đăng nhập đã hết hạn</h2>
                <p>Vui lòng đăng nhập lại để tiếp tục sử dụng hệ thống.</p>

                <button
                    className="mt-4 px-4 py-2 btn-text text-white rounded"
                    onClick={() => {
                        hideSessionExpiredModal();
                        localStorage.removeItem("token");
                        router.push("/login");
                    }}
                >
                    Đăng nhập lại
                </button>

            </Box>
        </Modal>
    );
};

export default SessionExpiredModal;
