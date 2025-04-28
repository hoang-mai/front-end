'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminAllowances, adminAllowancesPending } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddAllowance from "./addAllowance";
import AllowanceDetail from "./allowanceDetail";
import EditAllowanceModal from "./editAllowanceModal";
import { useRouter } from "next/navigation";

interface AllowanceStudent extends Record<string, unknown> {
    id: number;
    userId: number;
    name: string;
    email: string;
    image: string | null;
    allowanceMonth: string;
    allowanceYear: number;
    allowanceAmount: string;
    allowanceNotes: string;
    allowanceCreatedAt: Date;

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
        id: data.allowance.id,
        userId: data.user_id,
        name: data.name,
        email: data.email,
        image: data.image,
        allowanceMonth: `${data.allowance.month}/${data.allowance.year}`,
        allowanceYear: data.allowance.year,
        allowanceAmount: convertAmountToString(data.allowance.amount),
        allowanceNotes: data.allowance.notes,
        allowanceCreatedAt: new Date(data.allowance.created_at),
    }
}
interface HeadCell {
    id: keyof AllowanceStudent;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên học viên', },
    { id: 'email', label: 'Email học viên', },
    { id: 'allowanceAmount', label: 'Số tiền', },
    { id: 'allowanceNotes', label: 'Ghi chú', },
    { id: 'allowanceMonth', label: 'Tháng', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa trợ cấp này không?',
    successMessage: 'Xóa trợ cấp thành công',
    errorMessage: 'Xóa trợ cấp thất bại',
    url: adminAllowances,
}
function Allowance() {
    const router = useRouter();
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
        get(adminAllowancesPending)
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
                <div className='flex gap-4 items-center'>
                    <div className='relative'>
                        <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                        <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
                    </div>
                </div>
                <button className='btn-text text-white py-2 px-4 w-45 rounded-md'
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className='mr-2' />
                    Thêm trợ cấp
                </button>
            </div>
            {loading ? <LoaderTable />
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