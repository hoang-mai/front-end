'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { adminClasses } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
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
function StudentDetail() {
    const router = useRouter();
    const { id, studentId } = useParams<{ id: string, studentId: string }>();
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
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
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
                    <div className="self-start">
                        <button onClick={() => router.back()}>
                            <FontAwesomeIcon
                                icon={faReply}
                                className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                            />
                        </button>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Tên: {studentDetail.student.name}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Email: {studentDetail.student.email}</p>
                        
                        <p>Trạng thái: {convertStatusToString(studentDetail.status)}</p>
                        <p>Vai trò: {convertRoleToString(studentDetail.role)}</p>
                        <p>Lý do: {studentDetail.reason}</p>
                        <p>Ghi chú: {studentDetail.note}</p>
                        <p>Ngày tạo: {studentDetail.createdAt.toLocaleDateString('vi')}</p>
                        
                    </div>
                    </>
            }
        </div>


     );
}

export default StudentDetail;