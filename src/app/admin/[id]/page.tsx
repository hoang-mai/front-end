'use client'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { course, term } from '@/app/Services/api'
import { del, get } from '@/app/Services/callApi'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoaderLine from '@/app/Components/Loader/loaderLine'
import LoaderTable from '@/app/Components/Loader/loaderTable'
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply, faSearch, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import EditTermModal from './editTermModal';
import TableComponent from '@/app/Components/table';
import EditClassModal from '../class/[id]/editClassModal';
import NoContent from '@/app/Components/noContent';


interface HeadCell {
    id: keyof Course;
    label: string;
}
const termDefault: Term = {
    id: 0,
    nameTerm: '',
    startDate: new Date(),
    endDate: new Date(),
    rosterDeadline: new Date(),
    gradeEntryDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
}
const headCells: HeadCell[] = [
    { id: 'code', label: 'Mã lớp học', },
    { id: 'subjectName', label: 'Tên lớp học', },
    { id: 'enrollLimit', label: 'Số lượng đăng ký tối đa', },
    { id: 'midtermWeight', label: 'Trọng số giữa kỳ', },
    { id: 'createdAt', label: 'Ngày tạo', },
];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa lớp học này không?',
    successMessage: 'Xóa lớp học thành công',
    errorMessage: 'Xóa lớp học thất bại',
    url: course,
}
function convertDataToCourse(data: any): Course {
    return {
        id: data.id,
        code: data.code,
        subjectName: data.subject_name,
        enrollLimit: data.enroll_limit,
        midtermWeight: data.midterm_weight,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        deletedAt: new Date(data.deleted_at),
    }
}
function convertDataToTerm(data: any): Term {
    return {
        id: data.id,
        nameTerm: data.name,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        rosterDeadline: new Date(data.roster_deadline),
        gradeEntryDate: new Date(data.grade_entry_date),
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        deletedAt: new Date(data.deleted_at),
    }
}
function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
export default function TermDetail() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const [termData, setTermData] = useState<Term>(termDefault);
    const [courses, setCourses] = useState<Course[]>([])
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [search, setSearch] = useState<string>('');
    useEffect(() => {
        if (!/^\d+$/.test(params.id)) {
            router.push('/404');
            return;
        }

        get(term + '/' + params.id, {}).then((res) => {
            setTermData(convertDataToTerm(res.data.data));
            setCourses(res.data.data.courses.map((course: any) => convertDataToCourse(course)));
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }).finally(() => setLoading(false));

    }, [params.id]);
    const handleOnConfirmDeleteTerm = () => {
        toast.promise(del(term + '/' + params.id, {}), {
            pending: "Đang xử lý...",
            success: "Xóa kỳ học thành công",
            error: "Xóa kỳ học thất bại"
        }).then(() => {
            setShowModal(false);
            router.push('/admin')
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })

    }
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    if (error) {
        return <div className='text-red-500'>{error}</div>
    }
    return (

        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            {loading ? (
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
                    <LoaderTable />
                </>
            ) : (
                <>
                    <div className="self-start">
                        <Link href="/admin">
                            <FontAwesomeIcon
                                icon={faReply}
                                className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                            />
                        </Link>
                    </div>
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Kỳ học: {termData.nameTerm}</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-blue-500">
                            <h2 className="text-lg font-semibold mb-3 text-blue-600">Ngày bắt đầu</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-500 mr-2" />
                                <p className="font-medium">{formatDate(termData.startDate)}</p>
                            </div>
                        </div>

                        {/* End Date Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-red-500">
                            <h2 className="text-lg font-semibold mb-3 text-red-600">Ngày kết thúc</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-red-500 mr-2" />
                                <p className="font-medium">{formatDate(termData.endDate)}</p>
                            </div>
                        </div>

                        {/* Roster Deadline Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-green-500">
                            <h2 className="text-lg font-semibold mb-3 text-green-600">Hạn đăng ký</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 mr-2" />
                                <p className="font-medium">{formatDate(termData.rosterDeadline)}</p>
                            </div>
                        </div>

                        {/* Grade Entry Date Card */}
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-purple-500">
                            <h2 className="text-lg font-semibold mb-3 text-purple-600">Ngày nhập điểm</h2>
                            <div className="space-y-2 flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-500 mr-2" />
                                <p className="font-medium">{formatDate(termData.gradeEntryDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between mt-6'>
                        <div className='relative'>
                            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                            <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm khóa học...' className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)' />
                        </div>
                        <div className="flex gap-3 shrink-0">
                            <button
                                className="btn-text text-white h-10 px-5 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowEdit(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Chỉnh sửa
                            </button>
                            <button
                                className="bg-red-500 text-white h-10 px-5 rounded-lg flex items-center justify-center shadow-sm hover:bg-red-600 hover:shadow active:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa lớp học
                            </button>
                        </div>
                    </div>
                    {courses.length === 0 ? <NoContent title='Không có lớp học nào' description='Vui lòng thêm lớp học mới' /> :
                        <TableComponent dataCells={courses} headCells={headCells} search={search} onRowClick={(id) => { router.push(`/admin/class/${id}`) }} setDatas={setCourses} EditComponent={EditClassModal} modal={modal} />
                    }
                    <Modal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        className="flex items-center justify-center"
                    >
                        <Box className="p-8 bg-white rounded-xl shadow-lg transform transition-all max-w-md w-full mx-4 animate-[fadeIn_0.3s_ease-in-out]">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa kỳ học</h2>
                                <p className="text-gray-600">Bạn có chắc chắn muốn xóa kỳ học <span className="font-semibold">{termData.nameTerm}</span>? Hành động này không thể hoàn tác.</p>
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                                    onClick={handleOnConfirmDeleteTerm}
                                >
                                    Xác nhận xóa
                                </button>
                            </div>
                        </Box>
                    </Modal>
                    {showEdit &&
                        <EditTermModal
                            data={termData}
                            setData={setTermData}
                            showEdit={showEdit}
                            setShowEdit={setShowEdit}

                        />}
                </>
            )}
        </div>
    )
}