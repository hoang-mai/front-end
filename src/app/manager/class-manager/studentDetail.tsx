'use client';
import { faXmark, faUser, faEnvelope, faUserTag, faClipboard, faCalendar, faCircleInfo, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Modal } from "@mui/material";
import { useState } from "react";

interface Student extends Record<string, any> {
    id: number;
    name: string;
    email: string;
    classId: number;
    userId: number;
    role: string;
    status: string;
    reason: string | null;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}

interface StudentDetailProps {
    readonly student: Student;
    readonly showStudentDetail: boolean;
    readonly setShowStudentDetail: (show: boolean) => void;
}

function StudentDetail({
    student,
    showStudentDetail,
    setShowStudentDetail
}: StudentDetailProps) {
    const [statusColor, setStatusColor] = useState(
        student?.status === 'Đang học' ? 'text-green-500' : 'text-yellow-500'
    );

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <Modal
            open={showStudentDetail}
            onClose={() => setShowStudentDetail(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[90vh] flex flex-col bg-white p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                {/* Header with close button */}
                <div className='relative w-full mb-4'>
                    <h2 className='text-2xl font-semibold text-gray-800 text-center'>Thông tin học viên</h2>
                    <button
                        className='w-8 h-8 rounded-full absolute top-0 right-0 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-90 transition-transform duration-200'
                        onClick={() => setShowStudentDetail(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <hr className='my-2 border-gray-300' />
                </div>

                {/* Student name header section */}
                <div className='w-full flex flex-col items-center justify-center mb-6'>
                    <h1 className='text-xl md:text-2xl font-bold text-gray-800'>
                        {student.name}
                    </h1>
                </div>

                {/* Status badge */}
                <div className="flex justify-center mb-6">
                    <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                        <FontAwesomeIcon icon={statusColor === 'text-green-500' ? faCheckCircle : faClock} className={`${statusColor} mr-2`} />
                        <span className={`font-medium ${statusColor}`}>{student.status}</span>
                    </div>
                </div>

                {/* Main content - information cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                    <InfoItem
                        icon={faEnvelope}
                        label="Email"
                        value={student.email}
                    />

                    <InfoItem
                        icon={faUserTag}
                        label="Vai trò"
                        value={student.role}
                    />

                    <InfoItem
                        icon={faCircleInfo}
                        label="Lý do"
                        value={student.reason || 'Không có'}
                    />

                    <InfoItem
                        icon={faClipboard}
                        label="Ghi chú"
                        value={student.note || 'Không có'}
                    />

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem
                            icon={faCalendar}
                            label="Ngày tạo"
                            value={formatDate(student.createdAt)}
                            small={true}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Cập nhật ngày"
                            value={formatDate(student.updatedAt)}
                            small={true}
                        />
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

interface InfoItemProps {
    icon: typeof faUser;
    label: string;
    value: string;
    fullWidth?: boolean;
    small?: boolean;
}

const InfoItem = ({ icon, label, value, fullWidth = false, small = false }: InfoItemProps) => {
    return (
        <div className={`bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium text-gray-800 ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
};

export default StudentDetail;