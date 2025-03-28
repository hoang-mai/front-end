import { Dispatch, SetStateAction, useState } from "react";
import { Box, Modal } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { useParams } from "next/navigation";
import { course } from "@/app/Services/api";

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    midtermGrade: string;
    finalGrade: string;
    totalGrade: string;
    status: string;
    notes: string;
}
interface EditStudentModalProps {
    readonly data: Student;
    readonly showEdit: boolean;
    readonly setDatas: Dispatch<SetStateAction<Student[]>>;
    readonly setShowEdit: Dispatch<SetStateAction<boolean>>;
    readonly midTermWeight?: string;
}
function EditStudentModal({
    data,
    showEdit,
    setDatas,
    setShowEdit,
    midTermWeight,
}: EditStudentModalProps) {
    const params = useParams<{ id: string }>();
    const [midtermGrade, setMidtermGrade] = useState<string>(data.midtermGrade);
    const [finalGrade, setFinalGrade] = useState<string>(data.finalGrade);
    const [notes, setNotes] = useState<string>(data.notes);
    const [errorMidtermGrade, setErrorMidtermGrade] = useState<string>('');
    const [errorFinalGrade, setErrorFinalGrade] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handelOnChangeMidtermGrade = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();
        if (value === '') {
            setErrorMidtermGrade('');
            setMidtermGrade('');
            return;
        }
        const validFormat = /^(10(\.0{0,2})?|\d(\.\d{0,2})?)$/;
        if (!validFormat.test(value)) {
            setErrorMidtermGrade('Chỉ nhập số từ 0-10, tối đa 2 chữ số thập phân');
            return;
        }
        
        setErrorMidtermGrade('');
        setMidtermGrade(value);
    }
    const handelOnChangeFinalGrade = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();
        if (value === '') {
            setErrorFinalGrade('');
            setFinalGrade('');
            return;
        }
        const validFormat = /^(10(\.0{0,2})?|\d(\.\d{0,2})?)$/;
        if (!validFormat.test(value)) {
            setErrorFinalGrade('Chỉ nhập số từ 0-10, tối đa 2 chữ số thập phân');
            return;
        }
        setErrorFinalGrade('');
        setFinalGrade(value);
    }
    const handleOnChangeNotes = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotes(e.target.value);
    }
    const handleOnSubmit = () => {

        toast.promise(
            put(course + '/' + params.id + '/students/' + data.id + '/grade', {
                midterm_grade: midtermGrade,

                final_grade: finalGrade,
                notes: notes
            }), {
            pending: "Đang xử lý...",
            success: "Chỉnh sửa điểm thành công",
            error: "Chỉnh sửa điểm thất bại"
        }).then(() => {
            setDatas((prev) => prev.map((student) => {
                if (student.id !== data.id) return student;

                const midterm = Number(midtermGrade);
                const final = Number(finalGrade);
                const weight = Number(midTermWeight);
                const total = (weight * midterm + (1 - weight) * final).toFixed(2);
                const status = Number(total) >= 4 ? 'Hoàn thành' : 'Trượt';

                return {
                    ...student,
                    midtermGrade,
                    finalGrade,
                    totalGrade: total.toString(),
                    notes,
                    status,
                };
            }));
            setShowEdit(false);
        }
        ).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }

        )
    }
    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[90%]  h-[80%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa điểm</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <form action="" className="space-y-4 flex-1">
                    <div className="flex flex-row items-center ">
                        <label htmlFor="name" className="w-1/3 text-left pr-4 ">Tên học viên</label>
                        <div className="flex flex-col w-2/3">
                            <p>{data.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="enrollLimit" className="w-1/3 text-left pr-4 ">Email</label>
                        <div className="flex flex-col w-2/3">
                            <p>{data.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="midtermWeight" className="w-1/3 text-left pr-4 relative bottom-2">Điểm giữa kỳ</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Điểm giữa kỳ"
                                value={midtermGrade}
                                onChange={handelOnChangeMidtermGrade}
                                type="text"
                                id="midtermWeight"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className="h-5 text-red-500 text-sm">{errorMidtermGrade}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="midtermWeight" className="w-1/3 text-left pr-4 relative bottom-2">Điểm cuối kỳ</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Điểm cuối kỳ"
                                value={finalGrade}
                                onChange={handelOnChangeFinalGrade}
                                type="text"
                                id="midtermWeight"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className="h-5 text-red-500 text-sm">{errorFinalGrade}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="midtermWeight" className="w-1/3 text-left pr-4 relative bottom-2">Ghi chú</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Ghi chú"
                                value={notes}
                                onChange={handleOnChangeNotes}
                                type="text"
                                id="midtermWeight"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                        </div>
                    </div>
                    <p className="h-5 text-red-500 text-sm my-2">{error}</p>
                </form>

                <div className='flex justify-center gap-4 w-full mt-4'>
                    <button className='btn-text text-white w-20 h-10 rounded-lg' onClick={handleOnSubmit}>Lưu</button>
                    <button className='bg-red-700 text-white w-20 h-10 rounded-lg hover:bg-red-800 active:bg-red-900' onClick={() => setShowEdit(false)}>Hủy</button>
                </div>
            </Box>
        </Modal>
    );
}

export default EditStudentModal;