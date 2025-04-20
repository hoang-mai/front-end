'use client'
import useDebounce from "@/app/hooks/useDebounce";
import { adminAllowances, searchStudent } from "@/app/Services/api";
import { post } from "@/app/Services/callApi";
import { useEffect, useRef, useState } from "react";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSearch, faMoneyBill, faCalendarAlt, faStickyNote, faUser, faInfoCircle, faSave, faTimes, faCoins } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

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
    
    // Generate current year and month for default values
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear().toString();
    const currentMonth = (currentDate.getMonth() + 1).toString();
    
    // Set default values when component mounts
    useEffect(() => {
        setYear(currentYear);
        setMonth(currentMonth);
    }, []);
    
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
    
    const formatAmountForDisplay = (amountStr: string): string => {
        const amount = parseFloat(amountStr);
        const [intPart, decimalPart = ''] = amount.toFixed(2).split('.');

        const formattedInt = Number(intPart).toLocaleString('vi-VN');

        if (decimalPart === '00') {
            return `${formattedInt}`;
        } else {
            return `${formattedInt},${decimalPart}`;
        }
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
                    amount: formatAmountForDisplay(updateAllowance.amount),
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
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button 
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowModal(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thêm trợ cấp</h2>
                </div>

                <div className="p-4 m-2 overflow-y-auto max-h-[80vh]">
                    {/* Search Student Section */}
                    <div className='mb-6 relative'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm học viên <span className="text-red-500">*</span>
                        </label>
                        <div 
                            className="relative"
                            ref={searchRef}
                        >
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    placeholder="Nhập tên hoặc email học viên..."
                                    type="text"
                                    className="appearance-none block w-full pl-10 py-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                                    value={search}
                                    onChange={handleOnChangeSearch}
                                />
                            </div>
                            
                            {/* Search Results */}
                            {(() => {
                                if (loading) {
                                    return (
                                        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                            <div className="p-4 flex justify-center">
                                                <LoaderSpinner />
                                            </div>
                                        </div>
                                    );
                                } else if (students) {
                                    return students.length > 0 ? (
                                        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                            <ul className='max-h-60 overflow-y-auto divide-y divide-gray-100'>
                                                {students.map(student => (
                                                    <li key={student.id} className='w-full'>
                                                        <button 
                                                            className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors"
                                                            onClick={() => {
                                                                setAddStudent(student);
                                                                setSearch('');
                                                                setStudents(undefined);
                                                            }}
                                                        >
                                                            <div className="text-left">
                                                                <h3 className="font-medium text-gray-800">{student.name}</h3>
                                                                <p className="text-gray-500 text-sm">{student.email}</p>
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg p-4 text-center text-gray-500">
                                            Không tìm thấy học viên
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>
                    
                    {/* Selected Student Info */}
                    
                        <div className="bg-green-50 rounded-xl p-4 mb-6">
                            <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-[color:var(--color-text)]" />
                                Thông tin học viên
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Tên học viên</span>
                                    <span className="font-medium text-gray-800">{addStudent.name}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-500">Email</span>
                                    <span className="font-medium text-gray-800">{addStudent.email}</span>
                                </div>
                            </div>
                        </div>
                    
                    
                    {/* Form */}
                    <form className="space-y-2">
                        {/* Amount Field */}
                        <div className="form-group">
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                                Số tiền <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faCoins} className="text-gray-400" />
                                </div>
                                <input
                                    placeholder="Nhập số tiền"
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={handleOnChangeAmount}
                                    className={`appearance-none block w-full pl-10 pr-12 py-3 border ${errorAmount ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorAmount ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                    VND
                                </span>
                            </div>
                            <p className='h-5 text-red-500 text-sm mt-1'>{errorAmount}</p>
                        </div>
                        
                        {/* Date Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Month Field */}
                            <div className="form-group">
                                <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tháng <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                    </div>
                                    <input
                                        placeholder="1-12"
                                        type="text"
                                        id="month"
                                        value={month}
                                        onChange={handleOnChangeMonth}
                                        className={`appearance-none block w-full pl-10 py-3 border ${errorMonth ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorMonth ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                    />
                                </div>
                                <p className='h-5 text-red-500 text-sm mt-1'>{errorMonth}</p>
                            </div>
                            
                            {/* Year Field */}
                            <div className="form-group">
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                    Năm <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                    </div>
                                    <input
                                        placeholder="YYYY"
                                        type="text"
                                        id="year"
                                        value={year}
                                        onChange={handleOnChangeYear}
                                        className={`appearance-none block w-full pl-10 py-3 border ${errorYear ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorYear ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                    />
                                </div>
                                <p className='h-5 text-red-500 text-sm mt-1'>{errorYear}</p>
                            </div>
                        </div>
                        
                        {/* Notes Field */}
                        <div className="form-group">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <div className="absolute top-3.5 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faStickyNote} className="text-gray-400" />
                                </div>
                                <textarea
                                    placeholder="Thêm ghi chú (nếu có)"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="appearance-none block w-full py-2 pl-10 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                                />
                            </div>
                        </div>
                        
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        
                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">
                            <button 
                                type="button"
                                onClick={() => setShowModal(false)} 
                                className="inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--border-color-focus)] transition-all duration-200"
                            >
                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={month === '' || year === '' || amount === '' || addStudent?.id === -1 || errorMonth !== '' || errorYear !== '' || errorAmount !== '' || year.length < 4}
                                className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200"
                                onClick={handleOnClickAddAllowance}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
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