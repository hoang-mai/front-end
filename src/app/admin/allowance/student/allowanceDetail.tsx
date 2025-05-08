import { faXmark, faUser, faEnvelope, faMoneyBill, faCalendar, faClipboard, faClock, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}
export interface Allowance extends Record<string, any> {
    id: number;
    userId: number;
    month: string;
    year: number;
    amount: string;
    received: string;
    receivedAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
interface AllowanceDetailProps {
    readonly allowanceStudent: Allowance | undefined;
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly student: Student | undefined;
    
}

function AllowanceDetail({ allowanceStudent, showModal, setShowModal, student }: AllowanceDetailProps) {

    const [statusColor, setStatusColor] = useState<string>('text-yellow-500');

    useEffect(() => {
        if (allowanceStudent?.received === 'Đã nhận') {
            setStatusColor('text-green-500');
        } else if (allowanceStudent?.received === 'Chưa nhận') {
            setStatusColor('text-yellow-500');
        } else {
            setStatusColor('text-gray-500');
        }
    }, [allowanceStudent]);

    const formatDate = (date: Date | null | undefined) => {
        console.log(date)
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

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
                    <h2 className='text-center text-2xl font-bold text-white'>Thông tin trợ cấp</h2>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Student name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                    <div className="w-25 h-25 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                            {student?.image && student?.image !== 'default' ? (
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
                        <h1 className='text-xl md:text-2xl font-bold text-[color:var(--color-text)]'>
                            {student?.name ?? "Không tìm thấy thông tin"}
                        </h1>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                            <FontAwesomeIcon icon={statusColor === 'text-green-500' ? faCheck : faClock} className={`${statusColor} mr-2`} />
                            <span className={`font-medium ${statusColor}`}>{allowanceStudent?.received ?? 'N/A'}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faEnvelope}
                            label="Email"
                            value={student?.email ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faMoneyBill}
                            label="Số tiền"
                            value={allowanceStudent?.amount ? `${allowanceStudent.amount} VND` : 'N/A'}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Tháng/Năm"
                            value={`${allowanceStudent?.month ?? 'N/A'}`}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Nhận ngày"
                            value={'Chưa nhận'}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Ghi chú"
                            value={allowanceStudent?.notes ?? ''}
                            fullWidth={true}
                        />


                        <InfoItem
                            icon={faCalendar}
                            label="Tạo ngày"
                            value={formatDate(allowanceStudent?.createdAt)}
                            small={true}
                            
                        />
                        <InfoItem
                            icon={faCalendar}
                            label="Cập nhật ngày"
                            value={formatDate(allowanceStudent?.updatedAt)}
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
                    <FontAwesomeIcon icon={icon} className="text-gray-400" />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium text-gray-800 ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
};

export default AllowanceDetail;