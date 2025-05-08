'use client';
import { useState, useEffect } from "react";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { get } from "@/app/Services/callApi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { managerAssessmentsPractice } from "@/app/Services/api";

interface Week extends Record<string, unknown> {
    id: number;
    name: string;
    weekStartDate: Date;
    weekEndDate: Date;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface HeadCell {
    id: keyof Week;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên tuần', },
    { id: 'weekStartDate', label: 'Ngày bắt đầu', },
    { id: 'weekEndDate', label: 'Ngày kết thúc', },
    { id: 'createdAt', label: 'Ngày tạo', },
    { id: 'updatedAt', label: 'Ngày cập nhật', },
];


function convertDataToWeek(data: any): Week {
    return {
        id: data.id,
        name: data.name,
        weekStartDate: new Date(data.week_start_date),
        weekEndDate: new Date(data.week_end_date),
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    }
}

function Week() {
    const router = useRouter();
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        get(managerAssessmentsPractice, {})
            .then((res) => {
                setWeeks(res.data.data.map((week: any) => convertDataToWeek(week)));
            })
            .catch((err) => {
                
                toast.error(err.data.data.message );
                setError(err.data.data.message );
            })
            .finally(() => setLoading(false));
    }, []);

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    if(error){
        return <div className='text-red-500'>{error}</div>
    }

    return (
        <>  
            <div className='w-full flex justify-between items-center relative px-6 mb-4'>
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
            {loading ? 
                <LoaderTable /> : 
                <TableComponent 
                    headCells={headCells} 
                    dataCells={weeks} 
                    search={search} 
                    onRowClick={(id) => { router.push(`/manager/all/${id}`) }} 
                    actionCell={false}
                />
            }
        </>
    );
}

export default Week;