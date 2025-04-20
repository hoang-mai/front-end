'use client';
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderSelect from "@/app/Components/Loader/loaderSelect";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import SelectComponent from "@/app/Components/select";
import TableComponent from "@/app/Components/table";
import { course, courseByTerm, term } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import EditClassModal from "./[id]/editClassModal";
import { toast } from "react-toastify";
import AddClass from "./addClass";



interface HeadCell {
    id: keyof Course;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'code', label: 'Mã lớp học', },
    { id: 'subjectName', label: 'Tên lớp học', },
    { id: 'enrollLimit', label: 'Số lượng đăng ký tối đa', },
    { id: 'midtermWeight', label: 'Trọng số giữa kỳ', },
    { id: 'createdAt', label: 'Ngày tạo', },

];
const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa lớp học này không?',
    successMessage: 'Xóa lớp học thành công',
    errorMessage: 'Xóa lớp học thất bại',
    url: course,
}
function convertDataToClass(data: any): Course {
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
    }
}
function convertDataToTerm(data: any): Option {
    return {
        id: data.id,
        label: data.name
    }
}

function Class() {
    const router = useRouter();
    const [search, setSearch] = useState<string>('');
    const [terms, setTerms] = useState<Option[]>([]);
    const [classes, setClasses] = useState<Course[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<Option>({ id: '', label: '' });
    const [loadingTerm, setLoadingTerm] = useState<boolean>(true);
    const [loadingClass, setLoadingClass] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showAddClass, setShowAddClass] = useState<boolean>(false);
    useEffect(() => {
        get(term, {}).then((res) => {
            const fetchedTerms = res.data.data.map((term: any) => convertDataToTerm(term));
            setTerms(fetchedTerms);
            if (fetchedTerms.length > 0) {
                setSelectedTerm(fetchedTerms[0]);
            }
        }).catch((res) => {
            toast.error(res.data.message);
            setError(res.data.message);
        }).finally(() => setLoadingTerm(false));
    }, [])
    useEffect(() => {
        console.log('selectedTerm', selectedTerm.id);
        if (selectedTerm.id !== '') {
            console.log('selectedTerm', selectedTerm);
            get(courseByTerm + '/' + selectedTerm.id).then((res) => {
                
                setClasses(res.data.data.map((term: any) => convertDataToClass(term)));
            }).catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            }).finally(() => setLoadingClass(false));
        }
    }, [selectedTerm])
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    if(error){
        return <div className='text-red-500'>{error}</div>
      }

    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý lớp học</h1>
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
                    <button className='btn-text text-white py-2 px-4 w-44 rounded-md'
                        onClick={() => setShowAddClass(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} className='mr-2' />
                        Thêm lớp học
                    </button>}
            </div>
            {loadingClass ? <LoaderTable /> :
                <TableComponent headCells={headCells} dataCells={classes} search={search} onRowClick={(id) => { router.push(`/admin/class/${id}`) }} modal={modal} setDatas={setClasses} EditComponent={EditClassModal} />}
            {showAddClass && <AddClass id={selectedTerm.id} label={selectedTerm.label} setShowModal={setShowAddClass}  showModal={showAddClass} setDatas={setClasses}/>}
        </div>
    );
}

export default Class;