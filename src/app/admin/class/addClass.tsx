'use client';
import { course } from "@/app/Services/api";
import { post } from "@/app/Services/callApi";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface AddClassProps {
    readonly id: number | string;
    readonly label: string;
    readonly setDatas: any;
    readonly setShowModal: Dispatch<SetStateAction<boolean>>;
    readonly showModal: boolean;
}
function convertDataToClass(data: any): Course {
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
    }
}
function AddClass({
    id,
    label,
    setDatas,
    setShowModal,
    showModal,
}: AddClassProps) {

    const [subjectName, setSubjectName] = useState<string>('');
    const [enrollLimit, setEnrollLimit] = useState<string>('60');
    const [midtermWeight, setMidtermWeight] = useState<string>('0.5');
    const [errorMidtermWeight, setErrorMidtermWeight] = useState<string>('');
    const [errorEnrollLimit, setErrorEnrollLimit] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handelOnChangeNameClass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubjectName(e.target.value);
    }
    const handelOnChangeEnrollLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();


        if (value === '') {
            setErrorEnrollLimit('Trường này không được để trống');
            setEnrollLimit('');
            return;
        }

        const validFormat = /^[1-9]\d*$/;

        if (!validFormat.test(value)) {
            setErrorEnrollLimit('Chỉ nhập số nguyên dương');
            return;
        }

        setErrorEnrollLimit('');
        setEnrollLimit(value);
    };

    const handelOnChangeMidtermWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();


        if (value === '') {
            setErrorMidtermWeight('Trường này không được để trống');
            setMidtermWeight('');
            return;
        }

        const validFormat = /^0(\.\d{0,2})?$|^1$/;

        if (!validFormat.test(value)) {
            setErrorMidtermWeight('Chỉ nhập giá trị từ 0 đến 1, có tối đa 2 chữ số sau dấu phẩy');
            return;
        }

        setErrorMidtermWeight('');
        setMidtermWeight(value);
    };

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            post(course, { subject_name: subjectName, enroll_limit: enrollLimit, midterm_weight: midtermWeight, term_id: id })
                .then((res) => {
                    setError('');
                    setSubjectName('');
                    setEnrollLimit('60');
                    setMidtermWeight('0.5');
                    console.log(res.data.data);
                    setDatas((prev: any) => [...prev, convertDataToClass(res.data.data)]);
                    setShowModal(false);
                }),
            {
                pending: "Đang xử lý...",
                success: "Tạo lớp học thành công",
                error: "Tạo lớp học thất bại",
            }
        ).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }
        )
    }
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] h-[70%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thêm lớp học</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className="w-full flex justify-center ">
                    <form action="" className="lg:w-150 w-120 lg:px-16 md:px-8" >
                        <div className="flex flex-row my-4">
                            <label htmlFor="name" className="mr-2">Tên học kỳ:</label>
                            <p> {label}</p>
                        </div>
                        <div className="flex flex-col relative mb-4">
                            <label htmlFor="name" className="">Tên lớp học (<span className='text-red-500'>*</span>)</label>
                            <input
                                placeholder='Tên lớp học'
                                value={subjectName}
                                onChange={handelOnChangeNameClass}
                                type="text"
                                id="name"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                            />

                        </div>
                        <div className="flex flex-col relative">
                            <label htmlFor="enrollLimit" className="">Số lượng đăng ký tối đa (<span className='text-red-500'>*</span>)</label>
                            <input
                                placeholder='Số lượng đăng ký tối đa'
                                value={enrollLimit}
                                onChange={handelOnChangeEnrollLimit}
                                type="text"
                                id="enrollLimit"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className='h-5 text-red-500 text-sm'>{errorEnrollLimit}</p>
                        </div>
                        <div className="flex flex-col relative ">
                            <label htmlFor="midtermWeight" className="">Trọng số giữa kỳ (<span className='text-red-500'>*</span>)</label>
                            <input
                                placeholder='Trọng số giữa kỳ'
                                value={midtermWeight}
                                onChange={handelOnChangeMidtermWeight}
                                type="text"
                                id="midtermWeight"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className='h-5 text-red-500 text-sm'>{errorMidtermWeight}</p>
                        </div>

                        <p className='h-5 text-red-500 text-sm my-2 h-fit'>{error}</p>
                        <div className='flex items-center justify-center'>
                            <button
                                onClick={handleOnSubmit}
                                disabled={!subjectName || !enrollLimit || !midtermWeight || !!errorMidtermWeight || !!errorEnrollLimit}
                                type="submit"
                                className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Tạo lớp học
                            </button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}

export default AddClass;