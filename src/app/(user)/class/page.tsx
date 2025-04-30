'use client';
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { get } from '@/app/Services/callApi';
import { studentCourses } from '@/app/Services/api';
import LoaderTable from '@/app/Components/Loader/loaderTable';
import { useRouter } from 'next/navigation';
import TableComponent from '@/app/Components/table';
import { toast } from 'react-toastify';
import NoContent from "@/app/Components/noContent";

interface Course extends Record<string, any> {
    id: number;
    code: string;
    subjectName: string;
    termId: number;
    enrollLimit: number;
    midtermWeight: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    termName: string;
}

function convertCourse(data: any): Course {
    return {
        id: data.id,
        code: data.code,
        subjectName: data.subject_name,
        termId: data.term_id,
        enrollLimit: data.enroll_limit,
        midtermWeight: data.midterm_weight,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        deletedAt: data.deleted_at,
        termName: data.term.name,
    };
}

interface HeadCell {
  id: keyof Course;
  label: string;
}

const headCells: HeadCell[] = [
  { id: 'code', label: 'Mã lớp học' },
  { id: 'subjectName', label: 'Tên lớp học' },
  { id: 'termName', label: 'Kỳ học' },
  { id: 'enrollLimit', label: 'Số lượng đăng ký tối đa' },
  { id: 'midtermWeight', label: 'Trọng số giữa kỳ' },
];

function Class() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        get(studentCourses)
            .then((res) => {
                setCourses(res.data.data.map((course: any) => convertCourse(course)));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            })
            .finally(() => setLoading(false));
    }, []);
    
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    
    if (error) {
        return <div className='text-red-500'>{error}</div>
    }
    
    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Danh sách lớp học</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='relative'>
                    <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                    <input 
                        value={search} 
                        onChange={handleOnChangeSearch} 
                        type='text' 
                        placeholder='Tìm kiếm' 
                        className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' 
                    />
                </div>
            </div>
            {loading ? <LoaderTable /> : 
                courses.length === 0 ? <NoContent title="Không có lớp học nào"  description="" /> :
                <TableComponent 
                    actionCell={false}
                    dataCells={courses} 
                    headCells={headCells} 
                    search={search} 
                    onRowClick={(id) => { router.push(`/class/${id}`) }} 
                />
            }
        </div>
    );
}

export default Class;