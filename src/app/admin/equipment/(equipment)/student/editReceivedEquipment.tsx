export interface EquipmentType {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Distribution {
    id: number;
    year: number;
    equipmentTypeId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    equipmentType: EquipmentType;
}

export interface EquipmentRecord extends Record<string, unknown> {
    id: number;
    userId: number;
    distributionId: number;
    received: string;
    receivedAt: Date | null;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    distribution: Distribution;
}

import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBoxes, faSave } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { put } from '@/app/Services/callApi';
import { adminEquipmentReceipts } from '@/app/Services/api';
import SelectComponent from '@/app/Components/select';


interface EditReceivedEquipmentProps {
    readonly data: EquipmentRecord;
    readonly showEdit: boolean;
    readonly setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas?: React.Dispatch<React.SetStateAction<(EquipmentRecord)[]>>;
}

interface ErrorResponse {
    [key: string]: string[];
}

function EditReceivedEquipment({
    data,
    showEdit,
    setShowEdit,
    setDatas,
}: EditReceivedEquipmentProps) {
    const [notes, setNotes] = useState<string>(data.notes);
    const [error, setError] = useState<string>('');

    const receivedOptions: Option[] = [
        { id: 1, label: 'Đã nhận' },
        { id: 2, label: 'Chưa nhận' }
    ];

    const defaultReceivedOption: Option = { id: 0, label: 'Chọn trạng thái' };
    const [selectedReceivedOption, setSelectedReceivedOption] = useState<Option>(
        data.received === 'Đã nhận' ? receivedOptions[0] : receivedOptions[1]
    );

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const received = selectedReceivedOption.id === 1;


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
            setDatas?.((prev) =>
                prev.map((record) =>
                    record.id === data.id
                        ? {
                            ...record,
                            received: received ? 'Đã nhận' : 'Chưa nhận',
                            receivedAt: received ? new Date() : null,
                            notes: notes,
                        }
                        : record
                )
            );
            setShowEdit(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    };


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
                    <h2 className='text-center text-2xl font-bold text-white'>Cập nhật thông tin nhận quân tư trang</h2>
                </div>

                <div className="p-6 ">


                    <div className="bg-blue-50 rounded-xl p-4 mb-4">
                        <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                            <FontAwesomeIcon icon={faBoxes} className="mr-2 text-[color:var(--color-text)]" />
                            Thông tin quân tư trang
                        </h3>
                        <div className="flex flex-col gap-2">
                            <p><span className="font-medium">Tên:</span> {data.distribution.equipmentType.name}</p>
                            <p><span className="font-medium">Mô tả:</span> {data.distribution.equipmentType.description}</p>
                            <p><span className="font-medium">Năm phân phối:</span> {data.distribution.year}</p>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="received" className="block text-sm font-medium text-gray-700 mb-1">
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


                        <div className="form-group">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                Ghi chú
                            </label>
                            <div className="relative">
                                <textarea
                                    placeholder="Thêm ghi chú (nếu có)"
                                    id="notes"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                    className="appearance-none block w-full py-2 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center" >
                            <button
                                type="submit"
                                className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200"
                                onClick={handleOnSubmit}
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
                </div>
            </Box>
        </Modal>
    );
}

export default EditReceivedEquipment;