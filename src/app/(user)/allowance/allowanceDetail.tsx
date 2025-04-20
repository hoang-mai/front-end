import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
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
function AllowanceStudentDetail({ allowanceDetail, showModal, setShowModal }: AllowanceStudentDetailProps) {
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] h-[50%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thông tin trợ cấp</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>

                <div className="ml-20 grid grid-cols-2 gap-4 lg:gap-x-20">

                    <p>Số tiền: {allowanceDetail?.amount ?? 'N/A'}</p>
                    <p>Trạng thái: {allowanceDetail?.received ?? 'N/A'}</p>
                    <p>Nhận ngày: {allowanceDetail?.receivedAt?.toLocaleDateString("vi-VN") ?? 'Chưa nhận'}</p>
                    <p>Ghi chú: {allowanceDetail?.notes ?? 'N/A'}</p>
                    <p>Tháng: {allowanceDetail?.month ?? 'N/A'}</p>
                    <p>Năm: {allowanceDetail?.year ?? 'N/A'}</p>
                    <p>Tạo ngày: {allowanceDetail?.createdAt?.toLocaleDateString("vi-VN") ?? 'N/A'}</p>
                    <p>Cập nhật ngày: {allowanceDetail?.updatedAt?.toLocaleDateString("vi-VN") ?? 'N/A'}</p>


                </div>
            </Box>
        </Modal>
    );
}

export default AllowanceStudentDetail;