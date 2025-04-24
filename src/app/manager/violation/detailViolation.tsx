import { faXmark, faUser, faCalendarDay, faUserTie, faCalendarPlus, faCalendarCheck, faPencilAlt, faInfoCircle, faCheck, faClock, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';

interface Violation {
    id: number;
    studentId: number;
    managerId: number;
    violationName: string;
    violationDate: Date;
    createdAt: Date;
    updatedAt: Date;
    isEditable: boolean;
    managerName: string;
    managerEmail: string;
}

interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

interface DetailViolationProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly violation: Violation | undefined;
    readonly student: Student | undefined;
    readonly onEdit?: () => void;
}

function DetailViolation({ showModal, setShowModal, violation, student, onEdit }: DetailViolationProps) {


    const formatDate = (date: string | null | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatDateTime = (date: string | null | undefined) => {
        if (!date) return 'N/A';
        const dateObj = new Date(date);
        return `${dateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} ${dateObj.toLocaleDateString('vi-VN')} `;
    };

    if (!violation) return null;

    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center"
        >
            <Box className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[color:var(--background-button)] p-4 relative">
                    <button
                        className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                        onClick={() => setShowModal(false)}
                        aria-label="Đóng"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className="text-center text-xl font-bold text-white">Chi tiết vi phạm</h2>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                
                    {/* Violation Name */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center mb-2">
                            <FontAwesomeIcon icon={faStickyNote} className="text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">Tên vi phạm</span>
                        </div>
                        <h3 className="pl-6 text-lg font-medium text-gray-800">
                            {violation.violationName}
                        </h3>
                    </div>

                    {/* Student Info Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Học viên
                        </label>
                        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4 border border-green-200">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {student?.image ? (
                                    <img
                                        src={student.image}
                                        alt={student.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <PersonIcon className="text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{student?.name || 'Không tìm thấy thông tin học viên'}</h3>
                                <p className="text-gray-600 text-sm">{student?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Manager Info Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Người quản lý
                        </label>
                        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4 border border-green-200">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUserTie} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{violation.managerName}</h3>
                                <p className="text-gray-600 text-sm">{violation.managerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Ngày vi phạm</label>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center">
                                <FontAwesomeIcon icon={faCalendarDay} className="text-gray-400 mr-3" />
                                <div className="font-medium">{formatDate(violation.violationDate?.toString())}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Ngày cập nhật</label>
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 flex items-center">
                                <FontAwesomeIcon icon={faCalendarCheck} className="text-gray-400 mr-3" />
                                <div className="font-medium text-sm">{formatDateTime(violation.updatedAt?.toString())}</div>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </Box>
        </Modal>
    );
}

export default DetailViolation;