import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { term } from '@/app/Services/api'


import { SetStateAction, Dispatch, useState } from 'react'
import { put } from '@/app/Services/callApi';
import { toast } from 'react-toastify';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DatePickerComponent from '@/app/Components/datePicker';


interface EditTermModalProps {
    data: Term;
    showEdit: boolean;
    setDatas?: Dispatch<SetStateAction<Term[]>>;
    setData?: Dispatch<SetStateAction<Term>>;
    setShowEdit: (show: boolean) => void;
}
const EditTermModal = ({
    data,
    showEdit,
    setDatas,
    setData,
    setShowEdit,
}: EditTermModalProps) => {
    const [nameTerm, setNameTerm] = useState<string>(data.nameTerm);
    const [startDate, setStartDate] = useState<Date | null>(data.startDate);
    const [endDate, setEndDate] = useState<Date | null>(data.endDate);
    const [rosterDeadline, setRosterDeadline] = useState<Date | null>(data.rosterDeadline);
    const [gradeEntryDate, setGradeEntryDate] = useState<Date | null>(data.gradeEntryDate);
    const [errorNameTerm, setErrorNameTerm] = useState<string>('');
    const [errorStartDate, setErrorStartDate] = useState<string>('');
    const [errorEndDate, setErrorEndDate] = useState<string>('');
    const [errorRosterDeadline, setErrorRosterDeadline] = useState<string>('');
    const [errorGradeEntryDate, setErrorGradeEntryDate] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handelOnChangeNameTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
        const regex = /20\d{2}[A-Z]/;
        setNameTerm(e.target.value);
        if (!regex.exec(e.target.value)) {
            setErrorNameTerm('Tên học kỳ không hợp lệ');
            return;
        }

        setErrorNameTerm('');
    }

    const handleOnChangeStartDate = (date: Date) => {

        if (endDate && date.getTime() > endDate.getTime() - 14 * 24 * 60 * 60 * 1000) {
            setErrorStartDate('Ngày bắt đầu phải cách ngày kết thúc ít nhất 2 tuần');
            setStartDate(null);
            return;
        }
        if (rosterDeadline && date.getTime() > rosterDeadline.getTime() - 14 * 24 * 60 * 60 * 1000) {
            setErrorStartDate('Ngày bắt đầu phải cách ngày hết hạn đăng ký ít nhất 2 tuần');
            setStartDate(null);
            return;
        }
        if (gradeEntryDate && date > gradeEntryDate) {
            setErrorStartDate('Ngày bắt đầu không thể lớn hơn ngày bắt đầu nhập điểm');
            setStartDate(null);
            return;
        }
        setStartDate(date);
        setErrorStartDate('');
    }
    const handleOnChangeEndDate = (date: Date) => {
        if (!startDate) {
            setErrorEndDate('Vui lòng chọn ngày bắt đầu trước');
            setEndDate(null);
            return;
        }
        if (startDate && date.getTime() < startDate.getTime() + 14 * 24 * 60 * 60 * 1000) {
            setErrorEndDate('Ngày kết thúc phải cách ngày bắt đầu ít nhất 2 tuần');
            setEndDate(null);
            return;
        }
        if (rosterDeadline && date < rosterDeadline) {
            setErrorEndDate('Ngày kết thúc không thể nhỏ hơn ngày hết hạn đăng ký lớp');
            setEndDate(null);
            return;
        }
        if (gradeEntryDate && date > gradeEntryDate) {
            setErrorEndDate('Ngày kết thúc không thể lớn hơn ngày bắt đầu nhập điểm');
            setEndDate(null);
            return;
        }
        if (date < startDate) {
            setErrorEndDate('Ngày kết thúc không thể nhỏ hơn ngày bắt đầu');
            setEndDate(null);
            return;
        }

        setEndDate(date);
        setErrorEndDate('');
    };

    const handleOnChangeRosterDeadline = (date: Date) => {
        if (!startDate) {
            setErrorRosterDeadline('Vui lòng chọn ngày bắt đầu trước');
            setRosterDeadline(null);
            return;
        }
        if (!endDate) {
            setErrorRosterDeadline('Vui lòng chọn ngày kết thúc trước');
            setRosterDeadline(null);
            return;
        }
        if (date.getTime() < startDate.getTime() + 14 * 24 * 60 * 60 * 1000) {
            setErrorRosterDeadline('Ngày hết hạn đăng ký lớp phải cách ngày bắt đầu ít nhất 2 tuần');
            setRosterDeadline(null);
            return;
        }
        if (date > endDate) {
            setErrorRosterDeadline('Ngày hết hạn đăng ký lớp không thể lớn hơn ngày kết thúc');
            setRosterDeadline(null);
            return;
        }
        setRosterDeadline(date);
        setErrorRosterDeadline('');
    }
    const handleOnChangeGradeEntryDate = (date: Date) => {
        if (!startDate) {
            setErrorGradeEntryDate('Vui lòng chọn ngày bắt đầu trước');
            setGradeEntryDate(null);
            return;
        }
        if (!endDate) {
            setErrorGradeEntryDate('Vui lòng chọn ngày kết thúc trước');
            setGradeEntryDate(null);
            return;
        }
        if (date < startDate) {
            setErrorGradeEntryDate('Ngày bắt đầu nhập điểm không thể nhỏ hơn ngày bắt đầu');
            setGradeEntryDate(null);
            return;
        }

        if (date < endDate) {
            setErrorGradeEntryDate('Ngày bắt đầu nhập điểm không thể nhỏ hơn ngày kết thúc');
            setGradeEntryDate(null);
            return;
        }
        if (date.getTime() < endDate.getTime() + 14 * 24 * 60 * 60 * 1000) {
            setErrorGradeEntryDate('Ngày bắt đầu nhập điểm phải cách ngày kết thúc ít nhất 2 tuần');
            setGradeEntryDate(null);
            return;
        }
        setGradeEntryDate(date);
        setErrorGradeEntryDate('');
    }
    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            put(term + '/' + data.id, {}, { name: nameTerm, start_date: startDate, end_date: endDate, roster_deadline: rosterDeadline, grade_entry_date: gradeEntryDate }),
            {
                pending: "Đang xử lý...",
                success: "Cập nhật học kỳ thành công",
                error: "Cập nhật học kỳ thất bại",
            }
        ).then((res) => {
            setDatas?.((prev) =>  prev.map((term) =>
                    term.id === data.id && startDate && endDate && rosterDeadline && gradeEntryDate
                        ? { ...term, nameTerm, startDate, endDate, rosterDeadline, gradeEntryDate }
                        : term
                
            ));
            setData?.((prev) => ({
                ...prev,
                nameTerm,
                startDate: startDate ?? prev.startDate,
                endDate: endDate ?? prev.endDate,
                rosterDeadline: rosterDeadline ?? prev.rosterDeadline,
                gradeEntryDate: gradeEntryDate ?? prev.gradeEntryDate,
            }));
            setShowEdit(false);
        })
            .catch((err) => {
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
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[90%] h-[82%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa học kỳ</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>

                <form action="" >
                    <div className="flex flex-row items-center mb-4">
                        <label htmlFor="name" className="w-1/3 text-left relative bottom-4 pr-4">Tên học kỳ</label>
                        <div className='flex flex-col w-2/3'>
                            <input
                                placeholder={`${new Date().getFullYear()}A`}
                                value={nameTerm}
                                onChange={handelOnChangeNameTerm}
                                type="text"
                                id="name"
                                className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                            <p className='h-5 text-red-500 text-sm'>{errorNameTerm}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center mb-4">
                        <label htmlFor="start" className="w-1/3 text-left relative bottom-4 pr-4">Ngày bắt đầu</label>
                        <div className='flex flex-col w-2/3'>
                            <DatePickerComponent value={startDate} onChange={handleOnChangeStartDate} />
                            <p className='h-5 text-red-500 text-sm'>{errorStartDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center mb-4">
                        <label htmlFor="end" className="w-1/3 text-left relative bottom-4 pr-4">Ngày kết thúc</label>
                        <div className='flex flex-col w-2/3'>
                            <DatePickerComponent value={endDate} onChange={handleOnChangeEndDate} />
                            <p className='h-5 text-red-500 text-sm'>{errorEndDate}</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center mb-4">
                        <label htmlFor="end" className="w-1/3 text-left relative bottom-4 pr-4">Hạn đăng ký lớp</label>
                        <div className='flex flex-col w-2/3'>
                            <DatePickerComponent value={rosterDeadline} onChange={handleOnChangeRosterDeadline} />
                            {errorRosterDeadline
                                ? <p className='h-5 text-red-500 text-sm'>{errorRosterDeadline}</p>
                                : <p className='text-gray-500 text-sm'>Lưu ý *: Sau thời gian này, hệ thống sẽ đóng đăng ký lớp.</p>
                            }
                        </div>
                    </div>
                    <div className="flex flex-row items-center mb-4">
                        <label htmlFor="end" className="w-1/3 text-left relative bottom-4 pr-4">Ngày bắt đầu nhập điểm</label>
                        <div className='flex flex-col w-2/3'>
                            <DatePickerComponent value={gradeEntryDate} onChange={handleOnChangeGradeEntryDate} />
                            {errorGradeEntryDate
                                ? <p className='h-5 text-red-500 text-sm'>{errorGradeEntryDate}</p>
                                : <p className='text-gray-500 text-sm'>Lưu ý *: Sau thời gian này, giảng viên mới có thể nhập điểm.</p>
                            }
                        </div>
                    </div>

                    <p className='h-5 text-red-500 text-sm my-2 '>{error}</p>
                </form>

                <div className='flex justify-center gap-4 w-full mt-4'>
                    <button disabled={!nameTerm || !!errorNameTerm || !startDate || !endDate || !rosterDeadline || !gradeEntryDate} className='btn-text text-white w-20 h-10 rounded-lg' onClick={handleOnSubmit}>Lưu</button>
                    <button className='bg-red-700 text-white w-20 h-10 rounded-lg hover:bg-red-800 active:bg-red-900' onClick={() => setShowEdit(false)}>Hủy</button>
                </div>
            </Box>
        </Modal>);
}

export default EditTermModal;