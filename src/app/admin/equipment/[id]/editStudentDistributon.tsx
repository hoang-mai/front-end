interface StudentReceipt extends Record<string, any> {
    id: number;
    received: string;
    receivedAt: Date | null;
    notes: string;
    studentId: number;
    studentName: string;
    studentEmail: string;
    studentCode: string | null;
}

import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faSave, faInfoCircle, faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { put } from '@/app/Services/callApi';
import { adminEquipmentReceipts } from '@/app/Services/api';
import SelectComponent from '@/app/Components/select';



interface EditReceivedEquipmentProps {
    readonly data: StudentReceipt;
    readonly showEdit: boolean;
    readonly setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas?: React.Dispatch<React.SetStateAction<(StudentReceipt)[]>>;
    readonly setReload?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ErrorResponse {
    [key: string]: string[];
}

function EditReceivedEquipment({
    data,
    showEdit,
    setShowEdit,
    setReload,

}: EditReceivedEquipmentProps) {
    const [notes, setNotes] = useState<string>(data.notes || '');
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const receivedOptions: Option[] = [
        { id: 1, label: 'Đã nhận' },
        { id: 2, label: 'Chưa nhận' }
    ];

    const defaultReceivedOption: Option = { id: 0, label: 'Chọn trạng thái' };
    const [selectedReceivedOption, setSelectedReceivedOption] = useState<Option>(
        data.received === 'Đã nhận' ? receivedOptions[0] : receivedOptions[1]
    );

    // Reset form state when data changes
    useEffect(() => {
        setNotes(data.notes || '');
        setSelectedReceivedOption(data.received === 'Đã nhận' ? receivedOptions[0] : receivedOptions[1]);
        setError('');
    }, [data]);

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError('');
        
        // Validate form
        if (selectedReceivedOption.id === 0) {
            setError('Vui lòng chọn trạng thái nhận quân tư trang');
            return;
        }

        const received = selectedReceivedOption.id === 1;
        setIsSubmitting(true);

        toast.promise(
            put(`${adminEquipmentReceipts}/${data.id}`, {
                notes: notes,
                received: received,
            }),
            {
                pending: 'Đang cập nhật thông tin nhận quân tư trang',
                success: 'Cập nhật thông tin nhận quân tư trang thành công',
                error: 'Cập nhật thông tin nhận quân tư trang thất bại',
            }
        ).then(() => {
            if (setReload) setReload(prev => !prev);
            setShowEdit(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }).finally(() => {
            setIsSubmitting(false);
        });
    };

    return (
        <Modal
            open={showEdit}
            onClose={() => !isSubmitting && setShowEdit(false)}
            className="flex items-center justify-center"
        >
            <Box className="xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className='bg-[color:var(--background-button)] p-5 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => !isSubmitting && setShowEdit(false)}
                        disabled={isSubmitting}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Cập nhật thông tin nhận quân tư trang</h2>
                </div>

                <div className="p-6">
                    {/* Student Info Section */}
                    <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 mb-6 shadow-sm border border-blue-100">
                        <h3 className='text-lg font-semibold text-(--color-text) flex items-center mb-3'>
                            <FontAwesomeIcon icon={faUserGraduate} className="mr-2" />
                            Thông tin sinh viên
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <p><span className="font-medium text-gray-700">Họ tên:</span> {data.studentName}</p>
                            <p><span className="font-medium text-gray-700">Email:</span> {data.studentEmail}</p>
                        </div>
                    </div>

                

                    <form className="space-y-5">
                        {/* Status Selection */}
                        <div className="form-group">
                            <label htmlFor="received" className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái <span className="text-red-500">*</span>
                            </label>
                            <SelectComponent
                                selected={selectedReceivedOption}
                                setSelected={setSelectedReceivedOption}
                                options={receivedOptions}
                                defaultOption={defaultReceivedOption}
                                width="w-full"
                            />
                        </div>

                        {/* Notes Section */}
                        <div className="form-group">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <textarea
                                    placeholder="Thêm ghi chú (nếu có)"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={3}
                                    className="appearance-none block w-full py-2 px-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 resize-none bg-white"
                                />
                                {notes && (
                                    <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                        {notes.length} ký tự
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg relative animate-fadeIn" role="alert">
                                <div className="flex items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-gray-200 mt-6 items-center justify-center">
                            <button
                                type="submit"
                                className={`inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                onClick={handleOnSubmit}
                                disabled={isSubmitting}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                {isSubmitting ? 'Đang lưu...' : 'Cập nhật'}
                            </button>
                            <button
                                type="button"
                                onClick={() => !isSubmitting && setShowEdit(false)}
                                disabled={isSubmitting}
                                className={`inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-700 hover:bg-red-800 active:bg-red-900 transition-all duration-200 shadow-md hover:shadow-lg`}
                            >
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

export default EditReceivedEquipment;