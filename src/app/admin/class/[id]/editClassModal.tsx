'use client'
import { SetStateAction, Dispatch, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { toast } from 'react-toastify';
import { put } from '@/app/Services/callApi';
import { course } from '@/app/Services/api';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import BalanceIcon from '@mui/icons-material/Balance';

interface EditClassModalProps {
    readonly data: Course;
    readonly showEdit: boolean;
    readonly setDatas?: Dispatch<SetStateAction<Course[]>>;
    readonly setData?: Dispatch<SetStateAction<Course>>;
    readonly setShowEdit: (show: boolean) => void;
}
function EditClassModal({
    data,
    setDatas,
    setData,
    showEdit,
    setShowEdit,
}: EditClassModalProps) {
    const [subjectName, setSubjectName] = useState<string>(data.subjectName);
    const [enrollLimit, setEnrollLimit] = useState<string>(String(data.enrollLimit));
    const [midtermWeight, setMidtermWeight] = useState<string>(data.midtermWeight);
    const [errorEnrollLimit, setErrorEnrollLimit] = useState<string>('');
    const [errorMidtermWeight, setErrorMidtermWeight] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handleOnChangeSubjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        const validFormat = /^0(\.\d{0,2})?$|^1(\.0{0,2})?$/;

        if (!validFormat.test(value)) {
            setErrorMidtermWeight('Chỉ nhập giá trị từ 0 đến 1, có tối đa 2 chữ số sau dấu phẩy');
            return;
        }
        setErrorMidtermWeight('');
        setMidtermWeight(value);
    }
    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            put(course + '/' + data.id, {
                subject_name: subjectName,
                enroll_limit: enrollLimit,
                midterm_weight: midtermWeight
            }),
            {
                pending: "Đang xử lý...",
                success: "Chỉnh sửa lớp học thành công",
                error: "Chỉnh sửa lớp học thất bại",
            }
        ).then(() => {
            setDatas?.((prev) => prev.map((course) =>
                    course.id === data.id
                        ? {
                              ...course,
                              subjectName,
                              enrollLimit: Number(enrollLimit),
                              midtermWeight,
                          }
                        : course
                )
            );
            setData?.({
                ...data,
                subjectName,
                enrollLimit: Number(enrollLimit),
                midtermWeight,
            });
            setShowEdit(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })
    }
    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] w-[95%] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden'>
                <div className='bg-[var(--color-text)] text-white p-5 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Chỉnh sửa lớp học</h2>
                    <button 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className='p-6 custom-scrollbar overflow-y-auto max-h-[calc(90vh-130px)]'>
                    <form action="" className="space-y-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <SchoolIcon />
                                <label htmlFor="name" className="font-medium">Tên lớp học <span className='text-red-500'>*</span></label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder="Tên lớp học"
                                    value={subjectName}
                                    onChange={handleOnChangeSubjectName}
                                    type="text"
                                    id="name"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <GroupIcon />
                                <label htmlFor="enrollLimit" className="font-medium">Số lượng đăng ký tối đa <span className='text-red-500'>*</span></label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder="Số lượng đăng ký tối đa"
                                    value={enrollLimit}
                                    onChange={handelOnChangeEnrollLimit}
                                    type="text"
                                    id="enrollLimit"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                                {errorEnrollLimit && (
                                    <p className="mt-1 text-red-500 text-sm">{errorEnrollLimit}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <BalanceIcon />
                                <label htmlFor="midtermWeight" className="font-medium">Trọng số giữa kỳ <span className='text-red-500'>*</span></label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder="Trọng số giữa kỳ"
                                    value={midtermWeight}
                                    onChange={handelOnChangeMidtermWeight}
                                    type="text"
                                    id="midtermWeight"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                                {errorMidtermWeight && (
                                    <p className="mt-1 text-red-500 text-sm">{errorMidtermWeight}</p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className='bg-gray-50 p-5 flex justify-center gap-4 border-t'>
                    <button 
                        disabled={!subjectName || !enrollLimit || !midtermWeight} 
                        className='btn-text text-white py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60'
                        onClick={handleOnSubmit}
                    >
                        <SaveIcon fontSize="small" />
                        <span>Lưu</span>
                    </button>
                    <button 
                        className='bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 active:bg-red-800 flex items-center gap-2 transition-colors duration-200' 
                        onClick={() => setShowEdit(false)}
                    >
                        <CancelIcon fontSize="small" />
                        <span>Hủy</span>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default EditClassModal;