'use client'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { term } from '@/app/Services/api'
import { del, get } from '@/app/Services/callApi'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import LoaderLine from '@/app/Components/Loader/loaderLine'
import LoaderTable from '@/app/Components/Loader/loaderTable'
import { toast } from 'react-toastify';
interface Courses {
    id: number;
    name: string;
    code: string;
    credit: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
interface Term {
    id: number;
    nameTerm: string;
    startDate: Date;
    endDate: Date;
    rosterDeadline: Date;
    gradeEntryDate: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    courses: Courses[];
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
        courses: data.courses
    }
}
function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
export default function TermDetail() {
    const router =useRouter();
    const params = useParams<{ id: string }>()
    const [termData, setTermData] = useState<Term>();
    const [error, setError] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    useEffect(() => {
        get(term + '/' + params.id, {}).then((res) => {
            setTermData(convertDataToTerm(res.data.data));
        }).catch((err) => {
            setError(err.message);
        })
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
            setError(err.message);
        })

    }
    if (error) {
        return <div className='text-red-500'>{error}</div>
    }
    return (
        <div className='w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            {!termData ? (
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
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Kỳ học: {termData.nameTerm}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Ngày bắt đầu: {formatDate(termData.startDate)}</p>
                        <p>Ngày kết thúc: {formatDate(termData.endDate)}</p>
                        <p>Ngày hạn đăng ký: {formatDate(termData.rosterDeadline)}</p>
                        <p>Ngày nhập điểm: {formatDate(termData.gradeEntryDate)}</p>
                    </div>
                    <div className='flex justify-end'>
                        <button
                            className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                            onClick={() => setShowModal(true)}
                        >
                            Xóa học kỳ
                        </button>
                    </div>
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
                </>
            )}
        </div>
    )
}