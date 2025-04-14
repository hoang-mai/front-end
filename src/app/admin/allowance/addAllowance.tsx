'use client'
import useDebounce from "@/app/hooks/useDebounce";
import { adminAllowances, searchStudent } from "@/app/Services/api";
import { post } from "@/app/Services/callApi";
import { useEffect, useRef, useState } from "react";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { set } from "date-fns";

interface Student {
    id: number;
    name: string;
    email: string;
}
interface AllowanceProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas: any;
}

function AddAllowance({ showModal, setShowModal, setDatas }: AllowanceProps) {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery = useDebounce<string>(search, 500, setLoading);
    const [students, setStudents] = useState<Student[] | undefined>();
    const [addStudent, setAddStudent] = useState<Student>({ id: -1, name: 'Không có', email: 'Không có' });
    const [month, setMonth] = useState<string>('');
    const [errorMonth, setErrorMonth] = useState<string>('');
    const [year, setYear] = useState<string>('');
    const [errorYear, setErrorYear] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [errorAmount, setErrorAmount] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [error, setError] = useState<string>('');
    const searchRef = useRef<HTMLDivElement>(null);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value === '') {
            setStudents(undefined);
        }
    }
    const handleOnChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorAmount("");
            setAmount(value);
            return;
        }
        if (isNaN(Number(value))) {
            setErrorAmount("Số tiền không hợp lệ");
            return;
        }
        setErrorAmount("");
        setAmount(value);
    }
    const handleOnChangeMonth = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
            setErrorMonth("");
            setMonth(e.target.value);
            return;
        }
        if (isNaN(Number(e.target.value))) {
            setErrorMonth("Tháng không hợp lệ");
            return;
        }
        if (Number(e.target.value) < 1 || Number(e.target.value) > 12) {
            setErrorMonth("Tháng không hợp lệ");
            return;
        }
        setErrorMonth("");
        setMonth(e.target.value);
    }
    const handleOnChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorYear("");
            setYear(value);
            return;
        }

        if (isNaN(Number(e.target.value))) {
            setErrorYear("Năm không hợp lệ");
            return;
        }
        if (value.length > 4 || (value.length === 4 && Number(value) < 1900)) {
            setErrorYear("Năm không hợp lệ");
            return;
        }
        setErrorYear("");
        setYear(value);
    };

    const handleOnClickAddAllowance = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(post(adminAllowances, {
            user_id: addStudent.id,
            month: month,
            year: year,
            amount: amount,
            notes: notes,
        }), {
            pending: "Đang xử lý...",
            success: "Thêm trợ cấp thành công",
            error: "Thêm trợ cấp thất bại",
        }).then((res) => {
            setDatas((prev: any) => {
                const updateAllowance = res.data.data;
                return [...prev, {
                    id: updateAllowance.id,
                    userId: updateAllowance.user_id,
                    studentId: updateAllowance.user_id,
                    month: `${updateAllowance.month}/${updateAllowance.year}`,
                    year: updateAllowance.year,
                    amount: updateAllowance.amount,
                    received: 'Chưa nhận',
                    receivedAt: null,
                    notes: updateAllowance.notes,
                    createdAt: new Date(updateAllowance.created_at),
                    updatedAt: new Date(updateAllowance.updated_at),
                    studentName: addStudent.name,
                    studentEmail: addStudent.email,
                    studentEmailVerifiedAt: null,
                    studentRole: 'Học viên',
                    studentCreatedAt: null,
                    studentUpdatedAt: null,

                }];


            });
            setShowModal(false);
        }
        ).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    }
    useEffect(() => {
        if (debouncedQuery) {
            post(searchStudent, { query: debouncedQuery }).then(res => {
                setStudents(res.data.data);
            }).catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [debouncedQuery])
    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearch('');
                setLoading(false);
                setStudents(undefined);
            }
        }
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        }
    }, [searchRef])
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] h-[90%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thêm trợ cấp</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className='relative w-full h-10 max-h-10'>
                    <div className={`absolute w-full z-10001 flex flex-col rounded-lg h-fit  ${(loading || students) && 'bg-white shadow-md '}`}
                        ref={searchRef}
                    >
                        <input
                            placeholder="Tìm kiếm học viên"
                            type="text"
                            className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            value={search}
                            onChange={handleOnChangeSearch}
                        />
                        {(() => {
                            let content;
                            if (loading) {
                                content = <LoaderSpinner />;
                            } else if (students) {
                                content = students.length > 0 ? (
                                    <ul className='max-h-60 overflow-y-auto'>
                                        {
                                            students.map(student => (
                                                <li key={student.id} className='w-full'>
                                                    <button className="w-full flex items-center justify-between bg-white p-2 rounded-lg hover:bg-gray-100 "
                                                        onClick={() => {
                                                            setAddStudent(student);
                                                            setSearch('');
                                                            setStudents(undefined);
                                                        }}
                                                    >
                                                        <div className="text-left">
                                                            <h3>{student.name}</h3>
                                                            <p className="text-gray-500 text-sm">{student.email}</p>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                    </ul>
                                ) : (
                                    <p className="text-center my-2">Không tìm thấy học viên</p>
                                );
                            } else {
                                content = null;
                            }
                            return content;
                        })()}
                    </div>
                </div>
                <div className="flex flex-col mt-4 flex-1 ">
                    <h1 className='text-lg font-semibold text-(--color-text) '>Học viên đã chọn</h1>
                    <form action="" className=" space-y-4 flex-1 w-full" >
                        <div className="flex flex-row  ">
                            <label htmlFor="name" className="w-1/3 text-left pr-4 ">Tên học viên:</label>
                            <div className="flex flex-row w-2/3">
                                <p>{addStudent?.name}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="email" className="w-1/3 text-left pr-4 ">Email: </label>
                            <div className="flex flex-row w-2/3">
                                <p>{addStudent?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="amount" className="w-1/3 text-left pr-4 ">Số tiền:</label>
                            <div className="flex flex-col w-2/3">
                                <input
                                    placeholder="Số tiền"
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={handleOnChangeAmount}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                />
                                <p className='text-red-500 text-sm h-5'>{errorAmount}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="month" className="w-1/3 text-left pr-4 ">Tháng:</label>
                            <div className="flex flex-col w-2/3">
                                <input
                                    placeholder="Tháng"
                                    type="text"
                                    id="month"
                                    value={month}
                                    onChange={handleOnChangeMonth}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                />
                                <p className='text-red-500 text-sm h-5' >{errorMonth}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="year" className="w-1/3 text-left pr-4 ">Năm:</label>
                            <div className="flex flex-col w-2/3">
                                <input
                                    placeholder="Năm"
                                    type="text"
                                    id="year"
                                    value={year}
                                    onChange={handleOnChangeYear}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                />
                                <p className='text-red-500 text-sm h-5'>{errorYear}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="notes" className="w-1/3 text-left pr-4 ">Ghi chú:</label>
                            <div className="flex flex-row w-2/3">
                                <input
                                    placeholder="Ghi chú"
                                    type="text"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                />
                            </div>
                        </div>
                        <p className='h-5 text-red-500 text-sm mt-2'>{error}</p>
                        <div className='flex justify-center gap-4 w-full mt-4'>
                            <button className='btn-text text-white p-2 rounded-lg w-40'
                                disabled={month === '' || year === '' || amount === '' || addStudent?.id === -1 || errorMonth !== '' || errorYear !== '' || errorAmount !== '' || year.length < 4}
                                onClick={handleOnClickAddAllowance}
                            >
                                Thêm trợ cấp
                            </button>
                        </div>
                    </form>
                </div>

            </Box>
        </Modal>
    );
}

export default AddAllowance;