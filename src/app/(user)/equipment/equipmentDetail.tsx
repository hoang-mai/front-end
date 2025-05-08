import { faXmark, faCalendar, faCheckCircle, faInfoCircle, faBoxOpen, faStickyNote } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { EquipmentReceipt } from "./page";

interface EquipmentDetailProps {
    readonly showDetail: boolean;
    readonly setShowDetail: (show: boolean) => void;
    readonly equipment: EquipmentReceipt | undefined;
}

function EquipmentDetail({ showDetail, setShowDetail, equipment }: EquipmentDetailProps) {
    const formattedReceivedDate = equipment?.receivedAt
        ? new Date(equipment.receivedAt).toLocaleDateString('vi-VN')
        : 'Chưa nhận';

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
                    <h2 className='text-center text-2xl font-bold text-white'>Chi tiết quân tư trang</h2>
                </div>

                <div className="p-6">
                    {/* Equipment name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <h1 className='text-xl md:text-2xl font-bold text-(--color-text)'>
                            {equipment?.distribution.equipmentType.name ?? "Không tìm thấy"}
                        </h1>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${equipment?.received ==='Đã nhận' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                            <FontAwesomeIcon
                                icon={equipment?.received ==='Đã nhận' ? faCheckCircle : faCalendar}
                                className={`${equipment?.received ==='Đã nhận' ? 'text-green-500' : 'text-yellow-500'} mr-2`}
                            />
                            <span className={`font-medium ${equipment?.received ==='Đã nhận' ? 'text-green-500' : 'text-yellow-500'}`}>
                                {equipment?.received ==='Đã nhận' ? 'Đã nhận' : 'Chưa nhận'}
                            </span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                        <InfoItem
                            icon={faBoxOpen}
                            label="Tên quân tư trang"
                            value={equipment?.distribution.equipmentType.name ?? 'N/A'}
                        />
                        <InfoItem
                            icon={faInfoCircle}
                            label="Mô tả"
                            value={equipment?.distribution.equipmentType.description ?? 'Không có mô tả'}

                        />
                        <InfoItem
                            icon={faCalendar}
                            label="Năm phát"
                            value={equipment?.distribution.year?.toString() ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Ngày nhận"
                            value={formattedReceivedDate}
                        />

                        <InfoItem
                            icon={faStickyNote}
                            label="Ghi chú"
                            value={equipment?.notes ?? 'Không có ghi chú'}
                            fullWidth={true}
                        />


                    </div>
                </div>
            </Box>
        </Modal>
    );
}

interface InfoItemProps {
    icon: typeof faBoxOpen;
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

export default EquipmentDetail;