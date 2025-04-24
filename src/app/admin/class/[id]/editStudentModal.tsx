'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { Box, Modal } from "@mui/material";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { useParams } from "next/navigation";
import { course } from "@/app/Services/api";
import PersonIcon from '@mui/icons-material/Person';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faEnvelope, faGraduationCap, faPenToSquare, faClipboard, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    image: string | null;
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

    const handleOnChangeNotes = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
    }

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
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
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    }

    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Chỉnh sửa điểm</h2>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(100vh-100px)]">
                    <div className="bg-green-50 rounded-xl p-4 mb-4">
                        <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-[color:var(--color-text)]" />
                            Thông tin học viên
                        </h3>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {data.image ? (
                                    <img
                                        src={data.image}
                                        alt={data.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <PersonIcon className="text-gray-500" />
                                )}
                            </div>
                            <div className="text-left">
                                <h3>{data.name}</h3>
                                <p className="text-gray-500 text-sm">{data.email}</p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="midtermGrade" className="block text-sm font-medium text-gray-700 mb-1">
                                    Điểm giữa kỳ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400" />
                                    </div>
                                    <input
                                        placeholder="Điểm giữa kỳ"
                                        value={midtermGrade}
                                        onChange={handelOnChangeMidtermGrade}
                                        type="text"
                                        id="midtermGrade"
                                        className="appearance-none block w-full pl-10 py-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                                    />
                                </div>
                                <p className="h-5 text-red-500 text-sm mt-1">{errorMidtermGrade}</p>
                            </div>

                            <div className="form-group">
                                <label htmlFor="finalGrade" className="block text-sm font-medium text-gray-700 mb-1">
                                    Điểm cuối kỳ <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faGraduationCap} className="text-gray-400" />
                                    </div>
                                    <input
                                        placeholder="Điểm cuối kỳ"
                                        value={finalGrade}
                                        onChange={handelOnChangeFinalGrade}
                                        type="text"
                                        id="finalGrade"
                                        className="appearance-none block w-full pl-10 py-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                                    />
                                </div>
                                <p className="h-5 text-red-500 text-sm mt-1">{errorFinalGrade}</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="totalGrade" className="block text-sm font-medium text-gray-700 mb-1">
                                Điểm tổng kết
                            </label>
                            <div className="relative">
                                <div className="absolute top-4 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faPenToSquare} className="text-gray-400" />
                                </div>
                                <div className="bg-gray-100 border rounded-lg w-full py-3 pl-10 px-4 text-gray-700">
                                    {midtermGrade && finalGrade ?
                                        (Number(midTermWeight) * Number(midtermGrade) + (1 - Number(midTermWeight)) * Number(finalGrade)).toFixed(2)
                                        : "Chưa có điểm"}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Điểm tổng kết = {midTermWeight} × Điểm giữa kỳ + {(1 - Number(midTermWeight)).toFixed(2)} × Điểm cuối kỳ</p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 pointer-events-none">
                                    <FontAwesomeIcon icon={faClipboard} className="text-gray-400" />
                                </div>
                                <textarea
                                    placeholder="Thêm ghi chú (nếu có)"
                                    value={notes}
                                    onChange={handleOnChangeNotes}
                                    id="notes"
                                    rows={4}
                                    className="resize-none appearance-none block w-full pl-10 py-2 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                                >
                                </textarea>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">
                            <button
                                className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 w-full sm:w-auto"
                                onClick={handleOnSubmit}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Lưu thay đổi
                            </button>
                            <button
                                onClick={() => setShowEdit(false)}
                                className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                                <FontAwesomeIcon icon={faTimes} className="mr-2" />
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}

export default EditStudentModal;