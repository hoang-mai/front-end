'use client'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSave, faStickyNote, faCalendar, faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import DatePickerComponent from "@/app/Components/datePicker";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { managerViolations } from "@/app/Services/api";
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns/format';

interface Violation {
    id: number;
    studentId: number;
    managerId: number;
    violationName: string;
    violationDate: Date;
    createdAt: Date;
    updatedAt: Date;
    isEditable: boolean;
    managerName: string;
    managerEmail: string;
    studentName: string;
    studentEmail: string;
    studentImage: string | null;
}

interface EditViolationModalProps {
    readonly data: Violation;
    readonly showEdit: boolean;
    readonly setDatas?: Dispatch<SetStateAction<Violation[]>>;
    readonly setShowEdit: (show: boolean) => void;
}

function EditViolationModal({ data, showEdit, setDatas, setShowEdit }: EditViolationModalProps) {
    const [violationName, setViolationName] = useState<string>(data.violationName);
    const [violationDate, setViolationDate] = useState<Date | null>(new Date(data.violationDate));
    const [errorDate, setErrorDate] = useState<string>('');
    const [error, setError] = useState<string>('');



    const handleDateChange = (date: Date) => {
        if (date > new Date()) {
            setErrorDate("Ngày vi phạm không được lớn hơn ngày hiện tại!");
            return;
        }
        setErrorDate("");
        setViolationDate(date);
        
    };

    const handleViolationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViolationName(e.target.value);
        
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        toast.promise(
            put(`${managerViolations}/${data.id}`, {
                violation_name: violationName,
                violation_date: violationDate ? format(violationDate, 'yyyy-MM-dd') : null,
            }), {
            pending: "Đang xử lý...",
            success: "Cập nhật vi phạm thành công",
            error: "Cập nhật vi phạm thất bại",
        }
        ).then((res) => {
            if (setDatas) {
                setDatas((prev) => prev.map((item) =>
                    item.id === data.id ? {
                        ...item,
                        violationName: violationName,
                        violationDate: violationDate ?? item.violationDate,
                        updatedAt: new Date(res.data.data.updated_at),
                    } : item
                ));
            }
        

            setShowEdit(false);
        }).catch((err) => {
            
                const firstValue = Object.values(err.errors as Record<string, string[]>)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
        });
    };

    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center"
        >
            <Box className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[color:var(--background-button)] p-4 relative">
                    <button
                        className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                        onClick={() => setShowEdit(false)}
                        aria-label="Đóng"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className="text-center text-xl font-bold text-white">Chỉnh sửa vi phạm</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Student Info Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Học viên
                        </label>
                        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4 border border-green-200">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {data.studentImage ? (
                                    <img
                                        src={data.studentImage}
                                        alt={data.studentName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <PersonIcon className="text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{data.studentName}</h3>
                                <p className="text-gray-600 text-sm">{data.studentEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Manager Info Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Người quản lý
                        </label>
                        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4 border border-green-200">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUserTie} className="text-gray-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{data.managerName}</h3>
                                <p className="text-gray-600 text-sm">{data.managerEmail}</p>
                            </div>
                        </div>
                    </div>

                    {/* Violation Name Field */}
                    <div className="space-y-2">
                        <label htmlFor="violationName" className="block text-sm font-medium text-gray-700">
                            Tên vi phạm <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FontAwesomeIcon icon={faStickyNote} className="text-gray-400" />
                            </div>
                            <input
                                id="violationName"
                                name="violationName"
                                placeholder="Nhập tên vi phạm"
                                type="text"
                                value={violationName}
                                onChange={handleViolationNameChange}
                                className={`appearance-none block w-full pl-10 py-2.5 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                            />
                        </div>
                        
                    </div>

                    {/* Violation Date Field */}
                    <div className="space-y-2 flex flex-col ">
                        <label htmlFor="violationDate" className="block text-sm font-medium text-gray-700">
                            Ngày vi phạm <span className="text-red-500">*</span>
                        </label>
                        
                            <DatePickerComponent
                                value={violationDate}
                                onChange={handleDateChange}
                                lgWidth="w-full"
                            />
                        
                        
                            <p className="h-5 text-sm text-red-600">{error || errorDate}</p>

                    </div>

                   
                    {/* Action buttons */}
                    <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button
                            disabled={!violationDate || !!errorDate}
                            type="submit"
                            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Cập nhật
                        </button>
                        <button
                                onClick={() => setShowEdit(false)}
                                className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                                <FontAwesomeIcon icon={faXmark} className="mr-2" />
                                Hủy
                            </button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default EditViolationModal;