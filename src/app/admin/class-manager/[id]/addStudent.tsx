
'use client'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSearch, faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import useDebounce from '@/app/hooks/useDebounce';
import { post } from '@/app/Services/callApi';
import { adminClasses, searchStudent } from '@/app/Services/api';
import LoaderSpinner from '@/app/Components/Loader/loaderSpinner';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}
interface StudentToClass extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    image: string | null;
    status: string;
    reason: string | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface AddStudentProps {
    readonly setStudentToClass: Dispatch<SetStateAction<StudentToClass[]>>;
    readonly classId: number;
    readonly showAddStudent: boolean;
    readonly setShowAddStudent: Dispatch<SetStateAction<boolean>>;
}
function AddStudent({
    classId,
    setStudentToClass,
    showAddStudent,
    setShowAddStudent
}: AddStudentProps) {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery = useDebounce<string>(search, 500, setLoading);
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
            post(adminClasses + '/' + classId + '/' + 'students/bulk', { student_ids: addStudents.map(s => s.id) }),
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

            setStudentToClass((prev: Student[]) => {
                const updatedStudents = res.data.data.success.map((item: any) => {
                    const student = addStudents.find(s => s.id === item.id);
                    return student
                        && {
                        ...student,
                        note: '',
                        role: 'Học viên',
                        status: 'Đang học',
                        reason: null,
                    };
                });
                console.log(updatedStudents);
                return [...prev, ...updatedStudents];
            });

            if (res.data.data.failed.length > 0) {
                const failed = res.data.data.failed;

                const groupedErrors: Record<string, string[]> = {};

                failed.forEach((item: any) => {
                    if (!groupedErrors[item.message]) {
                        groupedErrors[item.message] = [];
                    }
                    groupedErrors[item.message].push(item.name);
                });

                const errorMessages = Object.entries(groupedErrors)
                    .map(([message, names]) => `${names.join(', ')}: ${message}`)
                    .join('\n');

                setError(errorMessages);

            } else {
                setShowAddStudent(false);
            }
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
    }, [debouncedQuery]);
    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearch('');
                setLoading(false);
                setStudents(undefined);
            }
        };
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        };
    }, [searchRef]);

    return (
        <Modal
            open={showAddStudent}
            onClose={() => setShowAddStudent(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] h-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowAddStudent(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thêm học viên</h2>
                </div>

                <div className="p-4 m-2 overflow-y-auto max-h-[80vh]">
                    {/* Search Student Section */}
                    <div className='mb-6 relative'>                        <label htmlFor="studentSearch" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    id="studentSearch"
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
                                                            className={`w-full flex items-center p-3 hover:bg-gray-50 transition-colors ${addStudents.some(s => s.id === student.id) ? 'bg-blue-50' : ''
                                                                }`}
                                                            onClick={() => {
                                                                // Toggle student selection
                                                                const isSelected = addStudents.some(s => s.id === student.id);
                                                                if (isSelected) {
                                                                    setAddStudents(addStudents.filter(s => s.id !== student.id));
                                                                } else {
                                                                    setAddStudents([...addStudents, student]);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex items-center w-full">
                                                                <div className={`w-6 h-6 flex items-center justify-center rounded mr-3 ${addStudents.some(s => s.id === student.id)
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'border border-gray-300'
                                                                    }`}>
                                                                    {addStudents.some(s => s.id === student.id) && (
                                                                        <FontAwesomeIcon icon={faUser} className="text-xs" />
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                                        {student.image && student.image !== 'default' ? (
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
                                                                        <h3>{student.name}</h3>
                                                                        <p className="text-gray-500 text-sm">{student.email}</p>
                                                                    </div>
                                                                </div>
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

                    {/* Selected Students Display */}
                    {addStudents.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-4 mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center'>
                                    <FontAwesomeIcon icon={faUsers} className="mr-2 text-[color:var(--color-text)]" />
                                    Học viên đã chọn ({addStudents.length})
                                </h3>
                            </div>
                            <div className="max-h-40 overflow-y-auto">
                                {addStudents.map(student => (
                                    <div key={student.id} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {student.image && student.image !== 'default' ? (
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
                                                <h3>{student.name}</h3>
                                                <p className="text-gray-500 text-sm">{student.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setAddStudents(addStudents.filter(s => s.id !== student.id))}
                                            className="text-red-600 hover:text-red-700 p-1"
                                            title="Xóa khỏi danh sách"
                                        >
                                            <FontAwesomeIcon icon={faXmark} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">
                        <button
                            type="button"
                            disabled={addStudents.length === 0}
                            className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200"
                            onClick={handleOnClickAddStudent}
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Thêm học viên
                        </button>
                        <button
                            onClick={() => setShowAddStudent(false)}
                            className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center"
                        >
                            <FontAwesomeIcon icon={faXmark} className="mr-2" />
                            Hủy
                        </button>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

export default AddStudent;