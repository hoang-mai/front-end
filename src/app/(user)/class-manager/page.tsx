'use client';

import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { studentClass, studentClassmates } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faSearch, faUsers, faGraduationCap, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentDetail from "./studentDetail";
import Image from "next/image";
import NoContent from "@/app/Components/noContent";

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

export interface ViceMonitor {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

export interface ClassInfo {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    manager: Manager;
    monitor: Monitor;
    viceMonitors: ViceMonitor[];
    studentCount: number;
}

export interface ClassDetail {
    class: ClassInfo;
    role: string;
    status: string;
    reason: string | null;
    classmatesCount: number;
}

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    image: string | null;
}
function convertDataToStudent(data: any): Student {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: convertRoleToString(data.role),
        status: convertStatusToString(data.status),
        image: data.image
    };
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
            return role;
    }
}
function convertStatusToString(status: string): string {
    switch (status) {
        case 'active':
            return 'Đang học';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return status;
    }
}

interface HeadCell {
    id: keyof Student;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên học viên', },
    { id: 'email', label: 'Email học viên', },
    { id: 'role', label: 'Vai trò', },
    { id: 'status', label: 'Trạng thái', },
];
function convertDataToStudentData(data: any): ClassDetail {
    return {
        class: {
            id: data.class.id,
            name: data.class.name,
            createdAt: data.class.created_at,
            updatedAt: data.class.updated_at,
            manager: {
                id: data.class.manager.id,
                name: data.class.manager.name,
                email: data.class.manager.email,
                image: data.class.manager.image
            },
            monitor: {
                id: data.class.monitor.id,
                name: data.class.monitor.name,
                email: data.class.monitor.email,
                image: data.class.monitor.image
            },
            viceMonitors: data.class.vice_monitors.map((vm: any) => ({
                id: vm.id,
                name: vm.name,
                email: vm.email,
                image: vm.image
            })),
            studentCount: data.class.student_count
        },
        role: data.role,
        status: data.status,
        reason: data.reason,
        classmatesCount: data.classmates_count
    };
}
function ClassManager() {
    const [studentData, setStudentData] = useState<ClassDetail>();
    const [classmates, setClassmates] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingClassmates, setLoadingClassmates] = useState(true);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [studentDetail, setStudentDetail] = useState<Student>();
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const filteredClassmates = classmates.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        get(studentClass)
            .then(response => {
                console.log(response.data.data);
                setStudentData(convertDataToStudentData(response.data.data));
            })
            .catch(err => {
                toast.error(err.data.message);
                setError(err.data.message);
            }).finally(() => {
                setLoading(false);
            }
            );
        get(studentClassmates).then(response => {
            setClassmates(response.data.data.map((student: any) => convertDataToStudent(student)));
        }
        ).catch(err => {
            toast.error(err.data.message);
            setError(err.data.message);
        }
        ).finally(() => {
            setLoadingClassmates(false);
        });
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

                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Lớp quản lý: {studentData?.class.name}</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Manager Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-blue-500">
                            <h2 className="text-lg font-semibold mb-3 text-blue-600">Quản lý lớp</h2>
                            <div className="space-y-2 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                    {studentData?.class.manager.image && studentData?.class.manager.image !== 'default' ? (
                                        <Image 
                                            src={studentData.class.manager.image}
                                            alt={studentData.class.manager.name}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{studentData?.class.manager.name ?? 'Chưa cập nhật'}</p>
                                    <p className="text-sm text-gray-600">{studentData?.class.manager.email ?? 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Monitor Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-green-500">
                            <h2 className="text-lg font-semibold mb-3 text-green-600">Lớp trưởng</h2>
                            <div className="space-y-2 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                    {studentData?.class.monitor.image && studentData?.class.monitor.image !== 'default' ? (
                                        <Image 
                                            src={studentData.class.monitor.image}
                                            alt={studentData.class.monitor.name}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <FontAwesomeIcon icon={faUser} className="text-green-500" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium">{studentData?.class.monitor.name ?? 'Chưa cập nhật'}</p>
                                    <p className="text-sm text-gray-600">{studentData?.class.monitor.email ?? 'Chưa cập nhật'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Vice Monitor Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-purple-500">
                            <h2 className="text-lg font-semibold mb-3 text-purple-600">Lớp phó</h2>
                            <div className="space-y-2">
                                {studentData?.class.viceMonitors && studentData.class.viceMonitors.length > 0 ? (
                                    studentData.class.viceMonitors.map((vm, index) => (
                                        <div key={vm.id} className={`flex items-center ${index > 0 ? "mt-3 pt-3 border-t border-gray-100" : ""}`}>
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3 overflow-hidden">
                                                {vm.image && vm.image !=='default' ? (
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



                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold mb-4 text-(--color-text) ">
                                <span>Danh sách học viên</span>
                                <span className="text-sm font-normal text-gray-500 ml-2">({studentData?.classmatesCount} học viên)</span>
                            </h2>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                                <input
                                    value={search}
                                    onChange={handleOnChangeSearch}
                                    type='text'
                                    placeholder='Tìm kiếm học viên...'
                                    className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)'
                                />
                            </div>
                        </div>

                        {loadingClassmates ? <LoaderTable /> : 
                            classmates.length === 0 ?
                            <NoContent title="Không có học viên nào" description="" /> :
                        (
                            filteredClassmates.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500">Không tìm thấy học viên nào</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                    {filteredClassmates.map(student => (
                                        <button
                                            key={student.id}
                                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => {
                                                setStudentDetail(student);
                                                setShowModal(true);
                                            }}
                                        >
                                            <div className="p-3 flex flex-col items-center">
                                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
                                                    {student.image && student.image !== 'default' ? (
                                                        <Image 
                                                            src={student.image}
                                                            alt={student.name}
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
                            )
                        )}
                    </div>

                    {showModal && studentDetail &&
                        <StudentDetail
                            showModal={showModal}
                            setShowModal={setShowModal}
                            student={studentDetail}
                        />
                    }
                </>
            }
        </div>

    );
}

export default ClassManager;