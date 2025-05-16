'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminAllowances } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import {  faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddAllowance from "../addAllowance";
import AllowanceDetail from "./allAllowanceDetail";
import EditAllowanceModal from "./editAllAllowanceModal";
import NoContent from "@/app/Components/noContent";

interface AllowanceStudent extends Record<string, unknown> {
    id: number;
    userId: number;
    month: string;
    year: number;
    amount: string; // Hoặc dùng number nếu bạn convert từ backend
    received: string;
    receivedAt: Date | null; // ISO datetime string
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    studentId: number;
    studentName: string;
    studentEmail: string;
    studentImage: string | null;
    studentEmailVerifiedAt: string | null;
    studentCreatedAt: Date | null;
    studentUpdatedAt: Date | null;
    studentRole: 'student';

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
        studentId: data.student.id,
        studentName: data.student.name,
        studentEmail: data.student.email,
        studentImage: data.student.image,
        studentEmailVerifiedAt: data.student.email_verified_at,
        studentCreatedAt: new Date(data.student.created_at),
        studentUpdatedAt: new Date(data.student.updated_at),
        studentRole: data.student.role === 'student' ? 'Học viên' : data.student.role
    }
}
interface HeadCell {
    id: keyof AllowanceStudent;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'studentName', label: 'Tên học viên', },
    { id: 'studentEmail', label: 'Email học viên', },
    { id: 'amount', label: 'Số tiền', },
    { id: 'received', label: 'Đã nhận', },
    { id: 'receivedAt', label: 'Ngày nhận', },
    { id: 'notes', label: 'Ghi chú', },
    { id: 'month', label: 'Tháng', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa trợ cấp này không?',
    successMessage: 'Xóa trợ cấp thành công',
    errorMessage: 'Xóa trợ cấp thất bại',
    url: adminAllowances,
}

function Allowance() {
    const [allowanceStudents, setAllowanceStudents] = useState<AllowanceStudent[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showAllowanceDetail, setShowAllowanceDetail] = useState<boolean>(false);
    const [allowanceDetail, setAllowanceDetail] = useState<AllowanceStudent>();

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        get(adminAllowances)
            .then((res) => {
                setAllowanceStudents(res.data.data.map((student: any) => convertDataToAllowanceStudent(student)));
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
        <>
            <div className='mb-4 w-full flex justify-between items-center relative px-6'>
                <div className='relative'>
                    <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                    <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
            </div>
            {loading ? <LoaderTable />
                : allowanceStudents.length === 0 ?
                    <NoContent title="Không có trợ cấp nào" description="Vui lòng thêm trợ cấp mới" />
                : <TableComponent dataCells={allowanceStudents} headCells={headCells} search={search} onRowClick={(id) => {
                    setShowAllowanceDetail(true);
                    setAllowanceDetail(allowanceStudents.find((student) => student.id === id));
                }} modal={modal}
                    EditComponent={EditAllowanceModal}
                    setDatas={setAllowanceStudents} />
            }
            {showModal && <AddAllowance setShowModal={setShowModal} showModal={showModal} setDatas={setAllowanceStudents} />}
            {showAllowanceDetail && <AllowanceDetail allowanceStudent={allowanceDetail} showModal={showAllowanceDetail} setShowModal={setShowAllowanceDetail} />}
        </>
    );
}

export default Allowance;