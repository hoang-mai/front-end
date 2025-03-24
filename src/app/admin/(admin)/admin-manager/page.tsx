'use client';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminAdminManager } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditManagerModal from "./[id]/editManagerModal";
import { useRouter } from "next/navigation";

interface Manager extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
}
interface HeadCell {
    id: keyof Manager;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên quản lý', },
    { id: 'email', label: 'Email', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa quản lý này không?',
    successMessage: 'Xóa quản lý thành công',
    errorMessage: 'Xóa quản lý thất bại',
    url: adminAdminManager,
}
function AdminManager() {
    const router = useRouter();
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [managers, setManagers] = useState<Manager[]>([]);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        if (loading) {
            get(adminAdminManager)
                .then((res) => {
                    setManagers(res.data.data);
                    setLoading(false);
                })
                .catch((res)=>{
                    toast.error(res.data.message);
                }).finally(()=>{
                    setLoading(false);
                })
        }
    }, [loading]);

    return ( 
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý quản lý học viên</h1>
      <div className='w-full flex justify-between items-center relative px-6'>
        <div className='relative'>
          <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
          <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
        <Link href={'/admin/create-term'} className='btn-text text-white py-2 px-4 w-40 rounded-md'>
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Thêm kỳ học
        </Link>
      </div>
      {loading ? <LoaderTable />
        : <TableComponent dataCells={managers} headCells={headCells} search={search} onRowClick={(id) => { router.push(`/admin/admin-manager/${id}`) }} modal={modal} EditComponent={EditManagerModal} setReload={setLoading} deleteCell={false} />
      }
    </div>
     );
}

export default AdminManager;