'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { adminClasses } from "@/app/Services/api";
import { del, get } from "@/app/Services/callApi";
import { faPlus, faReply, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import EditClassManagerModal from "./editClassManagerModal";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import EditStudentModal from "./editStudentModal";
import AddStudent from "./addStudent";
import StudentDetail from "./studentDetail";
interface ClassManager extends Record<string, unknown> {
    id: number;
    name: string;
    managerId: number | null;
    createdAt: Date;
    updatedAt: Date;
    studentCount: number;
    managerName: string | null;
    managerEmail: string | null;

}
interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    reason: string | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
}
function convertDataToStudent(data: any): Student {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: convertRoleToText(data.pivot.role),
        status: convertStatusToText(data.pivot.status),
        reason: data.pivot.reason,
        note: data.pivot.note,
        createdAt: new Date(data.pivot.created_at),
        updatedAt: new Date(data.pivot.updated_at),
    }
}
function convertRoleToText(role: string): string {
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
function convertStatusToText(status: string): string {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return 'Hoạt động';
    }
}
function convertDataToClassManager(data: any): ClassManager {
    return {
        id: data.id,
        name: data.name,
        managerId: data.manager?.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        studentCount: data.student_count,
        managerName: data.manager?.name,
        managerEmail: data.manager?.email,

    }
}
const classManagerDefault: ClassManager = {
    id: 0,
    name: '',
    managerId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    studentCount: 0,
    managerName: '',
    managerEmail: '',
}
interface HeadCell {
    id: keyof Student;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên sinh viên', },
    { id: 'email', label: 'Email', },
    { id: 'role', label: 'Vai trò', },
    { id: 'status', label: 'Trạng thái', },
    { id: 'reason', label: 'Lý do', },
    { id: 'note', label: 'Ghi chú', },
];

function ClassManagerDetail() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const [classManager, setClassManager] = useState<ClassManager>(classManagerDefault);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
    const [showStudentDetail, setShowStudentDetail] = useState<boolean>(false);
    const [studentDetail, setStudentDetail] = useState<number>(0);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const modal = {
        headTitle: 'Bạn có chắc chắn muốn xóa học viên này không?',
        successMessage: 'Xóa học viên thành công',
        errorMessage: 'Xóa học viên thất bại',
        url: adminClasses + '/' + id + '/students',
    }
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    const handleOnConfirmDeleteClassManager = () => {
        toast.promise(
            del(adminClasses + '/' + id),
            {
                pending: "Đang xử lý...",
                success: "Xóa lớp quản lý thành công",
                error: "Xóa lớp quản lý thất bại",
            }
        ).then(() => {
            setShowModal(false);
            router.push('/admin/class-manager');
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })
    }
    useEffect(() => {
        get(adminClasses + '/' + id)
            .then((res) => {
                setClassManager(convertDataToClassManager(res.data.data));
                setStudents(res.data.data.students.map((student: any) => convertDataToStudent(student)));
            })
            .catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            }).finally(() => {
                setLoading(false);
            })
    }, []);

    if (error) {
        return <div className='text-red-500'>{error}</div>
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
                    <LoaderTable />
                </>
                :
                <>
                    <div className="self-start">
                        <button onClick={() => router.push('/admin/class-manager')}>
                            <FontAwesomeIcon
                                icon={faReply}
                                className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                            />
                        </button>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Lớp quản lý: {classManager.name}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Tên quản lý: {classManager.managerName ?? 'Chưa cập nhật'}</p>
                        <p>Email: {classManager.managerEmail ?? 'Chưa cập nhật'}</p>
                        <p>Số lượng học viên: {students.length}</p>
                        <p>Ngày tạo: {classManager.createdAt.toLocaleDateString("vi-VN")}</p>
                    </div>

                    {/* Action buttons with improved styling */}
                    <div className="flex flex-col lg:flex-row justify-between gap-5 mt-4 mb-2">
                        <div className="flex flex-wrap gap-3">
                            <button
                                className="btn-text text-white h-10 px-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowAddStudent(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                <span>Thêm học viên</span>
                            </button>

                            <div className="relative flex-grow max-w-md">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute opacity-50 top-1/2 transform -translate-y-1/2 left-3"
                                />
                                <input
                                    value={search}
                                    onChange={handleOnChangeSearch}
                                    type="text"
                                    placeholder="Tìm kiếm học viên..."
                                    className="w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)"
                                />
                            </div>
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
                                <p className="text-gray-600">Bạn có chắc chắn muốn xóa lớp quản lý <span className="font-semibold">{classManager.name}</span>? Hành động này không thể hoàn tác.</p>
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
                                    onClick={handleOnConfirmDeleteClassManager}
                                >
                                    Xác nhận xóa
                                </button>
                            </div>
                        </Box>
                    </Modal>
                    {
                        showAddStudent &&
                        <AddStudent classId={classManager.id} showAddStudent={showAddStudent} setShowAddStudent={setShowAddStudent} setStudentToClass={setStudents} />
                    }
                    {showEdit &&
                        <EditClassManagerModal
                            data={classManager}
                            showEdit={showEdit}
                            setShowEdit={setShowEdit}
                            setData={setClassManager}
                        />
                    }
                    {showStudentDetail &&
                        <StudentDetail studentId={studentDetail.toString()} id={id} showStudentDetail={showStudentDetail} setShowStudentDetail={setShowStudentDetail} />
                    }
                    <TableComponent headCells={headCells} dataCells={students} search={search} onRowClick={(studentId) => { setShowStudentDetail(true); setStudentDetail(studentId); }} modal={modal} EditComponent={EditStudentModal} setDatas={setStudents} />
                </>
            }
        </div>
    );
}

export default ClassManagerDetail;