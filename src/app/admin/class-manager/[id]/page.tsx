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
                            <h1 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa lớp quản lý này ?</h1>
                            <div className="flex justify-center gap-10">
                                <button
                                    className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                    onClick={handleOnConfirmDeleteClassManager}
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
                    <TableComponent headCells={headCells} dataCells={students} search={search} onRowClick={(studentId) => {setShowStudentDetail(true); setStudentDetail(studentId); }} modal={modal} EditComponent={EditStudentModal} setDatas={setStudents}/>
                </>
            }
        </div>
    );
}

export default ClassManagerDetail;