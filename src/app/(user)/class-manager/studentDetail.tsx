import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}
interface StudentDetailProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly student: Student | undefined;
}
function StudentDetail({ student, showModal ,setShowModal }: StudentDetailProps) {
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] h-[55%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thông tin học viên</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className='w-full flex justify-center items-center'>
                    <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Tên: {student?.name ?? "Có Lỗi xảy ra"}</h1>
                </div>
                <div className="ml-20 grid grid-cols-2 gap-4 lg:gap-x-20">
                    <p>Email: {student?.email ?? 'N/A'}</p>
                    <p>Vai trò: {student?.role ?? 'N/A'}</p>
                    <p>Trạng thái: {student?.status ?? 'N/A'}</p>
                    

                </div>
            </Box>
        </Modal>
    );
}

export default StudentDetail;