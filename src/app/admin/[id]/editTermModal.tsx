import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { term } from '@/app/Services/api'
import { SetStateAction, Dispatch, useState } from 'react'
import { put } from '@/app/Services/callApi';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import DatePickerComponent from '@/app/Components/datePicker';
import { format } from 'date-fns';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GradeIcon from '@mui/icons-material/Grade';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
        console.log('startDate', startDate);
        console.log('endDate', endDate);
        console.log('rosterDeadline', rosterDeadline);
        console.log('gradeEntryDate', gradeEntryDate);
        toast.promise(
            put(term + '/' + data.id, {}, { name: nameTerm, start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null, end_date: endDate ? format(endDate, 'yyyy-MM-dd') : null, roster_deadline: rosterDeadline ? format(rosterDeadline, 'yyyy-MM-dd') : null, grade_entry_date: gradeEntryDate ? format(gradeEntryDate, 'yyyy-MM-dd') : null }),
            {
                pending: "Đang xử lý...",
                success: "Cập nhật học kỳ thành công",
                error: "Cập nhật học kỳ thất bại",
            }
        ).then((res) => {
            setDatas?.((prev) => prev.map((term) =>
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
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[90%] w-[95%] max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden'>
                <div className='bg-[var(--color-text)] text-white p-5 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Chỉnh sửa học kỳ</h2>
                    <button
                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <CloseIcon />
                    </button>
                </div>

                <div className='p-6 custom-scrollbar overflow-y-auto max-h-[calc(90vh-130px)]'>
                    <form action="" className="space-y-5">
                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <CalendarMonthIcon />
                                <label htmlFor="name" className="font-medium">
                                    Tên học kỳ <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    placeholder={`${new Date().getFullYear()}A`}
                                    value={nameTerm}
                                    onChange={handelOnChangeNameTerm}
                                    type="text"
                                    id="name"
                                    className="appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--border-color-focus)] border-[var(--border-color)] hover:border-[var(--border-color-hover)] transition-colors duration-200"
                                />
                                <p className='h-5 mt-1 text-red-500 text-sm'>{errorNameTerm}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <EventIcon />
                                <label htmlFor="start" className="font-medium">
                                    Ngày bắt đầu <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3 flex flex-col">
                                <DatePickerComponent value={startDate} onChange={handleOnChangeStartDate} />
                                <p className='h-5 mt-1 text-red-500 text-sm'>{errorStartDate}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <EventIcon />
                                <label htmlFor="end" className="font-medium">
                                    Ngày kết thúc <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3 flex flex-col">
                                <DatePickerComponent value={endDate} onChange={handleOnChangeEndDate} />
                                <p className='h-5 mt-1 text-red-500 text-sm'>{errorEndDate}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <AssignmentIcon />
                                <label htmlFor="roster" className="font-medium">
                                    Hạn đăng ký lớp <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3 flex flex-col">
                                <DatePickerComponent value={rosterDeadline} onChange={handleOnChangeRosterDeadline} />
                                {errorRosterDeadline
                                    ? <p className='h-5 mt-1 text-red-500 text-sm'>{errorRosterDeadline}</p>
                                    : <p className='text-gray-500 text-sm mt-1'>Lưu ý *: Sau thời gian này, hệ thống sẽ đóng đăng ký lớp.</p>
                                }
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-start gap-2">
                            <div className="md:w-1/3 flex items-center gap-2 text-[var(--color-text)]">
                                <GradeIcon />
                                <label htmlFor="grade" className="font-medium">
                                    Ngày bắt đầu nhập điểm <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className="md:w-2/3 flex flex-col">
                                <DatePickerComponent value={gradeEntryDate} onChange={handleOnChangeGradeEntryDate} />
                                {errorGradeEntryDate
                                    ? <p className='h-5 mt-1 text-red-500 text-sm'>{errorGradeEntryDate}</p>
                                    : <p className='text-gray-500 text-sm mt-1'>Lưu ý *: Sau thời gian này, giảng viên mới có thể nhập điểm.</p>
                                }
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-2" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                        )}
                    </form>
                </div>

                <div className='bg-gray-50 p-5 flex justify-center gap-4 border-t'>
                    <button
                        onClick={handleOnSubmit}
                        disabled={!nameTerm || !!errorNameTerm || !startDate || !endDate || !rosterDeadline || !gradeEntryDate}
                        className='btn-text text-white py-2 px-6 rounded-lg flex items-center gap-2 disabled:opacity-60'
                    >
                        <SaveIcon fontSize="small" />
                        <span>Lưu</span>
                    </button>
                    <button
                        className='bg-red-700 text-white py-2 px-6 rounded-lg hover:bg-red-800 active:bg-red-900 flex items-center gap-2 transition-colors duration-200'
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

export default EditTermModal;