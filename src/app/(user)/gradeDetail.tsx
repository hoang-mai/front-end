'use client';
import React from 'react';
import { Modal, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faXmark,
    faBook,
    faCalendarAlt,
    faStar,
    faCheckCircle,
    faTimesCircle,
    faGraduationCap,
    faNoteSticky
} from '@fortawesome/free-solid-svg-icons';

interface Grade extends Record<string, any> {
    courseId: string;
    courseName: string;
    midtermGrade: number | null;
    finalGrade: number | null;
    totalGrade: number | null;
    status: string;
    note: string;
    termId: string;
    termName: string;
    id: number;
}

interface GradeDetailProps {
    readonly showDetail: boolean;
    readonly setShowDetail: (show: boolean) => void;
    readonly grade: Grade;
}

function GradeDetail({
    grade,
    showDetail,
    setShowDetail
}: GradeDetailProps) {
    const [statusColor, setStatusColor] = React.useState<string>('text-gray-500');

    React.useEffect(() => {
        if (grade?.status.includes('Chưa có điểm')) {
            setStatusColor('text-gray-500');
        } else if (grade?.status.includes('Qua môn')) {
            setStatusColor('text-green-500');
        } else if (grade?.status.includes('Trượt môn')) {
            setStatusColor('text-red-500');
        } else {
            setStatusColor('text-gray-500');
        }
    }, [grade]);

    const getStatusIcon = () => {
        if (grade?.status.includes('Qua môn')) {
            return faCheckCircle;
        } else if (grade?.status.includes('Trượt môn')) {
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
                    <h2 className='text-center text-2xl font-bold text-white'>Chi tiết điểm học phần</h2>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Course name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 border-4 border-white shadow-lg mb-4 flex items-center justify-center">
                            <FontAwesomeIcon icon={faBook} className="text-blue-500 text-4xl" />
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-gray-800 text-center'>
                            {grade?.courseName || 'N/A'}
                        </h1>
                        <p className='text-base text-gray-600 mt-1'>
                            {grade?.termName || 'N/A'}
                        </p>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' :
                                statusColor === 'text-red-500' ? 'bg-red-100' : 'bg-blue-100'
                            } flex items-center`}>
                            <FontAwesomeIcon icon={getStatusIcon()} className={`${statusColor} mr-2`} />
                            <span className={`font-medium ${statusColor}`}>{grade?.status || 'N/A'}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faCalendarAlt}
                            label="Học kỳ"
                            value={grade?.termName || 'N/A'}
                        />


                        <InfoItem
                            icon={faStar}
                            label="Điểm giữa kỳ"
                            value={grade?.midtermGrade !== null ? grade.midtermGrade.toString() : 'Chưa có điểm' }
                        />

                        <InfoItem
                            icon={faStar}
                            label="Điểm cuối kỳ"
                            value={grade?.finalGrade !== null ? grade.finalGrade.toString() : 'Chưa có điểm'}
                        />

                        <InfoItem
                            icon={faStar}
                            label="Điểm tổng kết"
                            value={grade?.totalGrade !== null ? grade.totalGrade.toString() : 'Chưa có điểm'}
                            highlighted={true}
                        />

                        <InfoItem
                            icon={faNoteSticky}
                            label="Ghi chú"
                            value={grade?.note || 'Không có ghi chú'}
                            fullWidth={true}
                        />
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

interface InfoItemProps {
    icon: typeof faBook;
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

export default GradeDetail;