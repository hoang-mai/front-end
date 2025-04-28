'use client';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminAdminManager } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Manager extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    phone: string;
    rank : string;
}
interface HeadCell {
    id: keyof Manager;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên quản lý', },
    { id: 'email', label: 'Email', },
    { id: 'phone', label: 'Số điện thoại', },
    { id: 'rank', label: 'Cấp bậc', },
    
];

function AdminManager() {
    const router = useRouter();
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [error, setError] = useState<string>('');
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
                    setError(res.data.message);
                }).finally(()=>{
                    setLoading(false);
                })
        }
    }, [loading]);
    if(error){
        return <div className="text-red-500">{error}</div>
    }
    return ( 
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý quản lý học viên</h1>
      <div className='w-full flex justify-between items-center relative px-6'>
        <div className='relative'>
          <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
          <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
       
      </div>
      {loading ? <LoaderTable />
        : <TableComponent index={true} dataCells={managers} headCells={headCells} search={search} onRowClick={(id) => { router.push(`/admin/admin-manager/${id}`) }} deleteCell={false} actionCell={false}/>
      }
    </div>
     );
}

export default AdminManager;