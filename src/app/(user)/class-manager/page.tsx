'use client';

import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { studentClass, studentClassmates } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import StudentDetail from "./studentDetail";

interface Manager {
    id: number;
    name: string;
    email: string;
}

interface Monitor {
    id: number;
    name: string;
    email: string;
}

interface ViceMonitor {
    id: number;
    name: string;
    email: string;
}

interface Class {
    id: number;
    name: string;
    managerId: number;  // changed from manager_id to managerId
    createdAt: Date;   // changed from created_at to createdAt
    updatedAt: Date;   // changed from updated_at to updatedAt
    manager: Manager;
}
interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}
function convertDataToStudent(data: any): Student {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: convertRoleToString(data.role),
        status: convertStatusToString(data.status)
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
interface StudentData {
    class: Class;
    role: string;
    status: string;
    reason: string | null;
    monitor: Monitor;
    viceMonitors: ViceMonitor[];
    classmatesCount: number;
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
function convertDataToStudentData(data: any): StudentData {
    return {
        class: {
            id: data.class.id,
            name: data.class.name,
            managerId: data.class.manager_id,
            createdAt: new Date(data.class.created_at),
            updatedAt: new Date(data.class.updated_at),
            manager: {
                id: data.class.manager.id,
                name: data.class.manager.name,
                email: data.class.manager.email
            }
        },
        role: data.role,
        status: data.status,
        reason: data.reason,
        monitor: {
            id: data.monitor.id,
            name: data.monitor.name,
            email: data.monitor.email
        },
        viceMonitors: data.vice_monitors.map((vm: any) => ({
            id: vm.id,
            name: vm.name,
            email: vm.email
        })),
        classmatesCount: data.classmates_count
    };
}
function ClassManager() {
    const [studentData, setStudentData] = useState<StudentData>();
    const [classmates, setClassmates] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingClassmates, setLoadingClassmates] = useState(true);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showStudentDetail, setShowStudentDetail] = useState(false);
    const [studentDetail, setStudentDetail] = useState<Student>();
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        get(studentClass)
            .then(response => {
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
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Tên quản lý: {studentData?.class.manager.name ?? 'Chưa cập nhật'}</p>
                        <p>Email: {studentData?.class.manager.email ?? 'Chưa cập nhật'}</p>
                        <p>Tên lớp trưởng: {studentData?.monitor.name ?? 'Chưa cập nhật'}</p>
                        <p>Email lớp trưởng: {studentData?.monitor.email ?? 'Chưa cập nhật'}</p>
                        {studentData?.viceMonitors && (
                            <>
                                
                                {studentData.viceMonitors.length > 0 ? (
                                    studentData.viceMonitors.map((vm, index) => (
                                        <>
                                            <p>Tên lớp phó: {vm.name}</p>
                                            <p>Email lớp phó: {vm.email}</p>
                                        </>
                                    ))
                                ) : (
                                    <p>Không có lớp phó</p>
                                )}
                            </>
                        )}

                        <p>Số lượng học viên: {studentData?.classmatesCount}</p>
                        <p>Ngày tạo: {studentData?.class.createdAt.toLocaleDateString("vi-VN")}</p>
                        <p>Ngày cập nhật: {studentData?.class.updatedAt.toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className='relative'>
                        <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                        <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='xl:w-auto lg:w-30 shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
                    </div>
                    {loadingClassmates ? <LoaderTable /> :

                        <>
                            <TableComponent index={true} dataCells={classmates} headCells={headCells} search={search} onRowClick={(id) => { setShowModal(true); setStudentDetail(classmates.find(student => student.id === id)); }} actionCell={false} />
                            {showModal && <StudentDetail showModal={showModal} setShowModal={setShowModal} student={studentDetail} />}
                        </>

                    }
                </>
            }
        </div>

    );
}

export default ClassManager;