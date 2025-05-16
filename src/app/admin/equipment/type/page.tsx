'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminEquipmentType } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faReply, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EditEquipment from "./editEquipment";
import AddEquipment from "./addEquipment";
import { useRouter } from "next/navigation";

interface EquipmentType extends Record<string, any> {
    id: number,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}
function convertDataToEquipmentType(data: any): EquipmentType[] {
    return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at)
    }));
}
interface HeadCell {
    id: keyof EquipmentType;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên quân tư trang', },
    { id: 'description', label: 'Mô tả', },
    { id: 'createdAt', label: 'Ngày tạo', },
    { id: 'updatedAt', label: 'Ngày cập nhật', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa quân tư trang này không?',
    successMessage: 'Xóa quân tư trang thành công',
    errorMessage: 'Xóa quân tư trang thất bại',
    url: adminEquipmentType,
}


function Type() {
    const router = useRouter();
    const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        get(adminEquipmentType, {})
            .then((res) => {
                setEquipmentTypes(convertDataToEquipmentType(res.data.data));
            }).catch((err) => {
                setError(err.data.message);
                toast.error(err.data.message);
            }).finally(() => {
                setLoading(false);
            });
    }, []);
    if (error) {
        return <div className='text-red-500'>{error}</div>
    }

    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4 relative'>
            <button onClick={() => router.push('/admin/equipment')}>
                <FontAwesomeIcon
                    icon={faReply}
                    className='absolute left-8 top-8 text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                />
            </button>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý quân tư trang</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='relative'>
                    <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                    <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
                <button className='btn-text text-white py-2 px-4 w-60 rounded-md'

                    onClick={() => setShowModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className='mr-2' />
                    Thêm quân tư trang
                </button>
            </div>
            {loading ? <LoaderTable />
                : <TableComponent dataCells={equipmentTypes} headCells={headCells} search={search} onRowClick={()=>{}} modal={modal} EditComponent={EditEquipment} setDatas={setEquipmentTypes} />
            }
            {showModal && <AddEquipment setShowModal={setShowModal} showModal={showModal} setDatas={setEquipmentTypes} />}
        </div>
    );
}

export default Type;