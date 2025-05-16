import { faXmark, faUser, faEnvelope, faMoneyBill, faCalendar, faClipboard, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import PersonIcon from '@mui/icons-material/Person';
interface AllowanceStudent extends Record<string, unknown> {
    id: number;
    userId: number;
    name: string;
    email: string;
    image: string | null;
    allowanceMonth: string;
    allowanceYear: number;
    allowanceAmount: string;
    allowanceNotes: string;
    allowanceCreatedAt: Date;

}

interface AllowanceDetailProps {
    readonly allowanceStudent: AllowanceStudent | undefined;
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AllowanceDetail({ allowanceStudent, showModal, setShowModal }: AllowanceDetailProps) {

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
                            {allowanceStudent?.image && allowanceStudent?.image !== 'default' ? (
                                <img
                                    src={allowanceStudent?.image}
                                    alt={allowanceStudent?.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <PersonIcon sx={{ fontSize: 64, color: 'rgba(107, 114, 128, 0.8)' }} />
                                </div>
                            )}
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-[color:var(--color-text)]'>
                            {allowanceStudent?.name ?? "Không tìm thấy thông tin"}
                        </h1>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full bg-yellow-100 flex items-center`}>
                            <FontAwesomeIcon icon={faClock} className={`text-yellow-500 mr-2`} />
                            <span className={`font-medium text-yellow-500`}>Chưa nhận</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faEnvelope}
                            label="Email"
                            value={allowanceStudent?.email ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faMoneyBill}
                            label="Số tiền"
                            value={allowanceStudent?.allowanceAmount ? `${allowanceStudent.allowanceAmount} VND` : 'N/A'}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Tháng/Năm"
                            value={`${allowanceStudent?.allowanceMonth ?? 'N/A'}`}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Nhận ngày"
                            value={'Chưa nhận'}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Ghi chú"
                            value={allowanceStudent?.allowanceNotes ?? ''}
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