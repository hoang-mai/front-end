'use client';
import { course } from "@/app/Services/api";
import { post } from "@/app/Services/callApi";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


function CreateClass() {
    const params = useParams<{ id: string, label: string }>()
    const [subjectName, setSubjectName] = useState<string>('');
    const [enrollLimit, setEnrollLimit] = useState<string>('60');
    const [midtermWeight, setMidtermWeight] = useState<string>('0.5');
    const [errorMidtermWeight, setErrorMidtermWeight] = useState<string>('');
    const [errorEnrollLimit, setErrorEnrollLimit] = useState<string>('');
    const [error, setError] = useState<string>('');
    const handelOnChangeNameClass = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubjectName(e.target.value);
    }
    const handelOnChangeEnrollLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();

        console.log(value);

        if (value === '') {
            setErrorEnrollLimit('Trường này không được để trống');
            setEnrollLimit('');
            return;
        }

        const validFormat = /^[1-9]\d*$/;

        if (!validFormat.test(value)) {
            setErrorEnrollLimit('Chỉ nhập số nguyên dương');
            return;
        }

        setErrorEnrollLimit('');
        setEnrollLimit(value);
    };

    const handelOnChangeMidtermWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.trim();


        if (value === '') {
            setErrorMidtermWeight('Trường này không được để trống');
            setMidtermWeight('');
            return;
        }

        const validFormat = /^0(\.\d{0,2})?$|^1$/;

        if (!validFormat.test(value)) {
            setErrorMidtermWeight('Chỉ nhập giá trị từ 0 đến 1, có tối đa 2 chữ số sau dấu phẩy');
            return;
        }

        setErrorMidtermWeight('');
        setMidtermWeight(value);
    };

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            post(course, { subject_name: subjectName, enroll_limit: enrollLimit, midterm_weight: midtermWeight, term_id: params.id })
                .then((res) => {
                    setError('');
                    setSubjectName('');
                    setEnrollLimit('60');
                    setMidtermWeight('0.5');
                }),
            {
                pending: "Đang xử lý...",
                success: "Tạo lớp học thành công",
                error: "Tạo lớp học thất bại",
            }
        ).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        }
        )
    }
    return (
        <div className="xl:w-[60%] md:w-full h-full flex flex-col items-center bg-white rounded-lg shadow-md lg:p-12 md:p-8 ">
            <div className="self-start">
                <Link href="/admin/class">
                    <FontAwesomeIcon
                        icon={faReply}
                        className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                    />
                </Link>
            </div>
            <h1 className="font-bold text-2xl text-center text-(--color-text)">Tạo lớp học mới</h1>
            <div className="w-full flex justify-center ">
                <form action="" className="lg:w-150 w-120 lg:px-16 md:px-8" >
                    <div className="flex flex-row my-4">
                        <label htmlFor="name" className="mr-2">Tên học kỳ:</label>
                        <p> {params.label}</p>
                    </div>
                    <div className="flex flex-col relative mb-4">
                        <label htmlFor="name" className="">Tên lớp học</label>
                        <input
                            placeholder='Tên lớp học'
                            value={subjectName}
                            onChange={handelOnChangeNameClass}
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                        />

                    </div>
                    <div className="flex flex-col relative">
                        <label htmlFor="enrollLimit" className="">Số lượng đăng ký tối đa</label>
                        <input
                            placeholder='Số lượng đăng ký tối đa'
                            value={enrollLimit}
                            onChange={handelOnChangeEnrollLimit}
                            type="text"
                            id="enrollLimit"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                        />
                        <p className='h-5 text-red-500 text-sm'>{errorEnrollLimit}</p>
                    </div>
                    <div className="flex flex-col relative ">
                        <label htmlFor="midtermWeight" className="">Trọng số giữa kỳ</label>
                        <input
                            placeholder='Trọng số giữa kỳ'
                            value={midtermWeight}
                            onChange={handelOnChangeMidtermWeight}
                            type="text"
                            id="midtermWeight"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)"
                        />
                        <p className='h-5 text-red-500 text-sm'>{errorMidtermWeight}</p>
                    </div>

                    <p className='h-5 text-red-500 text-sm my-2 h-fit'>{error}</p>
                    <div className='flex items-center justify-center'>
                        <button
                            onClick={handleOnSubmit}
                            disabled={!subjectName || !enrollLimit || !midtermWeight || !!errorMidtermWeight || !!errorEnrollLimit}
                            type="submit"
                            className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Tạo lớp học
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateClass;