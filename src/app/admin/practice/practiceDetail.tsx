import CloseIcon from '@mui/icons-material/Close';
import StraightenIcon from '@mui/icons-material/Straighten';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
interface FitnessTest extends Record<string, any> {
    id: number,
    name: string,
    unit: string,
    higherIsBetter: string,
    createdAt: Date,
    updatedAt: Date,
    thresholdsExcellentThreshold: string,
    thresholdsGoodThreshold: string,
    thresholdsPassThreshold: string,
}

interface PracticeDetailProps {
    readonly practiceStudent: FitnessTest | undefined;
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function PracticeDetail({ practiceStudent, showModal, setShowModal }: PracticeDetailProps) {

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
                        <CloseIcon />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thông tin bài thực hành</h2>
                </div>

                <div className="p-6">
                    {/* Test name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <h1 className='text-xl md:text-2xl font-bold text-[color:var(--color-text)]'>
                            {practiceStudent?.name ?? "Không tìm thấy thông tin"}
                        </h1>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={<StraightenIcon />}
                            label="Đơn vị đo"
                            value={practiceStudent?.unit ?? 'N/A'}
                        />

                        <InfoItem
                            icon={<ShowChartIcon />}
                            label="Cách tính điểm"
                            value={practiceStudent?.higherIsBetter === "Có" ? "Càng cao càng tốt" : "Càng thấp càng tốt"}
                        />

                        <InfoItem
                            icon={<EmojiEventsIcon />}
                            label="Ngưỡng xuất sắc"
                            value={practiceStudent?.thresholdsExcellentThreshold ?? 'N/A'}
                        />

                        <InfoItem
                            icon={<ThumbUpIcon />}
                            label="Ngưỡng giỏi"
                            value={practiceStudent?.thresholdsGoodThreshold ?? 'N/A'}
                        />

                        <InfoItem
                            icon={<CheckCircleIcon />}
                            label="Ngưỡng đạt"
                            value={practiceStudent?.thresholdsPassThreshold ?? 'N/A'}
                        />

                        <InfoItem
                            icon={<CalendarTodayIcon />}
                            label="Ngày tạo"
                            value={formatDate(practiceStudent?.createdAt)}
                            small={true}
                        />

                        <InfoItem
                            icon={<CalendarTodayIcon />}
                            label="Ngày cập nhật"
                            value={formatDate(practiceStudent?.updatedAt)}
                            small={true}
                        />
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
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
                    <span className="text-gray-400">{icon}</span>
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