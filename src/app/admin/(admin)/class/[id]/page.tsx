'use client'
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { course } from "@/app/Services/api";
import { del, get } from "@/app/Services/callApi";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { toast } from "react-toastify";
import EditClassModal from "./editClassModal";
interface Class {
    id: number;
    code: string;
    subjectName: string;
    termId: number;
    enrollLimit: string;
    midtermWeight: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    term: {
        id: number;
        name: string;
    }
}
function convertDataToClass(data: any): Class {
    return {
        id: data.id,
        code: data.code,
        subjectName: data.subject_name,
        termId: data.term_id,
        enrollLimit: data.enroll_limit,
        midtermWeight: data.midterm_weight,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        deletedAt: new Date(data.deleted_at),
        term: {
            id: data.term.id,
            name: data.term.name
        }
    }
}
function ClassDetail() {
    const router = useRouter();
    const params = useParams<{ id: string }>()
    const [classDetail, setClassDetail] = useState<Class>();
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    useEffect(() => {
        get(course + '/' + params.id).then(res => {
            setClassDetail(convertDataToClass(res.data.data));
        }).catch(err => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }).finally(() => setReload(false));
    }, [reload, params.id]);
    const handleOnConfirmDeleteClass = () => {
        toast.promise(
            del(course + '/' + params.id),
            {
                pending: "Đang xử lý...",
                success: "Xóa học phần thành công",
                error: "Xóa học phần thất bại",
            }
        ).then(() => {
            setShowModal(false);
            router.push('/admin/class');
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })
    }
    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }
    return (
        <div className='w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            {!classDetail || reload ?
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
                <><div className="self-start">
                    <Link href="/admin/class">
                        <FontAwesomeIcon
                            icon={faReply}
                            className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                        />
                    </Link>
                </div>
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Học phần: {classDetail.subjectName}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Mã học phần: {classDetail.code}</p>
                        <p>Tên học kỳ: {classDetail.term.name}</p>
                        <p>Số lượng đăng ký tối đa: {classDetail.enrollLimit}</p>
                        <p>Trọng số giữa kỳ: {classDetail.midtermWeight}</p>
                    </div>


                    <div className='flex justify-end gap-5'>
                        <button className='btn-text text-white h-10 w-30 rounded-lg' onClick={() => setShowEdit(true)}>Chỉnh sửa</button>
                        <button
                            className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                            onClick={() => setShowModal(true)}
                        >
                            Xóa học phần
                        </button>
                    </div>

                    <Modal open={showModal} onClose={() => setShowModal(false)}
                        className='flex items-center justify-center'
                    >
                        <Box className="p-8 bg-white rounded-md shadow-md">
                            <h1 className="text-lg font-bold mb-4">Bạn có chắc chắn muốn xóa học phần này ?</h1>
                            <div className="flex justify-center gap-10">
                                <button
                                    className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                    onClick={handleOnConfirmDeleteClass}
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
                        <EditClassModal
                            classDetail={classDetail}
                            setReload={setReload}
                            showEdit={showEdit}
                            setShowEdit={setShowEdit}

                        />}
                </>
            }
        </div>
    );
}

export default ClassDetail;