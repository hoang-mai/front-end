import { faXmark, faUser, faCalendar, faCheckCircle, faClock, faUserTag, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

interface Violation extends Record<string, unknown> {
    id: number;
    recordedAt: Date;
    managerId: number;
    violationName: string;
    violationDate: Date;
    isEditable: boolean;
    updatedAt: Date;
    managerName: string;
}

interface ViolationDetailProps {
    readonly showModal: boolean;
    readonly setShowModal: (show: boolean) => void;
    readonly violation: Violation | undefined;
}

function ViolationDetail({ showModal, setShowModal, violation }: ViolationDetailProps) {
    const formattedViolationDate = violation?.violationDate
        ? new Date(violation.violationDate).toLocaleDateString('vi-VN')
        : 'N/A';

    const formattedRecordedDate = violation?.recordedAt
        ? new Date(violation.recordedAt).toLocaleDateString('vi-VN')
        : 'N/A';

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

                <div className="p-6">
                    {/* Violation name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <h1 className='text-xl md:text-2xl font-bold text-(--color-text)'>
                            {violation?.violationName ?? "Không tìm thấy"}
                        </h1>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${violation?.isEditable ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                            <FontAwesomeIcon
                                icon={violation?.isEditable ? faCheckCircle : faClock}
                                className={`${violation?.isEditable ? 'text-green-500' : 'text-yellow-500'} mr-2`}
                            />
                            <span className={`font-medium ${violation?.isEditable ? 'text-green-500' : 'text-yellow-500'}`}>
                                {violation?.isEditable ? 'Có thể chỉnh sửa' : 'Không thể chỉnh sửa'}
                            </span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faCalendar}
                            label="Ngày vi phạm"
                            value={formattedViolationDate}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Ngày ghi nhận"
                            value={formattedRecordedDate}
                        />

                        <InfoItem
                            icon={faUserTag}
                            label="Quản lý ghi nhận"
                            value={violation?.managerName ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faInfoCircle}
                            label="Cập nhật lần cuối"
                            value={violation?.updatedAt ? new Date(violation.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
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

export default ViolationDetail;