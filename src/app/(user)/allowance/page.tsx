'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { studentAllowances } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { set } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AllowanceStudentDetail from "./allowanceDetail";

interface AllowanceStudent extends Record<string, unknown> {
    id: number;
    userId: number;        // user_id in camelCase
    month: string;
    year: number;
    amount: string;        // Assuming amount is represented as a string
    received: string;
    receivedAt: Date | null; // received_at is a string or null (could be a timestamp)
    notes: string;
    createdAt: Date;     // created_at as a string (timestamp)
    updatedAt: Date;     // updated_at as a string (timestamp)
}

function convertReceivedToString(received: boolean): string {
    return received ? 'Đã nhận' : 'Chưa nhận'
}
function convertAmountToString(amountStr: string): string {
    const amount = parseFloat(amountStr);
    const [intPart, decimalPart = ''] = amount.toFixed(2).split('.');

    const formattedInt = Number(intPart).toLocaleString('vi-VN');

    if (decimalPart === '00') {
        return `${formattedInt}`;
    } else {
        return `${formattedInt},${decimalPart}`;
    }
}
function convertDataToAllowanceStudent(data: any): AllowanceStudent {
    return {
        id: data.id,
        userId: data.user_id,
        month: `${data.month}/${data.year}`,
        year: data.year,
        amount: convertAmountToString(data.amount),
        received: convertReceivedToString(data.received),
        receivedAt: data.received_at ? new Date(data.received_at) : null,
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    }
}
interface HeadCell {
    id: keyof AllowanceStudent;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'month', label: 'Tháng' },
    { id: 'year', label: 'Năm' },
    { id: 'amount', label: 'Số tiền' },
    { id: 'received', label: 'Trạng thái' },
    { id: 'receivedAt', label: 'Ngày nhận' },
    { id: 'notes', label: 'Ghi chú' },
    { id: 'createdAt', label: 'Ngày tạo' },
    { id: 'updatedAt', label: 'Ngày cập nhật' },

];

function AllowanceStudent() {
    const [allowanceStudents, setAllowanceStudents] = useState<AllowanceStudent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [allowanceDetail, setAllowanceDetail] = useState<AllowanceStudent>();
    const [showDetail, setShowDetail] = useState<boolean>(false);

    useEffect(() => {
        get(studentAllowances).then((res) => {
            setAllowanceStudents(res.data.data.map((allowance: any) => convertDataToAllowanceStudent(allowance)));
        }).catch((res) => {
            toast.error(res.data.message);

            setError(res.data.message);

        }).finally(() => setLoading(false));
    }, []);

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    if(error) {
        return <div className='text-red-500'>{error}</div>
    }
    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Trợ cấp</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='relative'>
                    <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                    <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>

            </div>
            {loading ? <LoaderTable />
                : 
                <>
                <TableComponent dataCells={allowanceStudents} headCells={headCells} search={search} onRowClick={(id) => {
                    setShowDetail(true);
                    setAllowanceDetail(allowanceStudents.find((student) => student.id === id));
                }} actionCell={false} />
                {showDetail && <AllowanceStudentDetail showModal={showDetail} setShowModal={setShowDetail} allowanceDetail={allowanceDetail} />}
</>
            }

        </div>
    );
}

export default AllowanceStudent;