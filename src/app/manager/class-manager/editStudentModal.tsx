import { Dispatch, SetStateAction, useState } from "react";
import { Box, Modal } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faUser, faEnvelope, faUserTag, faToggleOn, faClipboard, faNoteSticky, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { useParams } from "next/navigation";
import { managerClassStudents } from "@/app/Services/api";
import SelectComponent from "@/app/Components/select";
import PersonIcon from '@mui/icons-material/Person';

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    image: string | null;
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
const optionRole: Option[] = [
    { id: 'student', label: 'Học viên' },
    { id: 'monitor', label: 'Lớp trưởng' },
    { id: 'vice_monitor', label: 'Lớp phó ' },

]
const optionStatus: Option[] = [
    { id: 'active', label: 'Đang học' },
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
        case 'Đang học':
            return { id: 'active', label: 'Đang học' };
        case 'Đình chỉ':
            return { id: 'suspended', label: 'Đình chỉ' };
        default:
            return { id: 'active', label: 'Đang học' };
    }
}
function EditStudentModal({
    data,
    showEdit,
    setDatas,
    setShowEdit,
}: EditStudentModalProps) {

    const [selectedRole, setSelectedRole] = useState<Option>(convertStringToRole(data.role));
    const [selectedStatus, setSelectedStatus] = useState<Option>(convertStringToStatus(data.status));
    const [reason, setReason] = useState<string>(data.reason ?? '');
    const [note, setNote] = useState<string>(data.note ?? '');
    const [error, setError] = useState<string>('');

    const prevRole = convertStringToRole(data.role);
    const prevStatus = convertStringToStatus(data.status);
    const prevReason = data.reason;
    const prevNote = data.note;

    const handleOnChangeReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReason(e.target.value);
    }

    const handleOnChangeNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNote(e.target.value);
    }

    const handleOnSubmit = async () => {
        try {
            if (prevStatus.id !== selectedStatus.id || prevReason !== reason || prevNote !== note) {
                await put(`${managerClassStudents}/${data.id}`, {
                    status: selectedStatus.id,
                    reason,
                    note,
                });
            }

            if (prevRole.id !== selectedRole.id) {
                let assignRole = selectedRole.id;
                switch (selectedRole.id) {
                    case 'student':
                        assignRole = 'assign-student';
                        break;
                    case 'monitor':
                        assignRole = 'assign-monitor';
                        break;
                    case 'vice_monitor':
                        assignRole = 'assign-vice-monitor';
                        break;
                }
                await put(`${managerClassStudents}/${data.id}/${assignRole}`, {});
            }

            toast.success("Chỉnh sửa thông tin học viên thành công");

            setDatas((prev) =>
                prev.map((student) => {
                    if (student.id !== data.id) return student;
                    return {
                        ...student,
                        role: selectedRole.label,
                        status: selectedStatus.label,
                        reason,
                        note,
                    };
                })
            );
            setShowEdit(false);
        } catch (err: any) {
            const firstValue =
                Object.values(err.errors as ErrorResponse)?.[0]?.[0] ?? "Có lỗi xảy ra!";
            toast.error("Chỉnh sửa thông tin học viên thất bại");
            setError(firstValue);
        }
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
                    <h2 className='text-center text-2xl font-bold text-white'>Chỉnh sửa thông tin học viên</h2>
                </div>

                <div className="p-6">
                    <div className="bg-green-50 rounded-xl p-4 mb-4">
                        <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-[color:var(--color-text)]" />
                            Thông tin học viên
                        </h3>
                        <div className="flex items-center gap-3">
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
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                    Vai trò <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUserTag} className="text-gray-400" />
                                    </div>
                                    <div className="pl-10">
                                        <SelectComponent
                                            selected={selectedRole}
                                            setSelected={setSelectedRole}
                                            options={optionRole}
                                            defaultOption={{ id: 'student', label: 'Học viên' }}
                                            width="w-full"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faToggleOn} className="text-gray-400" />
                                    </div>
                                    <div className="pl-10">
                                        <SelectComponent
                                            selected={selectedStatus}
                                            setSelected={setSelectedStatus}
                                            options={optionStatus}
                                            defaultOption={{ id: 'active', label: 'Đang học' }}
                                            width="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                                    Lý do
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faClipboard} className="text-gray-400" />
                                    </div>
                                    <textarea
                                        placeholder="Nhập lý do"
                                        value={reason}
                                        onChange={handleOnChangeReason}
                                        id="reason"
                                        rows={4}
                                        className="appearance-none block w-full pl-10 py-2 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ghi chú
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none">
                                        <FontAwesomeIcon icon={faNoteSticky} className="text-gray-400" />
                                    </div>
                                    <textarea
                                        placeholder="Nhập ghi chú"
                                        value={note}
                                        onChange={handleOnChangeNote}
                                        id="note"
                                        rows={4}
                                        className="appearance-none block w-full pl-10 py-2 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">

                            <button
                                type="button"
                                className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 w-full sm:w-auto"
                                onClick={handleOnSubmit}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Lưu thay đổi
                            </button>
                            <button
                                onClick={() => setShowEdit(false)}
                                className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                                <FontAwesomeIcon icon={faXmark} className="mr-2" />
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