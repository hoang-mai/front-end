'use client';
import { course } from "@/app/Services/api";
import { post } from "@/app/Services/callApi";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BalanceIcon from '@mui/icons-material/Balance';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
                    setDatas((prev: any) => [convertDataToClass(res.data.data), ...prev]);
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
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] w-[95%] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden'>
                <div className='bg-[var(--color-text)] text-white p-5 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Thêm lớp học</h2>
                    <button
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => setShowModal(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className='p-6 custom-scrollbar overflow-y-auto max-h-[calc(90vh-130px)]'>
                    <form action="" className="space-y-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <CalendarMonthIcon />
                                <label htmlFor="termName" className="font-medium">Tên học kỳ</label>
                            </div>
                            <div className="md:w-2/3">
                                <p id="termName" className="py-2">{label}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <SchoolIcon />
                                <label htmlFor="name" className="font-medium">
                                    Tên lớp học <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Tên lớp học'
                                    value={subjectName}
                                    onChange={handelOnChangeNameClass}
                                    type="text"
                                    id="name"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <GroupIcon />
                                <label htmlFor="enrollLimit" className="font-medium">
                                    Số lượng đăng ký tối đa <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Số lượng đăng ký tối đa'
                                    value={enrollLimit}
                                    onChange={handelOnChangeEnrollLimit}
                                    type="text"
                                    id="enrollLimit"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />

                                <p className="h-5 mt-1 text-red-500 text-sm">{errorEnrollLimit}</p>

                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <BalanceIcon />
                                <label htmlFor="midtermWeight" className="font-medium">
                                    Trọng số giữa kỳ <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Trọng số giữa kỳ'
                                    value={midtermWeight}
                                    onChange={handelOnChangeMidtermWeight}
                                    type="text"
                                    id="midtermWeight"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />

                                <p className="h-5 mt-1 text-red-500 text-sm">{errorMidtermWeight}</p>

                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-2" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                        )}
                    </form>
                </div>

                <div className='bg-gray-50 p-5 flex justify-center gap-4 border-t'>
                    <button
                        onClick={handleOnSubmit}
                        disabled={!subjectName || !enrollLimit || !midtermWeight || !!errorMidtermWeight || !!errorEnrollLimit}
                        type="submit"
                        className='btn-text text-white py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60'
                    >
                        <SaveIcon fontSize="small" />
                        <span>Tạo lớp học</span>
                    </button>
                    <button
                        className='bg-red-600  text-white py-2 px-6 rounded-lg hover:bg-red-700  active:bg-red-800 flex items-center gap-2 transition-colors duration-200'
                        onClick={() => setShowModal(false)}
                    >
                        <CancelIcon fontSize="small" />
                        <span>Hủy</span>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default AddClass;