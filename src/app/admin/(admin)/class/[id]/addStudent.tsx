
'use client'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useDebounce from '@/app/hooks/useDebounce';
import { post } from '@/app/Services/callApi';
import { course, searchStudent } from '@/app/Services/api';
import LoaderSpinner from '@/app/Components/Loader/loaderSpinner';
import { toast } from 'react-toastify';

interface Student {
    id: number;
    name: string;
    email: string;
}
interface AddStudentToCourse extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    midtermGrade: string;
    finalGrade: string;
    totalGrade: string;
    status: string;
    notes: string;
}

interface AddStudentProps {
    readonly setAddStudentsToCourse: Dispatch<SetStateAction<AddStudentToCourse[]>>;
    readonly classId: number;
    readonly showAddStudent: boolean;
    readonly setShowAddStudent: Dispatch<SetStateAction<boolean>>;
}
function AddStudent({
    classId,
    setAddStudentsToCourse,
    showAddStudent,
    setShowAddStudent
}: AddStudentProps) {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery = useDebounce<string>(search, 1000, setLoading);
    const [students, setStudents] = useState<Student[] | undefined>();
    const [addStudents, setAddStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string>('');
    const searchRef = useRef<HTMLDivElement>(null);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value === '') {
            setStudents(undefined);
        }
    }
    const handleOnClickAddStudent = () => {
        if (addStudents.length === 0) {
            toast.error('Chưa chọn học viên');
            return;
        }
        toast.promise(
            post(course + '/' + classId + '/' + 'students/bulk', { student_ids: addStudents.map(s => s.id) }),
            {
                pending: 'Đang thêm học viên',
                success: {
                    render({ data }) {
                        return data.data.message;
                    },
                },
                error: 'Thêm học viên thất bại'
            }
        ).then((res) => {
            
            setAddStudentsToCourse((prev: AddStudentToCourse[]) => {
                const updatedStudents = res.data.data.success.map((studentId: number) => {
                    const student = addStudents.find(s => s.id === studentId);
                    return student
                        && {
                              ...student,
                              midtermGrade: '',
                              finalGrade: '',
                              totalGrade: '',
                              status: 'Đã đăng ký',
                              notes: ''
                          };
                });

                return [...prev, ...updatedStudents];
            });
            setShowAddStudent(false);
        }).catch((err) => {
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
            open={showAddStudent}
            onClose={() => setShowAddStudent(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] h-[80%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thêm học viên</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowAddStudent(false);
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
                                                            if (addStudents.find(s => s.id === student.id)) {
                                                                return;
                                                            }
                                                            setAddStudents([...addStudents, student]);
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
                <div className="flex flex-col mt-4 flex-1 overflow-y-auto">
                    <h1 className='text-lg font-semibold text-(--color-text) '>Danh sách học viên đã chọn</h1>
                    <ul className={`${addStudents.length > 0 && 'rounded-lg p-2 bg-white'}`}>
                        {addStudents.map(student => (
                            <li key={student.id} className='w-full'>
                                <div className="flex items-center justify-between p-2 cursor-pointer">
                                    <div className="text-left">
                                        <h3>{student.name}</h3>
                                        <p className="text-gray-500 text-sm">{student.email}</p>
                                    </div>
                                    <button className="p-2"
                                        onClick={() => {
                                            setAddStudents(addStudents.filter(s => s.id !== student.id));
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} className="text-gray-500 " />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className='h-5 text-red-500 text-sm mt-2'>{error}</p>
                <div className='flex justify-center gap-4 w-full mt-4'>
                    <button className='btn-text text-white p-2 rounded-lg w-40'
                        onClick={handleOnClickAddStudent}
                    >
                        Thêm học viên
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default AddStudent;