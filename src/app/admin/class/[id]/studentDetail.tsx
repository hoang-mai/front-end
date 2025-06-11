'use client';
import { faXmark, faUser, faEnvelope, faGraduationCap, faStar, faCircleCheck, faTimesCircle, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

interface StudentDetail extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    midtermGrade: string;
    finalGrade: string;
    totalGrade: string;
    status: string;
    notes: string;
    image: string | null;
}


interface StudentDetailProps {
    readonly showDetail: boolean;
    readonly setShowDetail: (show: boolean) => void;
    readonly student: StudentDetail | undefined;
}

function StudentDetail({
    student,
    showDetail,
    setShowDetail
}: StudentDetailProps) {
    const [statusColor, setStatusColor] = useState<string>('text-blue-500');

    useEffect(() => {
        if (student?.status.includes('Chưa có điểm')) {
            setStatusColor('text-gray-500');
        } else if (student?.status.includes('Đạt yêu cầu')) {
            setStatusColor('text-green-500');
        } else if (student?.status.includes('Không đạt yêu cầu')) {
            setStatusColor('text-red-500');
        } else {
            setStatusColor('text-gray-500');
        }
    }, [student]);

    const getStatusIcon = () => {
        if (student?.status.includes('Đạt yêu cầu')) {
            return faCircleCheck;
        } else if (student?.status.includes('Không đạt yêu cầu')) {
            return faTimesCircle;
        }
        return faGraduationCap;
    };

    return (
        <Modal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowDetail(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thông tin học viên</h2>
                </div>

                <div className="p-6">
                    {/* Student name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <div className="w-25 h-25 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                            {student?.image ? (
                                <img
                                    src={student?.image}
                                    alt={student?.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <PersonIcon sx={{ fontSize: 64, color: 'rgba(107, 114, 128, 0.8)' }} />
                                </div>
                            )}
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-(--color-text)'>
                            {student?.name}
                        </h1>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' :
                            statusColor === 'text-red-500' ? 'bg-red-100' : 'bg-blue-100'
                            } flex items-center`}>
                            <FontAwesomeIcon icon={getStatusIcon()} className={`${statusColor} mr-2`} />
                            <span className={`font-medium ${statusColor}`}>{student?.status}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faEnvelope}
                            label="Email"
                            value={student?.email || 'Chưa có email'}
                        />

                        <InfoItem
                            icon={faStar}
                            label="Điểm giữa kỳ"
                            value={student?.midtermGrade || 'Chưa có điểm giữa kỳ'}
                        />

                        <InfoItem
                            icon={faStar}
                            label="Điểm cuối kỳ"
                            value={student?.finalGrade || 'Chưa có điểm cuối kỳ'}
                        />

                        <InfoItem
                            icon={faStar}
                            label="Điểm tổng kết"
                            value={student?.totalGrade || 'Chưa có điểm tổng kết'}
                            highlighted={true}
                        />

                        <InfoItem
                            icon={faNoteSticky}
                            label="Ghi chú"
                            value={student?.notes || 'Không có ghi chú'}
                            fullWidth={true}
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