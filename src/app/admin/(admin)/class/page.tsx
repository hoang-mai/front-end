'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderSelect from "@/app/Components/Loader/loaderSelect";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import SelectComponent from "@/app/Components/select";
import TableComponent from "@/app/Components/table";
import { courseByTerm, term } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Class extends Record<string, unknown>{
    id: number;
    code: string;
    subjectName: string;
    termId: number;
    enrollLimit: string;
    midtermWeight: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    term: {
        id: number;
        name: string;
    }
}
interface HeadCell {
    id: keyof Class;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'code', label: 'Mã học phần', },
    { id: 'subjectName', label: 'Tên học phần', },
    { id: 'enrollLimit', label: 'Số lượng đăng ký tối đa', },
    { id: 'midtermWeight', label: 'Trọng số giữa kỳ', },
    { id: 'createdAt', label: 'Ngày tạo', },
    
];

function convertDataToClass(data: any): Class {
    return {
        id: data.id,
        code: data.code,
        subjectName: data.subject_name,
        termId: data.term_id,
        enrollLimit: data.enroll_limit,
        midtermWeight: data.midterm_weight,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        deletedAt: new Date(data.deleted_at),
        term: {
            id: data.term.id,
            name: data.term.name
        }
    }
}
function convertDataToTerm(data: any): Option {
    return {
        id: data.id,
        label: data.name
    }
}

function Class() {
    const router=useRouter();
    const [search, setSearch] = useState<string>('');
    const [terms, setTerms] = useState<Option[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<Option>({ id: '', label: '' });
    const [loadingTerm, setLoadingTerm] = useState<boolean>(true);
    const [loadingClass, setLoadingClass] = useState<boolean>(true);
    useEffect(() => {
        get(term, {}).then((res) => {
            const fetchedTerms = res.data.data.map((term: any) => convertDataToTerm(term));
            setTerms(fetchedTerms);
            if (fetchedTerms.length > 0) {
                setSelectedTerm(fetchedTerms[0]);
                get(courseByTerm, { termId: fetchedTerms[0].id }).then((res) => {
                    setClasses(res.data.data.map((term: any) => convertDataToClass(term)));
                }).finally(() => setLoadingClass(false));
            }
        }).finally(() => setLoadingTerm(false));
    }, [])
    useEffect(() => {
        if (selectedTerm.id) {
            setLoadingClass(true);
            get(courseByTerm, { termId: selectedTerm.id }).then((res) => {
                setClasses(res.data.data.map((term: any) => convertDataToClass(term)));
            }).finally(() => setLoadingClass(false));
        }
    }, [selectedTerm])
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    return (
        <div className='w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý học phần</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='flex gap-4'>
                    {loadingTerm ? <LoaderSelect /> : terms.length > 0 && <SelectComponent selected={selectedTerm} setSelected={setSelectedTerm} options={terms} defaultOption={terms[0]} width="w-20" />}
                    <div className='relative'>
                        <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                        <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
                    </div>

                </div>
                {loadingTerm ? <LoaderLine width="w-30" height="h-10" /> :
                    terms.length > 0 &&
                    <Link href={`/admin/${selectedTerm.id}/${selectedTerm.label}/create-class`} className='btn-text text-white py-2 px-4 w-44 rounded-md'>
                        <FontAwesomeIcon icon={faPlus} className='mr-2' />
                        Thêm học phần
                    </Link>}
            </div>
            {loadingClass ? <LoaderTable /> :
                <TableComponent headCells={headCells} dataCells={classes} search={search} onRowClick={(id)=>{router.push(`/admin/class/${id}`)}}/>}
        </div>
    );
}

export default Class;