'use client'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faXmark, faSearch, faStickyNote, faSave, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import useDebounce from '@/app/hooks/useDebounce';
import { managerSearchStudent, managerViolations } from '@/app/Services/api';
import { post } from '@/app/Services/callApi';
import LoaderSpinner from '@/app/Components/Loader/loaderSpinner';
import DatePickerComponent from '@/app/Components/datePicker';
import { toast } from 'react-toastify';
import PersonIcon from '@mui/icons-material/Person';
import { format } from 'date-fns';

interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

interface AddViolationProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas: any;
    readonly preSelectedStudent: Student;
}

function AddViolation({ showModal, setShowModal, setDatas, preSelectedStudent }: AddViolationProps) {


    // Form states
    const [violationName, setViolationName] = useState<string>('');
    const [violationDate, setViolationDate] = useState<Date | null>(null);
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
            post(managerViolations, {
                student_id: preSelectedStudent.id,
                violation_name: violationName,
                violation_date: violationDate ? format(violationDate, 'yyyy-MM-dd') : null,
            }), {
            pending: "Đang xử lý...",
            success: "Thêm vi phạm thành công",
            error: "Thêm vi phạm thất bại",
        }
        ).then((res) => {
            setDatas((prev: any) => {
                return [ {
                    student_id: preSelectedStudent.id,
                    studentName: preSelectedStudent.name,
                    studentEmail: preSelectedStudent.email,
                    studentImage: preSelectedStudent.image,
                    id : res.data.data.id,
                    violationName: violationName,
                    violationDate: violationDate,
                    managerName: res.data.data.manager_name,
                    managerEmail: res.data.data.manager_email,
                    updatedAt: new Date(),
                }, ...prev]
            });
            setShowModal(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as Record<string, string[]>)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    };



    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center"
        >
            <Box className="w-full max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-[color:var(--background-button)] p-4 relative">
                    <button
                        className="absolute right-4 top-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200"
                        onClick={() => setShowModal(false)}
                        aria-label="Đóng"
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className="text-center text-xl font-bold text-white">Thêm vi phạm</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Student Selection Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Học viên <span className="text-red-500">*</span>
                        </label>
                        <div className="bg-green-50 rounded-lg p-4 flex items-center gap-4 border border-green-200">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                {preSelectedStudent.image ? (
                                    <img
                                        src={preSelectedStudent.image}
                                        alt={preSelectedStudent.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <PersonIcon className="text-gray-500" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-medium">{preSelectedStudent.name}</h3>
                                <p className="text-gray-600 text-sm">{preSelectedStudent.email}</p>
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
                                
                            />
                        
                        <p className="h-5 mt-1 text-red-500 text-sm">{error || errorDate}</p>
                    </div>



                    {/* Action buttons */}
                    <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3 items-center justify-center">
                        <button
                            disabled={!violationDate || !!errorDate}
                            type="submit"
                            className="inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <FontAwesomeIcon icon={faSave} className="mr-2" />
                            Tạo vi phạm
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
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

export default AddViolation;