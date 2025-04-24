'use client';
import { adminEquipmentType } from "@/app/Services/api";
import { put } from "@/app/Services/callApi";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface EquipmentType extends Record<string, any> {
    id: number,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}
interface EditEquipmentTypeProps {
    readonly data: EquipmentType;
    readonly showEdit: boolean;
    readonly setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas?: React.Dispatch<React.SetStateAction<EquipmentType[]>>;
}

function convertDataToEquipment(data: any) {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    }
}

function EditEquipment({ data, showEdit, setShowEdit, setDatas }: EditEquipmentTypeProps) {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (data) {
            setName(data.name);
            setDescription(data.description || '');
        }
    }, [data]);

    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleOnChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    }

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            put(`${adminEquipmentType}/${data.id}`, { name: name, description: description })
                .then((res) => {
                    if (setDatas) {
                        setDatas((prev: EquipmentType[]) => prev.map((item) => 
                            item.id === data.id ? convertDataToEquipment(res.data.data) : item
                        ));
                    }
                    setShowEdit(false);
                }),
            {
                pending: "Đang xử lý...",
                success: "Cập nhật quân tư trang thành công",
                error: "Cập nhật quân tư trang thất bại",
            }
        ).catch((err) => {
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
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] w-[95%] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden'>
                <div className='bg-[var(--color-text)] text-white p-5 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Chỉnh sửa quân tư trang</h2>
                    <button 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className='p-6 custom-scrollbar overflow-y-auto max-h-[calc(90vh-130px)]'>
                    <form action="" className="space-y-5">
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <CategoryIcon />
                                <label htmlFor="name" className="font-medium">
                                    Tên quân tư trang <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Tên quân tư trang'
                                    value={name}
                                    onChange={handleOnChangeName}
                                    type="text"
                                    id="name"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <DescriptionIcon />
                                <label htmlFor="description" className="font-medium">
                                    Mô tả
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <textarea
                                    style={{ resize: 'none' }}
                                    placeholder='Mô tả quân tư trang'
                                    value={description}
                                    onChange={handleOnChangeDescription}
                                    id="description"
                                    rows={4}
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                ></textarea>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}
                    </form>
                </div>

                <div className='bg-gray-50 p-5 flex justify-center gap-4 border-t'>
                    <button
                        onClick={handleOnSubmit}
                        disabled={!name}
                        type="submit"
                        className='btn-text text-white py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60'
                    >
                        <SaveIcon fontSize="small" />
                        <span>Cập nhật</span>
                    </button>
                    <button 
                        className='bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 active:bg-red-800 flex items-center gap-2 transition-colors duration-200' 
                        onClick={() => setShowEdit(false)}
                    >
                        <CancelIcon fontSize="small" />
                        <span>Hủy</span>
                    </button>
                </div>
            </Box>
        </Modal>
    );
}

export default EditEquipment;