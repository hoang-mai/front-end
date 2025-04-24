'use client'
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { course } from "@/app/Services/api";
import { del, get } from "@/app/Services/callApi";
import { faPlus, faReply, faSearch, faGraduationCap, faUser } from "@fortawesome/free-solid-svg-icons";
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
import StudentDetail from "./studentDetail";

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
    image: string | null;
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
        image: data.image,
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
    const [showStudentDetail, setShowStudentDetail] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student>();
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

    }, [params.id]);
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
            {loading ?
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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Course Code Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-blue-500">
                            <h2 className="text-lg font-semibold mb-3 text-blue-600">Mã lớp học</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500 mr-2" />
                                <p className="font-medium">{classDetail.code}</p>
                            </div>
                        </div>

                        {/* Term Name Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-green-500">
                            <h2 className="text-lg font-semibold mb-3 text-green-600">Kỳ học</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-green-500 mr-2" />
                                <p className="font-medium">{nameTerm}</p>
                            </div>
                        </div>

                        {/* Enrollment Limit Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-purple-500">
                            <h2 className="text-lg font-semibold mb-3 text-purple-600">Số lượng đăng ký tối đa</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faUser} className="text-purple-500 mr-2" />
                                <p className="font-medium">{classDetail.enrollLimit}</p>
                            </div>
                        </div>

                        {/* Midterm Weight Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-red-500">
                            <h2 className="text-lg font-semibold mb-3 text-red-600">Trọng số giữa kỳ</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-red-500 mr-2" />
                                <p className="font-medium">{classDetail.midtermWeight}</p>
                            </div>
                        </div>
                    </div>


                    <div className="flex flex-col lg:flex-row justify-between gap-5 mt-6">
                        <div className="flex flex-wrap gap-3 items-center">
                            <button
                                className="btn-text text-white h-10 px-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowAddStudent(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                <span>Thêm học viên</span>
                            </button>
                            <button className="btn-text text-white h-10 px-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowEnterGrade(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Nhập điểm
                            </button>
                        </div>

                        <div className='relative'>
                            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                            <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm học viên...' className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)' />
                        </div>

                        <div className="flex gap-3 shrink-0">
                            <button
                                className="btn-text text-white h-10 px-5 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowEdit(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Chỉnh sửa
                            </button>
                            <button
                                className="bg-red-500 text-white h-10 px-5 rounded-lg flex items-center justify-center shadow-sm hover:bg-red-600 hover:shadow active:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa lớp học
                            </button>
                        </div>
                    </div>

                    <Modal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        className="flex items-center justify-center"
                    >
                        <Box className="p-8 bg-white rounded-xl shadow-lg transform transition-all max-w-md w-full mx-4 animate-[fadeIn_0.3s_ease-in-out]">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa lớp</h2>
                                <p className="text-gray-600">Bạn có chắc chắn muốn xóa lớp quản lý <span className="font-semibold">{classDetail.subjectName}</span>? Hành động này không thể hoàn tác.</p>
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                                    onClick={handleOnConfirmDeleteClass}
                                >
                                    Xác nhận xóa
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
                            <TableComponent
                                dataCells={students}
                                headCells={headCells}
                                search={search}
                                onRowClick={(studentId) => {
                                    setSelectedStudent(students.find(student => student.id === studentId));
                                    setShowStudentDetail(true);
                                }}
                                setDatas={setStudents}
                                EditComponent={EditStudentModal}
                                modal={modal}
                                midTermWeight={classDetail.midtermWeight}
                            />
                            {showEnterGrade && <EnterGradeModal classId={classDetail.id} midtermWeight={classDetail.midtermWeight} dataCells={students} showModal={showEnterGrade} setShowModal={setShowEnterGrade} setStudents={setStudents} />}
                            {showStudentDetail &&
                                <StudentDetail

                                    student={selectedStudent}
                                    showDetail={showStudentDetail}
                                    setShowDetail={setShowStudentDetail}
                                />
                            }
                        </>
                    }
                </>
            }

        </div>
    );
}

export default ClassDetail;

