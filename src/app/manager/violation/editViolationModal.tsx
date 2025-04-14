import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import DatePickerComponent from "@/app/Components/datePicker";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { managerViolations } from "@/app/Services/api";
interface Violation extends Record<string, any> {
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
}
interface EditViolationModalProps {
    data: Violation;
    showEdit: boolean;
    setDatas?: Dispatch<SetStateAction<Violation[]>>;
    setData?: Dispatch<SetStateAction<Violation>>;
    setShowEdit: (show: boolean) => void;
}

function EditViolationModal({ data, showEdit, setDatas, setData, setShowEdit }: EditViolationModalProps) {
    const [violationName, setViolationName] = useState<string>(data.violationName);
    const [violationDate, setViolationDate] = useState<Date | null>(data.violationDate);
    const [error, setError] = useState<string>('');
    const [errorViolationDate, setErrorViolationDate] = useState<string>('');
    const handleOnChangeViolationDate = (date: Date) => {
        if (date > new Date()) {
            setErrorViolationDate('Ngày vi phạm không được sau ngày hiện tại!');
            setViolationDate(null);
            return;
        }

        setErrorViolationDate('');
        setViolationDate(date);
    }
    const handleOnChangeViolationName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setViolationName(e.target.value);
    }

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                toast.promise(put(managerViolations + '/' + data.id, {
                    
                    violation_name: violationName,
                    violation_date: violationDate,
                }), {
                    pending: "Đang xử lý...",
                    success: "Cập nhật vi phạm thành công",
                    error: "Cập nhật vi phạm thất bại",
                }).then((res) => {
                    setDatas?.((prev) => prev.map((item) => 
                            item.id === data.id ? {
                                    ...item,
                                    violationName: violationName,
                                    violationDate: violationDate ?? item.violationDate,
                                    updatedAt: new Date(res.data.data.updated_at),
                                }
                            : item
                    ));
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
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[90%] h-[65%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa vi phạm</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <form action="" className=" space-y-4 flex-1 w-full" >
                        <div className="flex flex-row  ">
                            <label htmlFor="name" className="w-1/3 text-left pr-4 ">Mã học viên:</label>
                            <div className="flex flex-row w-2/3">
                                <p>{data?.studentId}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="email" className="w-1/3 text-left pr-4 ">Tên quản lý: </label>
                            <div className="flex flex-row w-2/3">
                                <p>{data?.managerName}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="email" className="w-1/3 text-left pr-4 ">Email quản lý: </label>
                            <div className="flex flex-row w-2/3">
                                <p>{data?.managerEmail}</p>
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="violationName" className="w-1/3 text-left pr-4 ">Tên vi phạm:</label>
                            <div className="flex flex-col w-2/3">
                                <input
                                    placeholder="Tên vi phạm"
                                    type="text"
                                    id="violationName"
                                    value={violationName}
                                    onChange={handleOnChangeViolationName}
                                    className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                />
                            </div>
                        </div>
                        <div className="flex flex-row ">
                            <label htmlFor="violationDate" className="w-1/3 text-left pr-4 ">Ngày vi phạm:</label>
                            <div className="flex flex-col w-2/3">
                                <DatePickerComponent value={violationDate} onChange={handleOnChangeViolationDate} />
                                <p className='h-5 text-red-500 text-sm'>{errorViolationDate}</p>
                            </div>
                        </div>
                        <p className='h-5 text-red-500 text-sm my-2 '>{error}</p>
                    <div className='flex items-center justify-center'>
                        <button
                            onClick={handleOnSubmit}
                            disabled={ !violationName || !violationDate}
                            type="submit"
                            className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Cập nhật vi phạm
                        </button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}

export default EditViolationModal;