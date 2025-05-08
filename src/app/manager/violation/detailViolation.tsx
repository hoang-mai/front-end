'use client';
import { faXmark, faUser, faCalendarDay, faUserTie, faCalendarCheck, faInfoCircle, faCheck, faClock, faStickyNote, faEdit, faLock, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Box } from '@mui/material';
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import LoaderLine from "@/app/Components/Loader/loaderLine";

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
    const [loading, setLoading] = useState<boolean>(false);

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
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowModal(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Chi tiết vi phạm</h2>
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
                            {/* Student image and name at the top */}
                            <div className='w-full flex flex-col items-center justify-center mb-6'>
                                <div className="w-25 h-25 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                                    {student?.image && student.image !== 'default' ? (
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
                                    {student?.name || 'Không tìm thấy thông tin học viên'}
                                </h1>
                                <p>{student?.email || 'N/A'}</p>
                            </div>

                            {/* Status badge */}
                            <div className="flex justify-center mb-6">
                                {violation.isEditable ? (
                                    <div className="px-4 py-2 rounded-full bg-green-100 flex items-center">
                                        <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-2" />
                                        <span className="font-medium text-green-500">Có thể chỉnh sửa</span>
                                    </div>
                                ) : (
                                    <div className="px-4 py-2 rounded-full bg-gray-100 flex items-center">
                                        <FontAwesomeIcon icon={faLock} className="text-gray-500 mr-2" />
                                        <span className="font-medium text-gray-500">Không thể chỉnh sửa</span>
                                    </div>
                                )}
                            </div>

                            {/* Edit button if editable */}
                            {violation.isEditable && onEdit && (
                                <div className="flex justify-center mb-6">
                                    <button
                                        className="px-4 py-2 flex items-center gap-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white font-medium transition-all duration-200"
                                        onClick={onEdit}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                        <span>Chỉnh sửa vi phạm</span>
                                    </button>
                                </div>
                            )}

                            {/* Main content - information cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4 mb-6">
                                {/* Student Email */}
                                
                                {/* Manager Card - Combined name, image and email */}
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center mb-2">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                            <FontAwesomeIcon icon={faUserTie} />
                                        </div>
                                        <span className="ml-2 text-gray-500">Người quản lý</span>
                                    </div>
                                    
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mr-3">
                                                <FontAwesomeIcon icon={faUser} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-800">
                                                    {violation.managerName}
                                                </div>
                                                <div className="text-gray-600 text-sm mt-1">
                                                    <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-xs" /> {violation.managerEmail}
                                                </div>
                                            </div>
                                        </div>
                                    
                                </div>

                                {/* Violation Date */}
                                <InfoItem
                                    icon={faCalendarDay}
                                    label="Ngày vi phạm"
                                    value={formatDate(violation.violationDate?.toString())}
                                />

                                {/* Update Date */}
                                <InfoItem
                                    icon={faCalendarCheck}
                                    label="Ngày cập nhật"
                                    value={formatDateTime(violation.updatedAt?.toString())}
                                />
                                <InfoItem
                                    icon={faInfoCircle}
                                    label="Vi phạm"
                                    value={violation.violationName}
                                />

                               
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
}

const InfoItem = ({
    icon,
    label,
    value,
    fullWidth = false,
    small = false
}: InfoItemProps) => {
    return (
        <div className={`bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center mb-1">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium text-gray-800 ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
}

export default DetailViolation;