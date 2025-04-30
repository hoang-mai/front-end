'use client';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminClasses } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddClassManager from "./addClassManager";
import EditClassManagerModal from "./[id]/editClassManagerModal";
import NoContent from "@/app/Components/noContent";

interface ClassManager extends Record<string, unknown> {
    id: number;
    name: string;
    
    createdAt: Date;
    updatedAt: Date;
    studentCount: number;
    manager:{
        id: number | null;
        name: string | null;
        email: string | null;
    }
}

function convertDataToClassManager(data: any): ClassManager {
    return {
        id: data.id,
        name: data.name,
        managerId: data.manager ? data.manager.id : null,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        studentCount: data.student_count,
        manager: {
            id: data.manager ? data.manager.id : null,
            name: data.manager ? data.manager.name : null,
            email: data.manager ? data.manager.email : null,
        }

    }
}
interface HeadCell {
    id: keyof ClassManager;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên lớp quản lý', },
    { id: 'manager.name', label: 'Tên quản lý', },
    { id: 'manager.email', label: 'Email' ,},
    { id: 'studentCount', label: 'Số lượng sinh viên', },
    { id: 'updatedAt', label: 'Ngày cập nhật', },
    { id: 'createdAt', label: 'Ngày tạo', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa lớp quản lý này không?',
    successMessage: 'Xóa lớp quản lý thành công',
    errorMessage: 'Xóa lớp quản lý thất bại',
    url: adminClasses,
}
function ClassManager() {
    const router = useRouter();
    const [classManagers, setClassManagers] = useState<ClassManager[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    useEffect(() => {

        get(adminClasses)
            .then((res) => {
                setClassManagers(res.data.data.map((classManager: any) => convertDataToClassManager(classManager)));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            }).finally(() => {
                setLoading(false);
            })

    }, []);
    if (error) {
        return <div className="text-red-500">{error}</div>
    }
    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý lớp quản lý</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='relative'>
                    <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                    <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
                <button className='btn-text text-white py-2 px-4 w-45 rounded-md'
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className='mr-2' />
                    Thêm lớp quản lý
                </button>
            </div>
            {loading ? <LoaderTable />
                : classManagers.length === 0 ? <NoContent title="Không có lớp quản lý nào" description="Vui lòng thêm lớp quản lý mới" />
                : <TableComponent dataCells={classManagers} headCells={headCells} search={search} onRowClick={(id) => { router.push(`/admin/class-manager/${id}`) }} modal={modal} EditComponent={EditClassManagerModal} setDatas={setClassManagers}/>
            }
            {showModal && <AddClassManager  setShowModal={setShowModal} showModal={showModal} setDatas={setClassManagers} />}
        </div>
    );
}

export default ClassManager;