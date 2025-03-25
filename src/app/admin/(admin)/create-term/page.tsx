'use client';
import React, { useState } from 'react';
import DatePickerComponent from "@/app/Components/datePicker";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { toast } from 'react-toastify';
import { post } from '@/app/Services/callApi';
import { term } from '@/app/Services/api';


function CreateTerm() {
    const [nameTerm, setNameTerm] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [rosterDeadline, setRosterDeadline] = useState<Date | null>(null);
    const [gradeEntryDate, setGradeEntryDate] = useState<Date | null>(null);
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
            post(term, { name: nameTerm, start_date: startDate, end_date: endDate, roster_deadline: rosterDeadline, grade_entry_date: gradeEntryDate }),
            {
                pending: "Đang xử lý...",
                success: "Tạo học kỳ thành công",
                error: "Tạo học kỳ thất bại",
            }
        ).then((res) => {
            setNameTerm('');
            setStartDate(null);
            setEndDate(null);
            setRosterDeadline(null);
            setGradeEntryDate(null);
            setError('');
        })
            .catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);

            })
    }
    return (
        <div className=" xl:w-[60%] md:w-full h-full flex flex-col items-center bg-white rounded-lg shadow-md lg:p-6 md:p-4">
            <div className="self-start">
                <Link href="/admin">
                    <FontAwesomeIcon
                        icon={faReply}
                        className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                    />
                </Link>
            </div>
            <h1 className="font-bold text-2xl text-center text-(--color-text)">Tạo học kỳ mới</h1>

            <div className="w-full flex justify-center">
                <form action="" className="lg:w-150 w-120 lg:px-16 md:px-8" >
                    <div className="flex flex-col relative">
                        <label htmlFor="name" className="">Tên học kỳ</label>
                        <input
                            placeholder={`${new Date().getFullYear()}A`}
                            value={nameTerm}
                            onChange={handelOnChangeNameTerm}
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                        />
                        <p className='h-5 text-red-500 text-sm'>{errorNameTerm}</p>
                    </div>
                    <div className=" flex flex-col">
                        <label htmlFor="start" className="">Ngày bắt đầu</label>
                        <DatePickerComponent value={startDate} onChange={handleOnChangeStartDate} />
                        <p className='h-5 text-red-500 text-sm'>{errorStartDate}</p>
                    </div>
                    <div className=" flex flex-col">
                        <label htmlFor="end" className="">Ngày kết thúc</label>
                        <DatePickerComponent value={endDate} onChange={handleOnChangeEndDate} />
                        <p className='h-5 text-red-500 text-sm'>{errorEndDate}</p>
                    </div>
                    <div className=" flex flex-col">
                        <label htmlFor="end" className="">Hạn đăng ký lớp</label>
                        <DatePickerComponent value={rosterDeadline} onChange={handleOnChangeRosterDeadline} />
                        {errorRosterDeadline
                            ? <p className='h-5 text-red-500 text-sm'>{errorRosterDeadline}</p>
                            : <p className='text-gray-500 text-sm'>Lưu ý *: Sau thời gian này, hệ thống sẽ đóng đăng ký lớp.</p>
                        }
                    </div>
                    <div className=" flex flex-col">
                        <label htmlFor="end" className="">Ngày bắt đầu nhập điểm</label>
                        <DatePickerComponent value={gradeEntryDate} onChange={handleOnChangeGradeEntryDate} />
                        {errorGradeEntryDate
                            ? <p className='h-5 text-red-500 text-sm'>{errorGradeEntryDate}</p>
                            : <p className='text-gray-500 text-sm'>Lưu ý *: Sau thời gian này, giảng viên mới có thể nhập điểm.</p>
                        }
                    </div>
                    <p className='h-5 text-red-500 text-sm my-2 '>{error}</p>
                    <div className='flex items-center justify-center'>
                        <button
                            onClick={handleOnSubmit}
                            disabled={!nameTerm || !!errorNameTerm || !startDate || !endDate || !rosterDeadline || !gradeEntryDate}
                            type="submit"
                            className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Tạo học kỳ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateTerm;