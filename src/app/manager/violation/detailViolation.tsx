import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
interface Violation extends Record<string, any> {
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
interface DetailViolationProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly violation: Violation | undefined;
}

function DetailViolation({ violation, setShowModal, showModal }: DetailViolationProps) {
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] h-fit w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chi tiết vi phạm</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);

                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className="container mx-auto px-4 py-6">
                    
                        {violation && (
                            <>
                                <p><strong>Mã sinh viên:</strong> {violation.studentId}</p>
                                <p><strong>Tên vi phạm:</strong> {violation.violationName}</p>
                                <p><strong>Ngày vi phạm:</strong> {new Date(violation.violationDate).toLocaleDateString()}</p>
                                <p><strong>Người quản lý:</strong> {violation.managerName}</p>
                                <p><strong>Email người quản lý:</strong> {violation.managerEmail}</p>
                                <p><strong>Ngày tạo:</strong> {new Date(violation.createdAt).toLocaleDateString()}</p>
                                <p><strong>Ngày cập nhật:</strong> {new Date(violation.updatedAt).toLocaleDateString()}</p>
                            </>
                        )}
   
                </div>
            </Box>
        </Modal>
    );
}

export default DetailViolation;