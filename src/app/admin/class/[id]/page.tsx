'use client'
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { course } from "@/app/Services/api";
import { del, get } from "@/app/Services/callApi";
import { faPlus, faReply, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import EditClassModal from "./editClassModal";
import AddStudent from "./addStudent";
import LoaderTable from "@/app/Components/Loader/loaderTable";

import EnterGradeModal from "./enterGrade";
import TableComponent from "@/app/Components/table";
import EditStudentModal from "./editStudentModal";


interface HeadCell {
    id: keyof Student;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Họ và tên', },
    { id: 'email', label: 'Email', },
    { id: 'midtermGrade', label: 'Điểm giữa kỳ', },
    { id: 'finalGrade', label: 'Điểm cuối kỳ', },
    { id: 'totalGrade', label: 'Điểm tổng kết', },
    { id: 'status', label: 'Trạng thái', },
    { id: 'notes', label: 'Ghi chú', },
];


interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    midtermGrade: string;
    finalGrade: string;
    totalGrade: string;
    status: string;
    notes: string;
}
function convertDataToStudent(data: any): Student {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        midtermGrade: data.midterm_grade,
        finalGrade: data.final_grade,
        totalGrade: data.total_grade,
        status: convertStatus(data.status),
        notes: data.notes
    }
}
function convertStatus(status: string): string {
    switch (status) {
        case 'enrolled':
            return 'Đã đăng ký';
        case 'failed':
            return 'Trượt';
        case 'completed':
            return 'Hoàn thành';
        default:
            return status;
    }
}
function convertDataToClass(data: any): Course {
    return {
        id: data.id,
        code: data.code,
        subjectName: data.subject_name,
        termId: data.term_id,
        enrollLimit: data.enroll_limit,
        midtermWeight: data.midterm_weight,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        deletedAt: new Date(data.deleted_at),
    }
}
const courseDefault: Course = {
    id: 0,
    code: '',
    subjectName: '',
    termId: 0,
    enrollLimit: 0,
    midtermWeight: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
}
function ClassDetail() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const [nameTerm, setNameTerm] = useState<string>('');
    const [classDetail, setClassDetail] = useState<Course>(courseDefault);
    const [loading, setLoading] = useState<boolean>(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudent, setLoadingStudent] = useState<boolean>(true);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEnterGrade, setShowEnterGrade] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
    const modal = {
        headTitle: 'Bạn có chắc chắn muốn xóa học viên này không?',
        successMessage: 'Xóa học viên thành công',
        errorMessage: 'Xóa học viên thất bại',
        url: course + '/' + params.id + '/students',
    }
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        
            get(course + '/' + params.id).then(res => {
                setClassDetail(convertDataToClass(res.data.data));
                setNameTerm(res.data.data.term.name);
            }).catch(err => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            }).finally(() => setLoading(false));
        
    }, [ params.id]);
    useEffect(() => {
        
            get(course + '/' + params.id + '/students').then(res => {
                setStudents(res.data.data.map((data: any) => convertDataToStudent(data)));
            }
            ).catch(err => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            }
            ).finally(() => setLoadingStudent(false));
        
    }, [params.id]);
    const handleOnConfirmDeleteClass = () => {
        toast.promise(
            del(course + '/' + params.id),
            {
                pending: "Đang xử lý...",
                success: "Xóa lớp học thành công",
                error: "Xóa lớp học thất bại",
            }
        ).then(() => {
            setShowModal(false);
            router.push('/admin/class');
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })
    }
    if (error) {
        return <div className='text-red-500'>{error}</div>;
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
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Lớp học: {classDetail.subjectName}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Mã lớp học: {classDetail.code}</p>
                        <p>Tên học kỳ: {nameTerm}</p>
                        <p>Số lượng đăng ký tối đa: {classDetail.enrollLimit}</p>
                        <p>Trọng số giữa kỳ: {classDetail.midtermWeight}</p>
                    </div>


                    <div className='flex justify-between gap-5 lg:gap-3 xl:gap-5 lg:flex-row flex-col'>
                        <div className='flex gap-5 lg:gap-3 xl:gap-5 '>
                            <button className='btn-text text-white h-10 w-36 rounded-lg' onClick={() => setShowAddStudent(true)}>
                                <FontAwesomeIcon icon={faPlus} className='mr-2' />
                                Thêm học viên
                            </button>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                                <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='xl:w-auto lg:w-30 shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
                            </div>
                            <button className="btn-text text-white h-10 w-36 rounded-lg"
                                onClick={() => setShowEnterGrade(true)}
                            >
                                Nhập điểm
                            </button>
                        </div>
                        <div className='flex gap-5 lg:gap-3 xl:gap-5'>
                            <button className='btn-text text-white h-10 w-30 rounded-lg' onClick={() => setShowEdit(true)}>Chỉnh sửa</button>
                            <button
                                className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                onClick={() => setShowModal(true)}
                            >
                                Xóa lớp học
                            </button>
                        </div>
                    </div>

                    <Modal open={showModal} onClose={() => setShowModal(false)}
                        className='flex items-center justify-center'
                    >
                        <Box className="p-8 bg-white rounded-md shadow-md">
                            <h1 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa lớp học này ?</h1>
                            <div className="flex justify-center gap-10">
                                <button
                                    className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                    onClick={handleOnConfirmDeleteClass}
                                >
                                    Đồng ý
                                </button>
                                <button

                                    className=' bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 active:bg-gray-500 transition-colors'
                                    onClick={() => setShowModal(false)}
                                >
                                    Không
                                </button>
                            </div>
                        </Box>
                    </Modal>
                    {showEdit &&
                        <EditClassModal
                            data={classDetail}
                            setData={setClassDetail}
                            showEdit={showEdit}
                            setShowEdit={setShowEdit}

                        />}
                    {showAddStudent &&
                        <AddStudent
                            setAddStudentsToCourse={setStudents}
                            classId={classDetail.id}
                            showAddStudent={showAddStudent}
                            setShowAddStudent={setShowAddStudent}
                        />
                    }
                    {loadingStudent ? <LoaderTable /> :
                        <>
                            <TableComponent dataCells={students} headCells={headCells} search={search} onRowClick={() => { }} setDatas={setStudents}  EditComponent={EditStudentModal} modal={modal} midTermWeight={classDetail.midtermWeight}/>
                            {showEnterGrade && <EnterGradeModal classId={classDetail.id} midtermWeight={classDetail.midtermWeight} dataCells={students} showModal={showEnterGrade} setShowModal={setShowEnterGrade} setStudents={setStudents} />}
                        </>
                    }
                </>
            }

        </div>
    );
}

export default ClassDetail;

