import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUser, faMoneyBill, faCalendar, faClipboard, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface AllowanceDetail extends Record<string, unknown> {
    id: number;
    userId: number;        // user_id in camelCase
    month: string;
    year: number;
    amount: string;        // Assuming amount is represented as a string
    received: string;
    receivedAt: Date | null; // received_at is a string or null (could be a timestamp)
    notes: string;
    createdAt: Date;     // created_at as a string (timestamp)
    updatedAt: Date;     // updated_at as a string (timestamp)
}

interface AllowanceStudentDetailProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly allowanceDetail: AllowanceDetail | undefined;
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

function AllowanceStudentDetail({ allowanceDetail, showModal, setShowModal }: AllowanceStudentDetailProps) {
    const [statusColor, setStatusColor] = useState<string>('text-yellow-500');

    useEffect(() => {
        if (allowanceDetail?.received === 'Đã nhận') {
            setStatusColor('text-green-500');
        } else if (allowanceDetail?.received === 'Chưa nhận') {
            setStatusColor('text-yellow-500');
        } else {
            setStatusColor('text-gray-500');
        }
    }, [allowanceDetail]);

    const formatDate = (date: Date | null | undefined) => {
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

                <div className="p-6">
                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                            <FontAwesomeIcon icon={statusColor === 'text-green-500' ? faCheck : faClock} className={`${statusColor} mr-2`} />
                            <span className={`font-medium ${statusColor}`}>{allowanceDetail?.received ?? 'N/A'}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faMoneyBill}
                            label="Số tiền"
                            value={allowanceDetail?.amount ? `${allowanceDetail.amount} VND` : 'N/A'}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Tháng/Năm"
                            value={`${allowanceDetail?.month ?? 'N/A'}`}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Nhận ngày"
                            value={allowanceDetail?.receivedAt ? formatDate(allowanceDetail.receivedAt) : 'Chưa nhận'}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Ghi chú"
                            value={allowanceDetail?.notes ?? 'N/A'}
                        />

                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem
                                icon={faCalendar}
                                label="Tạo ngày"
                                value={formatDate(allowanceDetail?.createdAt)}
                                small={true}
                            />

                            <InfoItem
                                icon={faCalendar}
                                label="Cập nhật ngày"
                                value={formatDate(allowanceDetail?.updatedAt)}
                                small={true}
                            />
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AllowanceStudentDetail;