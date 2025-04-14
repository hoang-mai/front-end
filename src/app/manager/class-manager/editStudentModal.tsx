import { Dispatch, SetStateAction, useState } from "react";
import { Box, Modal } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { useParams } from "next/navigation";
import { adminClasses, managerClasses, managerClassStudents } from "@/app/Services/api";
import SelectComponent from "@/app/Components/select";

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    reason: string | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
}
interface EditStudentModalProps {
    readonly data: Student;
    readonly showEdit: boolean;
    readonly setDatas: Dispatch<SetStateAction<Student[]>>;
    readonly setShowEdit: Dispatch<SetStateAction<boolean>>;
}
const optionRole:Option[] = [
    { id: 'student', label: 'Học viên' },
    { id: 'monitor', label: 'Lớp trưởng' },
    { id: 'vice_monitor', label: 'Lớp phó ' },

]
const optionStatus:Option[] = [
    { id: 'active', label: 'Hoạt động' },
    { id: 'suspended', label: 'Đình chỉ' },
]
function convertStringToRole(role: string): Option {
    switch (role) {
        case 'Học viên':
            return { id: 'student', label: 'Học viên' };
        case 'Lớp trưởng':
            return { id: 'monitor', label: 'Lớp trưởng' };
        case 'Lớp phó':
            return { id: 'vice_monitor', label: 'Lớp phó' };
        default:
            return { id: 'student', label: 'Học viên' };
    }
}
function convertStringToStatus(status: string): Option {
    switch (status) {
        case 'Hoạt động':
            return { id: 'active', label: 'Hoạt động' };
        case 'Đình chỉ':
            return { id: 'suspended', label: 'Đình chỉ' };
        default:
            return { id: 'active', label: 'Hoạt động' };
    }
}
function EditStudentModal({
    data,
    showEdit,
    setDatas,
    setShowEdit,
}: EditStudentModalProps) {
    const params = useParams<{ id: string }>();
    const [selectedRole, setSelectedRole] = useState<Option>(convertStringToRole(data.role));
    const [selectedStatus, setSelectedStatus] = useState<Option>(convertStringToStatus(data.status));
    const [reason, setReason] = useState<string>(data.reason ?? '');
    const [note, setNote] = useState<string>(data.note ?? '');
    const [error, setError] = useState<string>('');
    const handleOnChangeReason = (e: React.ChangeEvent<HTMLInputElement>) => {
        setReason(e.target.value);
    }
    const handleOnChangeNote = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    }
    const handleOnSubmit = () => {

        toast.promise(
            put(managerClassStudents + '/' + data.id , {
                role: selectedRole.id,
                status: selectedStatus.id,
                reason,
                note,
            }), {
            pending: "Đang xử lý...",
            success: "Chỉnh sửa thông tin học viên thành công",
            error: "Chỉnh sửa thông tin học viên thất bại"
        }).then(() => {
            setDatas((prev) => prev.map((student) => {
                if (student.id !== data.id) return student;

                return {
                    ...student,
                    role: selectedRole.label,
                    status: selectedStatus.label,
                    reason,
                    note,
                }
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
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa thông tin học viên</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <form action="" className="space-y-4 flex-1">
                    <div className="flex flex-row items-center">
                        <label htmlFor="name" className="w-1/3 text-left pr-4 ">Tên học viên</label>
                        <div className="flex flex-col w-2/3">
                            <p>{data.name}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="email" className="w-1/3 text-left pr-4 ">Email</label>
                        <div className="flex flex-col w-2/3">
                            <p>{data.email}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="role" className="w-1/3 text-left pr-4 relative bottom-2">Vai trò</label>
                        <div className="flex flex-col w-2/3">
                            <SelectComponent selected={selectedRole} setSelected={setSelectedRole} options={optionRole} defaultOption={{ id: 'student', label: 'Học viên' }} width="w-full" />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="status" className="w-1/3 text-left pr-4 relative bottom-2">Trạng thái</label>
                        <div className="flex flex-col w-2/3">
                            <SelectComponent selected={selectedStatus} setSelected={setSelectedStatus} options={optionStatus} defaultOption={{ id: 'active', label: 'Hoạt động' }} width="w-full" />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="reason" className="w-1/3 text-left pr-4 relative bottom-2">Lý do</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Lý do"
                                value={reason}
                                onChange={handleOnChangeReason}
                                type="text"
                                id="reason"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                        </div>
                    </div>
                    <div className="flex flex-row items-center">
                        <label htmlFor="note" className="w-1/3 text-left pr-4 relative bottom-2">Ghi chú</label>
                        <div className="flex flex-col w-2/3">
                            <input
                                placeholder="Ghi chú"
                                value={note}
                                onChange={handleOnChangeNote}
                                type="text"
                                id="note"
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