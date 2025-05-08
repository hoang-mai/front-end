'use client';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import NoContent from "@/app/Components/noContent";
import TableComponent from "@/app/Components/table";
import { studentEquipment } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EquipmentDetail from "./equipmentDetail";

export interface EquipmentType {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface Distribution {
    id: number;
    year: number;
    equipmentTypeId: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    equipmentType: EquipmentType;
}

export interface EquipmentReceipt extends Record<string, unknown> {
    id: number;
    userId: number;
    distributionId: number;
    received: string;
    receivedAt: Date | null;
    notes: string;
    createdAt: string;
    updatedAt: string;
    distribution: Distribution;
}
function convertDataToEquipmentReceipt(data: any): EquipmentReceipt[] {
    return data.map((item: any) => ({
        id: item.id,
        userId: item.user_id,
        distributionId: item.distribution_id,
        received: item.received ? 'Đã nhận' : 'Chưa nhận',
        receivedAt: item.received_at ? new Date(item.received_at) : null,
        notes: item.notes,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        distribution: {
            id: item.distribution.id,
            year: item.distribution.year,
            equipmentTypeId: item.distribution.equipment_type_id,
            quantity: item.distribution.quantity,
            createdAt: item.distribution.created_at,
            updatedAt: item.distribution.updated_at,
            equipmentType: {
                id: item.distribution.equipment_type.id,
                name: item.distribution.equipment_type.name,
                description: item.distribution.equipment_type.description,
                createdAt: item.distribution.equipment_type.created_at,
                updatedAt: item.distribution.equipment_type.updated_at
            }
        }
    }));
}
interface HeadCell {
    id: keyof EquipmentReceipt;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'distribution.equipmentType.name', label: 'Tên quân tư trang' },
    { id: 'distribution.year', label: 'Năm phát' },
    { id: 'received', label: 'Đã nhận' },
    { id: 'receivedAt', label: 'Ngày nhận' },
    { id: 'notes', label: 'Ghi chú' },
];
function Equipment() {
    const [equipmentReceipts, setEquipmentReceipts] = useState<EquipmentReceipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [equipment, setEquipment] = useState<EquipmentReceipt | undefined>(undefined);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    useEffect(() => {
        get(studentEquipment, {})
            .then((res) => {
                setEquipmentReceipts(convertDataToEquipmentReceipt(res.data.data));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            })
            .finally(() => setLoading(false));
    }, []);

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }
    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Trợ cấp quân tư trang</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='flex gap-4'>
                    <div className='relative'>
                        <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                        <input
                            value={search}
                            onChange={handleOnChangeSearch}
                            type='text'
                            placeholder='Tìm kiếm'
                            className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)'
                        />
                    </div>
                </div>
            </div>
            {loading ?
                <LoaderTable /> :
                equipmentReceipts.length === 0 ?
                    <NoContent title="Không trợ cấp quân tư trang nào" description="" /> :
                    <TableComponent
                        headCells={headCells}
                        dataCells={equipmentReceipts}
                        search={search}
                        onRowClick={(id) => {
                            setShowDetail(true);
                            setEquipment(equipmentReceipts.find((equipment) => equipment.id === id));
                        }}
                        actionCell={false}
                    />
            }
            {showDetail && equipment &&
                <EquipmentDetail
                    showDetail={showDetail}
                    setShowDetail={setShowDetail}
                    equipment={equipment}
                />}
        </div>
    );
}

export default Equipment;