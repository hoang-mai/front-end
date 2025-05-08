'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { faXmark, faUser, faEnvelope, faUserTag, faClipboard, faCalendar, faCircleInfo, faCheckCircle, faCircleCheck, faTimesCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import PersonIcon from '@mui/icons-material/Person';

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    image: string | null;
    role: string;
    status: string;
    reason: string | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface StudentDetailProps {
    readonly student: Student;
    readonly showStudentDetail: boolean;
    readonly setShowStudentDetail: (show: boolean) => void;
}

function convertRoleToString(role: string): string {
    switch (role) {
        case 'student':
            return 'Học viên';
        case 'monitor':
            return 'Lớp trưởng';
        case 'vice_monitor':
            return 'Lớp phó';
        default:
            return 'Học viên';
    }
}

function StudentDetail({
    student,
    showStudentDetail,
    setShowStudentDetail
}: StudentDetailProps) {
    const [statusColor, setStatusColor] = useState('text-green-500');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (student?.status === 'Đang học') {
            setStatusColor('text-green-500');
        } else if (student?.status === 'Đình chỉ') {
            setStatusColor('text-yellow-500');
        } else {
            setStatusColor('text-gray-500');
        }
    }, [student?.status]);

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return 'N/A';
        return date.toLocaleDateString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusIcon = () => {
        if (student?.status === 'Đang học') {
            return faCircleCheck;
        } else if (student?.status === 'Đình chỉ') {
            return faTimesCircle;
        }
        return faClock;
    };

    const isSpecialRole = student?.role === 'Lớp trưởng' || student?.role === 'Lớp phó';

    return (
        <Modal
            open={showStudentDetail}
            onClose={() => setShowStudentDetail(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowStudentDetail(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thông tin học viên</h2>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                    {loading ? (
                        <>
                            <div className='w-full flex justify-center items-center mb-10'>
                                <LoaderLine height='h-7' width='w-50' />
                            </div>
                            <div className='w-full flex flex-row gap-20'>
                                <LoaderLine width='w-1/2' height='h-5' />
                                <LoaderLine width='w-1/2' height='h-5' />
                            </div>
                            <div className='w-full flex flex-row gap-20 mb-10'>
                                <LoaderLine width='w-1/2' height='h-5' />
                                <LoaderLine width='w-1/2' height='h-5' />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Student name header section with image */}
                            <div className='w-full flex flex-col items-center justify-center mb-6'>
                                <div className="w-25 h-25 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                                    {student.image && student.image !== 'default' ? (
                                        <img
                                            src={student.image}
                                            alt={student.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                            <PersonIcon sx={{ fontSize: 64, color: 'rgba(107, 114, 128, 0.8)' }} />
                                        </div>
                                    )}
                                </div>
                                <h1 className='text-xl md:text-2xl font-bold text-(--color-text)'>
                                    {student.name}
                                </h1>
                            </div>

                            {/* Status badge */}
                            <div className="flex justify-center mb-6">
                                <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                                    <FontAwesomeIcon icon={getStatusIcon()} className={`${statusColor} mr-2`} />
                                    <span className={`font-medium ${statusColor}`}>{student.status}</span>
                                </div>
                            </div>

                            {/* Main content - information cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4 ">   
                                <InfoItem
                                    icon={faEnvelope}
                                    label="Email"
                                    value={student.email}
                                />

                                <InfoItem
                                    icon={faUserTag}
                                    label="Vai trò"
                                    value={student.role}
                                    highlighted={isSpecialRole}
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
                        </>
                    )}
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
    highlighted?: boolean;
}

const InfoItem = ({ icon, label, value, fullWidth = false, small = false, highlighted = false }: InfoItemProps) => {
    return (
        <div className={`${highlighted ? 'bg-green-50' : 'bg-gray-50'} rounded-lg p-3 shadow-sm border ${highlighted ? 'border-green-200' : 'border-gray-200'} ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${highlighted ? 'text-green-600' : ''}`}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium ${highlighted ? 'text-green-700' : 'text-gray-800'} ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
};

export default StudentDetail;