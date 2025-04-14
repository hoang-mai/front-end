'use client'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/app/hooks/useDebounce';
import { managerSearchStudent, managerViolations } from '@/app/Services/api';
import { post } from '@/app/Services/callApi';
import LoaderSpinner from '@/app/Components/Loader/loaderSpinner';
import DatePickerComponent from '@/app/Components/datePicker';
import { set } from 'date-fns';
import { toast } from 'react-toastify';
interface Student {
    id: number;
    name: string;
    email: string;
}
interface AddViolationProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setReRender: React.Dispatch<React.SetStateAction<boolean>>;
    readonly studentId?: number;
    
}

function AddViolation({ showModal, setShowModal, setReRender, studentId }: AddViolationProps) {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery = useDebounce<string>(search, 500, setLoading);
    const [students, setStudents] = useState<Student[] | undefined>();
    const [addStudent, setAddStudent] = useState<Student>({ id: -1, name: 'Không có', email: 'Không có' });
    const [error, setError] = useState<string>('');
    const [violationName, setViolationName] = useState<string>('');
    const [violationDate, setViolationDate] = useState<Date | null>(null);

    const [errorViolationDate, setErrorViolationDate] = useState<string>('');
    const handleOnChangeViolationDate = (date: Date) => {
        if (date > new Date()) {
            setErrorViolationDate('Ngày vi phạm không được sau ngày hiện tại!');
            setViolationDate(null);
            return;
        }

        setErrorViolationDate('');
        setViolationDate(date);
    }
    const handleOnChangeViolationName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViolationName(e.target.value);
    }
    const searchRef = useRef<HTMLDivElement>(null);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value === '') {
            setStudents(undefined);
        }
    }
    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            toast.promise(post(managerViolations, {
                student_id: addStudent.id,
                violation_name: violationName,
                violation_date: violationDate,
            }), {
                pending: "Đang xử lý...",
                success: "Thêm vi phạm thành công",
                error: "Thêm vi phạm thất bại",
            }).then((res) => {
                if (studentId === addStudent.id) {
                    setReRender(true);
                }

                setShowModal(false);
            }).catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            });
        }
    useEffect(() => {
        if (debouncedQuery) {
            post(managerSearchStudent, { query: debouncedQuery }).then(res => {
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
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] h-fit w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thêm vi phạm</h2>
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
                            <label htmlFor="violationName" className="w-1/3 text-left pr-4 ">Tên vi phạm:</label>
                            <div className="flex flex-col w-2/3">
                                <input
                                    placeholder="Tên vi phạm"
                                    type="text"
                                    id="violationName"
                                    value={violationName}
                                    onChange={handleOnChangeViolationName}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="violationDate" className="w-1/3 text-left pr-4 ">Ngày vi phạm:</label>
                            <div className="flex flex-col w-2/3">
                                <DatePickerComponent value={violationDate} onChange={handleOnChangeViolationDate} />
                                <p className='h-5 text-red-500 text-sm'>{errorViolationDate}</p>
                            </div>
                        </div>
                        <p className='h-5 text-red-500 text-sm my-2 '>{error}</p>
                    <div className='flex items-center justify-center'>
                        <button
                            onClick={handleOnSubmit}
                            disabled={ addStudent?.id === -1 || !violationName || !violationDate}
                            type="submit"
                            className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Tạo vi phạm
                        </button>
                    </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}

export default AddViolation;