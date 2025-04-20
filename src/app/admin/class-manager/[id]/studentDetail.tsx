'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { adminClasses } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faXmark, faUser, faEnvelope, faUserTag, faClipboard, faCalendar, faCircleInfo, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";

interface StudentDetail extends Record<string, unknown> {
    id: number;
    userId: number;
    classId: number;
    role: string;
    status: string;
    reason: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
    student: {
        id: number;
        name: string;
        email: string;
    };
}

function convertDataToStudentDetail(data: any): StudentDetail {
    return {
        id: data.id,
        userId: data.user_id,
        classId: data.class_id,
        role: data.role,
        status: data.status,
        reason: data.reason,
        note: data.note,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        student: {
            id: data.student.id,
            name: data.student.name,
            email: data.student.email,
        }
    }
}

const studentDetailDefault: StudentDetail = {
    id: 0,
    userId: 0,
    classId: 0,
    role: '',
    status: '',
    reason: '',
    note: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
        id: 0,
        name: '',
        email: '',
    }
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

function convertStatusToString(status: string): string {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return 'Hoạt động';
    }
}

interface StudentDetailProps {
    readonly id: string;
    readonly studentId: string;
    readonly showStudentDetail: boolean;
    readonly setShowStudentDetail: (show: boolean) => void;
}

function StudentDetail({
    id,
    studentId,
    showStudentDetail,
    setShowStudentDetail
}: StudentDetailProps) {
    const [studentDetail, setStudentDetail] = useState<StudentDetail>(studentDetailDefault);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [statusColor, setStatusColor] = useState<string>('text-green-500');

    useEffect(() => {
        get(adminClasses + '/' + id + '/students/' + studentId)
            .then((res) => {
                setStudentDetail(convertDataToStudentDetail(res.data.data));
            }).catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            }).finally(() => setLoading(false));
    }, [id, studentId]);

    useEffect(() => {
        if (studentDetail.status === 'active') {
            setStatusColor('text-green-500');
        } else if (studentDetail.status === 'suspended') {
            setStatusColor('text-yellow-500');
        } else {
            setStatusColor('text-gray-500');
        }
    }, [studentDetail.status]);

    if (error) {
        return <div className='text-red-500'>{error}</div>
    }

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
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thông tin học viên</h2>
                    <button
                        className='w-8 h-8 rounded-full absolute top-0 right-0 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 active:scale-90 transition-transform duration-200'
                        onClick={() => setShowStudentDetail(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <hr className='my-2 border-gray-300' />
                </div>

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
                        {/* Student name header section */}
                        <div className='w-full flex flex-col items-center justify-center mb-6'>
                            <h1 className='text-xl md:text-2xl font-bold text-(--color-text)'>
                                {studentDetail.student.name}
                            </h1>
                        </div>

                        {/* Status badge */}
                        <div className="flex justify-center mb-6">
                            <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                                <FontAwesomeIcon icon={statusColor === 'text-green-500' ? faCheckCircle : faClock} className={`${statusColor} mr-2`} />
                                <span className={`font-medium ${statusColor}`}>{convertStatusToString(studentDetail.status)}</span>
                            </div>
                        </div>

                        {/* Main content - information cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                            <InfoItem
                                icon={faEnvelope}
                                label="Email"
                                value={studentDetail.student.email}
                            />

                            <InfoItem
                                icon={faUserTag}
                                label="Vai trò"
                                value={convertRoleToString(studentDetail.role)}
                            />

                            <InfoItem
                                icon={faCircleInfo}
                                label="Lý do"
                                value={studentDetail.reason || 'Không có'}
                            />

                            <InfoItem
                                icon={faClipboard}
                                label="Ghi chú"
                                value={studentDetail.note || 'Không có'}
                            />

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoItem
                                    icon={faCalendar}
                                    label="Ngày tạo"
                                    value={formatDate(studentDetail.createdAt)}
                                    small={true}
                                />

                                <InfoItem
                                    icon={faCalendar}
                                    label="Cập nhật ngày"
                                    value={formatDate(studentDetail.updatedAt)}
                                    small={true}
                                />
                            </div>
                        </div>
                    </>
                )}
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