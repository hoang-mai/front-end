'use client';

import { useState } from "react";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { put } from "@/app/Services/callApi";
import { adminFitnessTest } from "@/app/Services/api";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

interface FitnessTest extends Record<string, any> {
    id: number,
    name: string,
    unit: string,
    higherIsBetter: string,
    createdAt: Date,
    updatedAt: Date,
    thresholdsExcellentThreshold: string,
    thresholdsGoodThreshold: string,
    thresholdsPassThreshold: string,
}

interface EditPracticeProps {
    readonly data: FitnessTest;
    readonly showEdit: boolean;
    readonly setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas?: React.Dispatch<React.SetStateAction<FitnessTest[]>>;
}

function EditPractice({
    data,
    showEdit,
    setShowEdit,
    setDatas,

}: EditPracticeProps) {
    // Form values
    const [name, setName] = useState<string>(data.name);
    const [unit, setUnit] = useState<string>(data.unit);
    const [higherIsBetter, setHigherIsBetter] = useState<boolean>(data.higherIsBetter === "Có");
    const [excellentThreshold, setExcellentThreshold] = useState<string>(data.thresholdsExcellentThreshold);
    const [goodThreshold, setGoodThreshold] = useState<string>(data.thresholdsGoodThreshold);
    const [passThreshold, setPassThreshold] = useState<string>(data.thresholdsPassThreshold);
    
    // Error states
    const [errorExcellentThreshold, setErrorExcellentThreshold] = useState<string>('');
    const [errorGoodThreshold, setErrorGoodThreshold] = useState<string>('');
    const [errorPassThreshold, setErrorPassThreshold] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const handleOnChangeUnit = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUnit(e.target.value);
    }

    const handleOnChangeHigherIsBetter = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHigherIsBetter(e.target.checked);
    }

    const validateThreshold = (value: string): boolean => {
        if (value === '') {
            return false;
        }

        const validFormat = /^-?\d+(\.\d+)?$/;
        return validFormat.test(value);
    };

    const handleOnChangeExcellentThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        if (value === '') {
            setErrorExcellentThreshold('Trường này không được để trống');
            setExcellentThreshold('');
            return;
        }

        if (!validateThreshold(value)) {
            setErrorExcellentThreshold('Giá trị không hợp lệ');
            return;
        }

        setErrorExcellentThreshold('');
        setExcellentThreshold(value);
    };

    const handleOnChangeGoodThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        if (value === '') {
            setErrorGoodThreshold('Trường này không được để trống');
            setGoodThreshold('');
            return;
        }

        if (!validateThreshold(value)) {
            setErrorGoodThreshold('Giá trị không hợp lệ');
            return;
        }

        setErrorGoodThreshold('');
        setGoodThreshold(value);
    };

    const handleOnChangePassThreshold = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();

        if (value === '') {
            setErrorPassThreshold('Trường này không được để trống');
            setPassThreshold('');
            return;
        }

        if (!validateThreshold(value)) {
            setErrorPassThreshold('Giá trị không hợp lệ');
            return;
        }

        setErrorPassThreshold('');
        setPassThreshold(value);
    };

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            put(adminFitnessTest + '/' + data.id, { 
                name: name, 
                unit: unit, 
                higher_is_better: higherIsBetter,
                excellent_threshold: parseFloat(excellentThreshold),
                good_threshold: parseFloat(goodThreshold),
                pass_threshold: parseFloat(passThreshold)
            }),
            {
                pending: "Đang cập nhật bài kiểm tra thể lực...",
                success: "Cập nhật bài kiểm tra thể lực thành công",
                error: "Cập nhật bài kiểm tra thể lực thất bại",
            }
        ).then((res) => {
            setDatas?.((prev) => prev.map((item) => 
                item.id === data.id 
                    ? { 
                        ...item, 
                        name: name,
                        unit: unit,
                        higherIsBetter: higherIsBetter ? "Có" : "Không",
                        thresholdsExcellentThreshold: excellentThreshold,
                        thresholdsGoodThreshold: goodThreshold,
                        thresholdsPassThreshold: passThreshold,
                        updatedAt: new Date()
                    } 
                    : item
            ));

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
            <Box className='xl:w-[50%] lg:w-[70%] md:w-[90%] w-[95%]  bg-white rounded-xl shadow-2xl overflow-hidden'>
                <div className='bg-[var(--color-text)] text-white p-5 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Chỉnh sửa bài kiểm tra thể lực</h2>
                    <button 
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className='p-6 overflow-y-auto max-h-[calc(90vh-130px)]'>
                    <form action="" className="space-y-5">
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <FitnessCenterIcon />
                                <label htmlFor="name" className="font-medium">
                                    Tên bài kiểm tra <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Tên bài kiểm tra'
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
                                <SpeedIcon />
                                <label htmlFor="unit" className="font-medium">
                                    Đơn vị đo <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Đơn vị đo'
                                    value={unit}
                                    onChange={handleOnChangeUnit}
                                    type="text"
                                    id="unit"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                {higherIsBetter ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                <label htmlFor="higherIsBetter" className="font-medium">
                                    Giá trị cao hơn tốt hơn
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <div className="flex items-center">
                                    <input
                                        id="higherIsBetter"
                                        type="checkbox"
                                        checked={higherIsBetter}
                                        onChange={handleOnChangeHigherIsBetter}
                                        className="w-5 h-5 cursor-pointer accent-[var(--color-text)]"
                                    />
                                    <label htmlFor="higherIsBetter" className="ml-2 text-sm text-gray-700">
                                        {higherIsBetter ? 'Có (VD: Chạy xa, Nhảy cao)' : 'Không (VD: Chạy nhanh, Thời gian hoàn thành)'}
                                    </label>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <EmojiEventsIcon />
                                <label htmlFor="excellentThreshold" className="font-medium">
                                    Ngưỡng giỏi <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Ngưỡng giỏi'
                                    value={excellentThreshold}
                                    onChange={handleOnChangeExcellentThreshold}
                                    type="text"
                                    id="excellentThreshold"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                                <p className="h-5 mt-1 text-red-500 text-sm">{errorExcellentThreshold}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <ThumbUpIcon />
                                <label htmlFor="goodThreshold" className="font-medium">
                                    Ngưỡng khá <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Ngưỡng khá'
                                    value={goodThreshold}
                                    onChange={handleOnChangeGoodThreshold}
                                    type="text"
                                    id="goodThreshold"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                                <p className="h-5 mt-1 text-red-500 text-sm">{errorGoodThreshold}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <CheckCircleIcon />
                                <label htmlFor="passThreshold" className="font-medium">
                                    Ngưỡng đạt <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder='Ngưỡng đạt'
                                    value={passThreshold}
                                    onChange={handleOnChangePassThreshold}
                                    type="text"
                                    id="passThreshold"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                                <p className="h-5 mt-1 text-red-500 text-sm">{errorPassThreshold}</p>
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
                        disabled={!name || !unit || !excellentThreshold || !goodThreshold || !passThreshold || !!errorExcellentThreshold || !!errorGoodThreshold || !!errorPassThreshold}
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

export default EditPractice;