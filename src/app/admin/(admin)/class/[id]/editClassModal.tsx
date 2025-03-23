'use client'
import { SetStateAction, Dispatch, useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { put } from '@/app/Services/callApi';
import { course } from '@/app/Services/api';
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
interface EditClassModalProps {
    readonly data: Class;
    readonly showEdit: boolean;
    readonly setReload: Dispatch<SetStateAction<boolean>>;
    readonly setShowEdit: (show: boolean) => void;
}
function EditClassModal({
    data,
    setReload,
    showEdit,
    setShowEdit,
}: EditClassModalProps) {
    const [subjectName, setSubjectName] = useState<string>(data.subjectName);
    const [enrollLimit, setEnrollLimit] = useState<string>(data.enrollLimit);
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
                success: "Chỉnh sửa học phần thành công",
                error: "Chỉnh sửa học phần thất bại",
            }
        ).then(() => {
            setReload(true);
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
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[90%] xl:h-[60%] h-[70%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa học phần</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <form action="" className="space-y-4">
                    <div className="flex flex-row items-center mb-7">
                        <label htmlFor="name" className="w-1/3 text-left pr-4 relative bottom-2">Tên học phần</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Tên học phần"
                                value={subjectName}
                                onChange={handleOnChangeSubjectName}
                                type="text"
                                id="name"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="enrollLimit" className="w-1/3 text-left pr-4 relative bottom-4">Số lượng đăng ký tối đa</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Số lượng đăng ký tối đa"
                                value={enrollLimit}
                                onChange={handelOnChangeEnrollLimit}
                                type="text"
                                id="enrollLimit"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className="h-5 text-red-500 text-sm">{errorEnrollLimit}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="midtermWeight" className="w-1/3 text-left pr-4 relative bottom-4">Trọng số giữa kỳ</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Trọng số giữa kỳ"
                                value={midtermWeight}
                                onChange={handelOnChangeMidtermWeight}
                                type="text"
                                id="midtermWeight"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className="h-5 text-red-500 text-sm">{errorMidtermWeight}</p>
                        </div>
                    </div>
                    <p className="h-5 text-red-500 text-sm my-2">{error}</p>
                </form>

                <div className='flex justify-center gap-4 w-full mt-4'>
                    <button disabled={!subjectName || !enrollLimit || !midtermWeight} className='btn-text text-white w-20 h-10 rounded-lg' onClick={handleOnSubmit}>Lưu</button>
                    <button className='bg-red-700 text-white w-20 h-10 rounded-lg hover:bg-red-800 active:bg-red-900' onClick={() => setShowEdit(false)}>Hủy</button>
                </div>
            </Box>
        </Modal>
    );
}

export default EditClassModal;