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
import { faReply, faSearch } from "@fortawesome/free-solid-svg-icons";
import EditTermModal from './editTermModal';
import TableComponent from '@/app/Components/table';
import EditClassModal from '../class/[id]/editClassModal';
import { set } from 'date-fns';

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
            {loading  ? (
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
                <><div className="self-start">
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
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Ngày bắt đầu: {formatDate(termData.startDate)}</p>
                        <p>Ngày kết thúc: {formatDate(termData.endDate)}</p>
                        <p>Ngày hạn đăng ký: {formatDate(termData.rosterDeadline)}</p>
                        <p>Ngày nhập điểm: {formatDate(termData.gradeEntryDate)}</p>
                    </div>
                    <div className='flex justify-between'>
                        <div className='relative'>
                            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                            <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
                        </div>
                        <div className='flex justify-end gap-5'>
                            <button className='btn-text text-white h-10 w-30 rounded-lg' onClick={() => setShowEdit(true)}>Chỉnh sửa</button>
                            <button
                                className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                onClick={() => setShowModal(true)}
                            >
                                Xóa học kỳ
                            </button>
                        </div>
                    </div>
                    <TableComponent dataCells={courses} headCells={headCells} search={search} onRowClick={(id) => { router.push(`/admin/class/${id}`) }} setDatas={setCourses} EditComponent={EditClassModal} modal={modal} />
                    <Modal open={showModal} onClose={() => setShowModal(false)}
                        className='flex items-center justify-center'
                    >
                        <Box className="p-8 bg-white rounded-md shadow-md">
                            <h1 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa kỳ học này ?</h1>
                            <div className="flex justify-center gap-10">
                                <button
                                    className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                    onClick={handleOnConfirmDeleteTerm}
                                >
                                    Đồng ý
                                </button>
                                <button

                                    className=' bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 active:bg-gray-500 transition-colors'
                                    onClick={() => setShowModal(false)}
                                >
                                    Không
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