import { faXmark, faUser, faEnvelope, faDumbbell, faCalendar, faClipboard, faRuler, faTrophy, faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import PersonIcon from '@mui/icons-material/Person';
import { Dispatch, SetStateAction } from "react";

interface PerformanceRecord extends Record<string, unknown> {
    id: number;
    userId: number;
    managerId: number;
    fitnessTestId: number;
    assessmentSessionId: number;
    performance: string;
    rating: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    fitnessTest: FitnessTest;
    manager: Manager;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    image: string | null;
}

export interface FitnessTest {
    id: number;
    name: string;
    unit: string;
    higherIsBetter: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface Manager {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    image: string | null;
}

interface PracticeDetailProps {
    readonly performanceRecord: PerformanceRecord;
    readonly showModal: boolean;
    readonly setShowModal: Dispatch<SetStateAction<boolean>>;
}

function PracticeDetail({ performanceRecord, showModal, setShowModal }: PracticeDetailProps) {

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Function to get color based on rating
    const getRatingColor = (rating: string) => {
        switch (rating) {
            case 'Xuất sắc':
                return 'bg-green-100 text-green-500';
            case 'Giỏi':
                return 'bg-blue-100 text-blue-500';
            case 'Đạt':
                return 'bg-yellow-100 text-yellow-500';
            case 'Không đạt':
                return 'bg-red-100 text-red-500';
            default:
                return 'bg-gray-100 text-gray-500';
        }
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
                    <h2 className='text-center text-2xl font-bold text-white'>Chi tiết đánh giá</h2>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Student name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <div className="w-25 h-25 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                            {performanceRecord?.student?.image && performanceRecord.student.image !== 'default' ? (
                                <img
                                    src={performanceRecord.student.image}
                                    alt={performanceRecord.student.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <PersonIcon sx={{ fontSize: 64, color: 'rgba(107, 114, 128, 0.8)' }} />
                                </div>
                            )}
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-[color:var(--color-text)]'>
                            {performanceRecord?.student?.name ?? "Không tìm thấy thông tin"}
                        </h1>
                    </div>

                    {/* Rating badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${getRatingColor(performanceRecord.rating)} flex items-center`}>
                            <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                            <span className="font-medium">{performanceRecord.rating}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faEnvelope}
                            label="Email"
                            value={performanceRecord?.student?.email ?? 'N/A'}
                        />

<InfoItem
                            icon={faUser}
                            label="Tên quản lý"
                            value={performanceRecord?.manager?.name ?? 'N/A'}
                            
                        />

                        <InfoItem
                            icon={faDumbbell}
                            label="Bài kiểm tra"
                            value={performanceRecord?.fitnessTest?.name ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faRuler}
                            label="Kết quả"
                            value={`${performanceRecord.performance} ${performanceRecord?.fitnessTest?.unit ?? ''}`}
                        />

                        <InfoItem
                            icon={faChartLine}
                            label="Đánh giá"
                            value={performanceRecord.rating}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Ngày tạo"
                            value={formatDate(performanceRecord?.createdAt)}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Ngày cập nhật"
                            value={formatDate(performanceRecord?.updatedAt)}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Ghi chú"
                            value={performanceRecord?.notes ?? ''}
                            
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

export default PracticeDetail;