'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminAllowances, adminAllowancesStudent, searchStudent } from "@/app/Services/api";
import { get, post } from "@/app/Services/callApi";
import { faPlus, faReply, faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import PersonIcon from '@mui/icons-material/Person';
import useDebounce from "@/app/hooks/useDebounce";
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import AllowanceDetail from "./allowanceDetail";
import EditAllowanceModal from "./editAllowanceModal";
import NoContent from "@/app/Components/noContent";
interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}
function StudentSelector({
    selectedStudent,
    setSelectedStudent,
    searchRef
}: Readonly<{
    selectedStudent?: Student;
    setSelectedStudent: (student?: Student) => void;
    searchRef: React.RefObject<HTMLDivElement | null>;
}>) {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>();
    const debouncedQuery = useDebounce(search, 500, setLoading);

    const handleClearSelection = () => {
        setSelectedStudent(undefined);
        setSearch('');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value === '') {
            setStudents(undefined);
        }
    };

    useEffect(() => {
        if (selectedStudent) {
            setLoading(false);
            return;
        }

        if (debouncedQuery && loading) {
            post(searchStudent, { query: debouncedQuery })
                .then((res) => {
                    setStudents(res.data.data.map((student: any) => ({
                        id: student.id,
                        name: student.name,
                        email: student.email,
                        image: student.image,
                    })));
                })
                .catch((res) => {
                    toast.error(res.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [debouncedQuery, selectedStudent, loading]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setLoading(false);
                setStudents(undefined);
                if (!selectedStudent) {
                    setSearch('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef, selectedStudent]);

    return (
        <div className="w-full md:w-96 flex flex-col rounded-lg h-fit relative">
            <div className="flex flex-row items-center">
                <label htmlFor="studentSearch" className="mr-2 whitespace-nowrap">Học viên:</label>
                <div className="relative flex-1">
                    <input
                        id="studentSearch"
                        placeholder="Nhập tên học viên"
                        type="text"
                        className="appearance-none border rounded-lg py-2 px-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
                        value={selectedStudent ? selectedStudent.name : search}
                        onChange={handleSearchChange}
                        disabled={!!selectedStudent}
                    />
                    {selectedStudent && (
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={handleClearSelection}
                            title="Xóa lựa chọn"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                    )}
                </div>
            </div>

            <div className="absolute z-10 w-full top-12">
                {loading && (
                    <div className="bg-white border border-(--border-color) rounded-lg shadow-md p-4 flex justify-center">
                        <LoaderSpinner />
                    </div>
                )}

                {students && students.length > 0 && (
                    <ul className="max-h-72 overflow-y-auto bg-white border border-(--border-color) rounded-lg shadow-md">
                        {students.map(student => (
                            <li key={student.id} className="w-full">
                                <button
                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setStudents(undefined);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {student.image ? (
                                                <img
                                                    src={student.image}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <PersonIcon className="text-gray-500" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium">{student.name}</h3>
                                            <p className="text-gray-500 text-sm">{student.email}</p>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {students && students.length === 0 && (
                    <div className="bg-white border border-(--border-color) rounded-lg shadow-md p-4 text-center text-gray-500">
                        Không tìm thấy học viên
                    </div>
                )}
            </div>
        </div>
    );
}
export interface Allowance extends Record<string, any> {
    id: number;
    userId: number;
    month: string;
    year: number;
    amount: string;
    received: string;
    receivedAt: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
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


export const convertDataToAllowance = (data: any): Allowance => ({
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
});

interface HeadCell {
    id: keyof Allowance;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'month', label: 'Tháng', },
    { id: 'year', label: 'Năm', },
    { id: 'amount', label: 'Số tiền', },
    { id: 'received', label: 'Đã nhận', },
    { id: 'receivedAt', label: 'Ngày nhận', },
    { id: 'notes', label: 'Ghi chú', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa trợ cấp này không?',
    successMessage: 'Xóa trợ cấp thành công',
    errorMessage: 'Xóa trợ cấp thất bại',
    url: adminAllowances,
}

function Student() {
    const [selectedStudent, setSelectedStudent] = useState<Student>();
    const searchStudentRef = useRef<HTMLDivElement | null>(null);
    const [allowanceStudents, setAllowanceStudents] = useState<Allowance[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [showAllowanceDetail, setShowAllowanceDetail] = useState<boolean>(false);
    const [allowanceDetail, setAllowanceDetail] = useState<Allowance>();


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    useEffect(() => {
        if (!selectedStudent) {
            setAllowanceStudents([]);
            return;
        }
        setLoading(true);
        get(adminAllowancesStudent+`/${selectedStudent.id}`)
            .then((res) => {
                setAllowanceStudents(res.data.data.map((student: any) => convertDataToAllowance(student)));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            }).finally(() => {
                setLoading(false);
            })
    }, [selectedStudent]);

    if (error) {
        return <div className="text-red-500">{error}</div>
    }
    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto" ref={searchStudentRef}>
                    <StudentSelector
                        selectedStudent={selectedStudent}
                        setSelectedStudent={setSelectedStudent}
                        searchRef={searchStudentRef}
                    />

                    <div className="relative w-full md:w-64">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={handleSearchChange}
                            type="text"
                            placeholder="Tìm kiếm trợ cấp"
                            className="appearance-none border rounded-lg py-2 pl-10 pr-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
                        />
                    </div>
                </div>
            </div>
            {!selectedStudent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-blue-700">
                    <p className="text-lg font-medium mb-2">Vui lòng chọn học viên</p>
                    <p>Chọn một học viên để xem và quản lý các trợ cấp</p>
                </div>
              ) : loading ? <LoaderTable />
              : allowanceStudents.length === 0 ?  <NoContent title="Không có trợ cấp nào" description="Vui lòng thêm trợ cấp mới" />
                : <TableComponent dataCells={allowanceStudents} headCells={headCells} search={search} onRowClick={(id) => {
                    setShowAllowanceDetail(true);
                    setAllowanceDetail(allowanceStudents.find((student) => student.id === id));
                }} modal={modal}
                    EditComponent={EditAllowanceModal}
                    setDatas={setAllowanceStudents} />
            }
            
            {showAllowanceDetail && <AllowanceDetail student={selectedStudent} allowanceStudent={allowanceDetail} showModal={showAllowanceDetail} setShowModal={setShowAllowanceDetail} />}
        </>
    );
}

export default Student;