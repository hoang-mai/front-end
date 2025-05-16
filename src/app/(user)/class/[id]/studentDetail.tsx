import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string | null;
    image: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

interface StudentDetailProps {
    student: Student;
    showDetail: boolean;
    setShowDetail: (show: boolean) => void;
}

function StudentDetail({ student, showDetail, setShowDetail }: Readonly<StudentDetailProps>) {


    return (
        <Modal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            className="flex items-center justify-center"
        >
            <Box className=" w-[30%] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden">
                <div className='bg-[var(--color-text)] text-white p-3 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Thông tin học viên</h2>
                    <button
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => setShowDetail(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>
                <div className="flex flex-col items-center text-center p-5">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        {student.image ? (
                            <img
                                src={student.image}
                                alt=""
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <PersonIcon className="text-gray-500" />
                        )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{student.name}</h2>
                    <p className="font-medium">{student.email}</p>
                </div>

                
                            
                        

            </Box>
        </Modal>
    );
}

export default StudentDetail;