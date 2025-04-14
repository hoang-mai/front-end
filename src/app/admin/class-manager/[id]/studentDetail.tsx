'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { adminClasses } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import {  faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Box, Modal } from "@mui/material";
interface StudentDetail extends Record<string, unknown> {
    id: number;
    userId: number;
    classId: number;
    role: string;
    status: string;
    reason: string;
    note: string;
    createdAt: Date;
    updatedAt: Date;
    student: {
        id: number;
        name: string;
        email: string;
    };
}
function convertDataToStudentDetail(data: any): StudentDetail {
    return {
        id: data.id,
        userId: data.user_id,
        classId: data.class_id,
        role: data.role,
        status: data.status,
        reason: data.reason,
        note: data.note,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        student: {
            id: data.student.id,
            name: data.student.name,
            email: data.student.email,
        }
    }
}
const studentDetailDefault: StudentDetail = {
    id: 0,
    userId: 0,
    classId: 0,
    role: '',
    status: '',
    reason: '',
    note: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
        id: 0,
        name: '',
        email: '',
    }
}
function convertRoleToString(role: string): string {
    switch (role) {
        case 'student':
            return 'Học viên';
        case 'monitor':
            return 'Lớp trưởng';
        case 'vice_monitor':
            return 'Lớp phó';
        default:
            return 'Học viên';
    }
}
function convertStatusToString(status: string): string {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return 'Hoạt động';
    }
}
interface StudentDetailProps {
    readonly id: string;
    readonly studentId: string;
    readonly showStudentDetail: boolean;
    readonly setShowStudentDetail: (show: boolean) => void;
}
function StudentDetail({
    id,
    studentId,
    showStudentDetail,
    setShowStudentDetail
}: StudentDetailProps) {
    const [studentDetail, setStudentDetail] = useState<StudentDetail>(studentDetailDefault);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    useEffect(() => {
        get(adminClasses + '/' + id + '/students/' + studentId)
        .then((res) => {
            setStudentDetail(convertDataToStudentDetail(res.data.data));
        }).catch((res) => {
            toast.error(res.data.message);
            setError(res.data.message);
        }).finally(() => setLoading(false));
    }, []);
    if (error) {
        return <div className='text-red-500'>{error}</div>
    }

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
            {loading  ?
                <>
                    <div className='w-full flex justify-center items-center mb-10'>
                        <LoaderLine height='h-7' width='w-50' />
                    </div>
                    <div className='w-full flex flex-row gap-20 '>
                        <LoaderLine width='w-1/2' height='h-5' />
                        <LoaderLine width='w-1/2' height='h-5' />
                    </div>
                    <div className='w-full flex flex-row gap-20 mb-10'>
                        <LoaderLine width='w-1/2' height='h-5' />
                        <LoaderLine width='w-1/2' height='h-5' />
                    </div>
                </>
                :
                <>
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Tên: {studentDetail.student.name}</h1>
                    </div>
                    <div className="ml-20 grid grid-cols-2 gap-4 lg:gap-x-20">
                        <p>Email: {studentDetail.student.email}</p>
                        
                        <p>Trạng thái: {convertStatusToString(studentDetail.status)}</p>
                        <p>Vai trò: {convertRoleToString(studentDetail.role)}</p>
                        <p>Lý do: {studentDetail.reason}</p>
                        <p>Ghi chú: {studentDetail.note}</p>
                        <p>Ngày tạo: {studentDetail.createdAt.toLocaleDateString('vi')}</p>
                        
                    </div>
                    </>
            }
        </Box>
    </Modal>


     );
}

export default StudentDetail;