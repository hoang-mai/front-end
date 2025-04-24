'use client'
import { course, studentCourses } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faReply, faSearch, faGraduationCap, faUser, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoaderLine from "@/app/Components/Loader/loaderLine";
import Image from "next/image";
import StudentDetail from "./studentDetail";


interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string | null;
    image: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}
interface Course {
    id: number;
    code: string;
    subjectName: string;
    termId: number;
    enrollLimit: number;
    midtermWeight: string;
    currentStudentCount: number;
    createdAt: Date | null;
    updatedAt: Date | null;
    termName: string | null;
}
function convertDataToStudent(data: any): Student {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        image: data.image,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    }
}


function convertDataToClass(data: any): Course {
    return {
        id: data.id,
        code: data.code,
        subjectName: data.subject_name,
        termId: data.term_id,
        enrollLimit: data.enroll_limit,
        midtermWeight: data.midterm_weight,
        currentStudentCount: data.current_student_count,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        termName: data.term.name,
    }
}

const courseDefault: Course = {
    id: 0,
    code: '',
    subjectName: '',
    termId: 0,
    enrollLimit: 0,
    midtermWeight: '',
    currentStudentCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    termName: null,
}

function ClassDetail() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [classDetail, setClassDetail] = useState<Course>(courseDefault);
    const [loading, setLoading] = useState<boolean>(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showStudentDetail, setShowStudentDetail] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student>();

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        get(studentCourses + '/' + params.id).then(res => {
            setClassDetail(convertDataToClass(res.data.data));
            setStudents(res.data.data.students.map((student: any) => convertDataToStudent(student)));
        }).catch(err => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }).finally(() => setLoading(false));
    }, [params.id]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase())
    );

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            {loading ?
                <>
                    <div className='w-full flex justify-center items-center mb-10'>
                        <LoaderLine height='h-7' width='w-50' />
                    </div>
                    <div className='w-full flex flex-row gap-20 '>
                        <LoaderLine width='w-1/2' height='h-5' />
                        <LoaderLine width='w-1/2' height='h-5' />
                    </div>
                    <div className='w-full flex flex-row gap-20 mb-10'>
                        <LoaderLine width='w-1/2' height='h-5' />
                        <LoaderLine width='w-1/2' height='h-5' />
                    </div>

                </>
                :
                <>
                    <div className="self-start">
                        <button onClick={() => router.back()}>
                            <FontAwesomeIcon
                                icon={faReply}
                                className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                            />
                        </button>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Lớp học: {classDetail.subjectName}</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Course Code Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-blue-500">
                            <h2 className="text-lg font-semibold mb-3 text-blue-600">Mã lớp học</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500 mr-2" />
                                <p className="font-medium">{classDetail.code}</p>
                            </div>
                        </div>

                        {/* Term Name Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-green-500">
                            <h2 className="text-lg font-semibold mb-3 text-green-600">Kỳ học</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-green-500 mr-2" />
                                <p className="font-medium">{classDetail.termName}</p>
                            </div>
                        </div>

                        {/* Enrollment Limit Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-purple-500">
                            <h2 className="text-lg font-semibold mb-3 text-purple-600">Số lượng học viên</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faUser} className="text-purple-500 mr-2" />
                                <p className="font-medium">{classDetail.currentStudentCount}</p>
                            </div>
                        </div>

                        {/* Midterm Weight Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-red-500">
                            <h2 className="text-lg font-semibold mb-3 text-red-600">Trọng số giữa kỳ</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-red-500 mr-2" />
                                <p className="font-medium">{classDetail.midtermWeight}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <div className='relative'>
                            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                            <input
                                value={search}
                                onChange={handleOnChangeSearch}
                                type='text'
                                placeholder='Tìm kiếm học viên...'
                                className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)'
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-4">Danh sách học viên</h2>

                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg">
                                <p className="text-gray-500">Không tìm thấy học viên nào</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                                {filteredStudents.map(student => (
                                    <button
                                        key={student.id}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => {
                                            setSelectedStudent(student);
                                            setShowStudentDetail(true);
                                        }}
                                    >
                                        <div className="p-3 flex flex-col items-center">
                                            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
                                                {student.image ? (
                                                    <Image
                                                        src={student.image}
                                                        alt={student.name}
                                                        width={56}
                                                        height={56}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-xl" />
                                                )}
                                            </div>

                                            <h3 className="font-medium text-sm text-center line-clamp-1">{student.name}</h3>

                                            <div className="flex items-center mt-1 text-xs text-gray-600">
                                                <FontAwesomeIcon icon={faEnvelope} className="mr-1 text-gray-400" />
                                                <span className="truncate max-w-[120px]">{student.email}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {showStudentDetail && selectedStudent &&
                        <StudentDetail
                            student={selectedStudent}
                            showDetail={showStudentDetail}
                            setShowDetail={setShowStudentDetail}
                        />
                    }
                </>
            }
        </div>
    );
}

export default ClassDetail;