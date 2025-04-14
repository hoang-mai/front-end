'use client';
import {  faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Box, Modal } from "@mui/material";

  
interface Student  extends Record<string, any> {
    id: number;
    name: string;
    email: string;
    classId: number;
    userId: number;
    role: string;
    status: string;
    reason: string | null;
    note: string;
    createdAt: Date;
    updatedAt: Date;
  }

interface StudentDetailProps {
    readonly student: Student;
    readonly showStudentDetail: boolean;
    readonly setShowStudentDetail: (show: boolean) => void;
}
function StudentDetail({
    student,
    showStudentDetail,
    setShowStudentDetail
}: StudentDetailProps) {
    console.log(student.pivotCreatedAt)
    return ( 
        <Modal
        open={showStudentDetail}
        onClose={() => setShowStudentDetail(false)}
        className="flex items-center justify-center "
    >
        <Box className='xl:w-[65%] lg:w-[75%] md:w-[90%]  h-[50%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
            <div className='relative w-full'>
                <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thông tin học viên</h2>
                <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                    onClick={() => {
                        setShowStudentDetail(false);
                    }}>
                    <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                </button>
                <hr className='my-2' />
            </div>
            
                
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Tên: {student.name}</h1>
                    </div>
                    <div className="ml-20 grid grid-cols-2 gap-4 lg:gap-x-20">
                        <p>Email: {student.email}</p>
                        
                        <p>Trạng thái: {student.status}</p>
                        <p>Vai trò: {student.role}</p>
                        <p>Lý do: {student.reason}</p>
                        <p>Ghi chú: {student.note}</p>
                        <p>Ngày tạo: {student.createdAt.toLocaleDateString('vi')}</p>
                        
                    </div>
                    
        </Box>
    </Modal>


     );
}

export default StudentDetail;