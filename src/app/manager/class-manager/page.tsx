'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { adminClasses, managerClasses } from "@/app/Services/api";
import { del, get } from "@/app/Services/callApi";
import { faEnvelope, faGraduationCap, faPlus, faReply, faSearch, faTable, faUser, faUsers, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";

import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import EditStudentModal from "./editStudentModal";

import StudentDetail from "./studentDetail";
import Image from "next/image";
import NoContent from "@/app/Components/noContent";
export interface UserBasicInfo {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

export interface ViceMonitor extends UserBasicInfo { }

export interface Manager extends UserBasicInfo { }

export interface Monitor extends UserBasicInfo { }



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
    const [classManager, setClassManager] = useState<ClassDetail>(classManagerDefault);
    const [students, setStudents] = useState<Student[]>([]);

    const [showStudentDetail, setShowStudentDetail] = useState<boolean>(false);
    const [studentDetail, setStudentDetail] = useState<Student>();

    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'table' | 'cards'>('table');

    const [reload, setReload] = useState<boolean>(false);

    useEffect(() => {
        get(managerClasses)
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
    }, [reload]);

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        get(managerClasses)
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

                        </div>

                        <div className='relative'>
                            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                            <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm học viên...' className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)' />
                        </div>


                    </div>


                    {showStudentDetail && studentDetail &&
                        <StudentDetail student={studentDetail} showStudentDetail={showStudentDetail} setShowStudentDetail={setShowStudentDetail} />
                    }
                    {students.length === 0 ? (
                        <NoContent title='Không có học viên nào' description='' />
                    ) : (

                        activeTab === 'table' ? (
                            <TableComponent
                                headCells={headCells}
                                dataCells={students}
                                search={search}
                                onRowClick={(studentId) => {
                                    setShowStudentDetail(true);
                                    setStudentDetail(students.find(student => student.id === studentId));
                                }
                                }
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
                                                    setStudentDetail(student);
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