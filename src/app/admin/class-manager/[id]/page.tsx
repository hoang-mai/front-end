'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { adminClasses } from "@/app/Services/api";
import { del, get } from "@/app/Services/callApi";
import { faEnvelope, faGraduationCap, faPlus, faReply, faSearch, faTable, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
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
import Image from "next/image";
import NoContent from "@/app/Components/noContent";
export interface UserBasicInfo {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

export interface ViceMonitor {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

export interface Manager {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

export interface Monitor {
    id: number;
    name: string;
    email: string;
    image: string | null;
}



export interface ClassDetail {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    manager: Manager | null;
    monitor: Monitor | null;
    viceMonitors: ViceMonitor[] | null;
    students: Student[];
    studentCount: number;
}

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    image: string | null;
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
        image: data.image,
        role: convertRoleToText(data.role),
        status: convertStatusToText(data.status),
        reason: data.reason,
        note: data.note,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
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
            return 'Đang học';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return 'Đang học';
    }
}
function convertDataToClassManager(data: any): ClassDetail {
    return {
        id: data.id,
        name: data.name,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        studentCount: data.student_count,
        manager: data.manager ? {
            id: data.manager.id,
            name: data.manager.name,
            email: data.manager.email,
            image: data.manager.image,
        } : null,
        monitor: data.monitor ? {
            id: data.monitor.id,
            name: data.monitor.name,
            email: data.monitor.email,
            image: data.monitor.image,
        } : null,
        viceMonitors: data.vice_monitors ? data.vice_monitors.map((viceMonitor: any) => ({
            id: viceMonitor.id,
            name: viceMonitor.name,
            email: viceMonitor.email,
            image: viceMonitor.image,
        })) : [],
        students: data.students ? data.students.map(convertDataToStudent) : [],
    }
}
const classManagerDefault: ClassDetail = {
    id: 0,
    name: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    studentCount: 0,
    manager: {
        id: 0,
        name: '',
        email: '',
        image: null,
    },
    monitor: {
        id: 0,
        name: '',
        email: '',
        image: null,
    },
    viceMonitors: [],
    students: [],
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
    const [classManager, setClassManager] = useState<ClassDetail>(classManagerDefault);
    const [students, setStudents] = useState<Student[]>([]);
    const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
    const [showStudentDetail, setShowStudentDetail] = useState<boolean>(false);
    const [studentDetail, setStudentDetail] = useState<number>(0);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'table' | 'cards'>('table');
    const [reload, setReload] = useState<boolean>(false);
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
                error: {
                    render({ data }: any) {
                        return data.message;
                    },
                }
            }
        ).then(() => {
            setShowModal(false);
            router.push('/admin/class-manager');
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

    useEffect(() => {

        get(adminClasses + '/' + id)
            .then((res) => {
                setClassManager(convertDataToClassManager(res.data.data));
                setStudents(res.data.data.students.map((student: any) => convertDataToStudent(student)));
            })
            .catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            })
    }, [reload])
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Manager Info Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-blue-500">
                            <h2 className="text-lg font-semibold mb-3 text-blue-600">Quản lý lớp</h2>
                            <div className="space-y-2 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                    {classManager.manager && classManager.manager.image && classManager.manager.image !== 'default' ? (
                                        <Image
                                            src={classManager.manager.image}
                                            alt={classManager.manager.name}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{classManager.manager?.name ?? 'Chưa cập nhật'}</p>
                                    <p className="text-sm text-gray-600">{classManager.manager?.email ?? 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Monitor Info Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-green-500">
                            <h2 className="text-lg font-semibold mb-3 text-green-600">Lớp trưởng</h2>
                            <div className="space-y-2 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                    {classManager.monitor && classManager.monitor.image && classManager.monitor.image !== 'default' ? (
                                        <Image
                                            src={classManager.monitor.image}
                                            alt={classManager.monitor.name}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="text-green-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{classManager.monitor?.name ?? 'Chưa cập nhật'}</p>
                                    <p className="text-sm text-gray-600">{classManager.monitor?.email ?? 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vice Monitor Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-purple-500">
                            <h2 className="text-lg font-semibold mb-3 text-purple-600">Lớp phó</h2>
                            <div className="space-y-2">
                                {classManager.viceMonitors && classManager.viceMonitors.length > 0 ? (
                                    classManager.viceMonitors.map((vm, index) => (
                                        <div key={vm.id} className={`flex items-center ${index > 0 ? "mt-3 pt-3 border-t border-gray-100" : ""}`}>
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                                {vm.image && vm.image !== 'default' ? (
                                                    <Image
                                                        src={vm.image}
                                                        alt={vm.name}
                                                        width={48}
                                                        height={48}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon icon={faUser} className="text-purple-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">{vm.name}</p>
                                                <p className="text-sm text-gray-600">{vm.email}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                            <FontAwesomeIcon icon={faGraduationCap} className="text-purple-500" />
                                        </div>
                                        <p>Không có lớp phó</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Action buttons and tab navigation in the same row */}
                    <div className="flex flex-col lg:flex-row justify-between gap-5 mt-6 items-center">
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Tab Navigation Icons - moved to the left */}
                            <div className="flex h-10 mr-4">
                                <button
                                    className={`px-3 mx-1 flex items-center justify-center rounded-md ${activeTab === 'table' ? 'bg-gray-100 text-(--background-button)' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('table')}
                                    title="Bảng danh sách"
                                >
                                    <FontAwesomeIcon icon={faTable} className="text-xl" />
                                </button>
                                <button
                                    className={`px-3 mx-1 flex items-center justify-center rounded-md ${activeTab === 'cards' ? 'bg-gray-100 text-(--background-button)' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => setActiveTab('cards')}
                                    title="Thẻ học viên"
                                >
                                    <FontAwesomeIcon icon={faUsers} className="text-xl" />
                                </button>
                            </div>

                            <button
                                className="btn-text text-white h-10 px-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowAddStudent(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                <span>Thêm học viên</span>
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

                    {students.length === 0 ?
                        <NoContent title="Không có học viên nào" description="Vui lòng thêm học viên mới" /> :

                        (activeTab === 'table' ? (
                            <TableComponent
                                headCells={headCells}
                                dataCells={students}
                                search={search}
                                onRowClick={(studentId) => { setShowStudentDetail(true); setStudentDetail(studentId); }}
                                modal={modal}
                                EditComponent={EditStudentModal}
                                setDatas={setStudents}
                                setReload={setReload}
                            />
                        ) : (
                            <div className="mt-4">
                                {students.filter(student =>
                                    student.name.toLowerCase().includes(search.toLowerCase()) ||
                                    student.email.toLowerCase().includes(search.toLowerCase())
                                ).length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Không tìm thấy học viên nào</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                        {students.filter(student =>
                                            student.name.toLowerCase().includes(search.toLowerCase()) ||
                                            student.email.toLowerCase().includes(search.toLowerCase())
                                        ).map(student => (
                                            <button
                                                key={student.id}
                                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                                onClick={() => {
                                                    setStudentDetail(student.id);
                                                    setShowStudentDetail(true);
                                                }}
                                            >
                                                <div className="p-3 flex flex-col items-center">
                                                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
                                                        {student.image && student.image !== 'default' ? (
                                                            <Image
                                                                src={student.image.toString()}
                                                                alt={student.name.toString()}
                                                                width={56}
                                                                height={56}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        ) : (
                                                            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xl" />
                                                        )}
                                                    </div>

                                                    <h3 className="font-medium text-sm text-center line-clamp-1">{student.name}</h3>

                                                    <div className="flex items-center mt-1 text-xs text-gray-600">
                                                        <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-gray-400" />
                                                        <span className="truncate max-w-[120px]">{student.email}</span>
                                                    </div>

                                                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${student.role === 'Lớp trưởng' ? 'bg-green-100 text-green-800' :
                                                            student.role === 'Lớp phó' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-blue-100 text-blue-800'
                                                            }`}>
                                                            {student.role}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${student.status === 'Đang học' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {student.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                </>
            }
        </div>
    );
}

export default ClassManagerDetail;