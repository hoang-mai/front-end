'use client';
import React, { useState, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { get } from '@/app/Services/callApi';
import { term } from '@/app/Services/api';
import LoaderTable from '@/app/Components/Loader/loaderTable';
import { useRouter } from 'next/navigation';
import TableComponent from '@/app/Components/table';
import EditTermModal from './[id]/editTermModal';
import { toast } from 'react-toastify';
import CreateTerm from './addTerm';
import NoContent from '../Components/noContent';

function convertDataToTerm(data: any): Term {
  return {
    id: data.id,
    nameTerm: data.name,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    rosterDeadline: new Date(data.roster_deadline),
    gradeEntryDate: new Date(data.grade_entry_date),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    deletedAt: new Date(data.deleted_at),
  }
}

interface HeadCell {
  id: keyof Term;
  label: string;
}

const headCells: HeadCell[] = [
  { id: 'nameTerm', label: 'Tên kỳ học', },
  { id: 'startDate', label: 'Ngày bắt đầu', },
  { id: 'endDate', label: 'Ngày kết thúc', },
  { id: 'rosterDeadline', label: 'Hạn đăng ký lớp', },
  { id: 'gradeEntryDate', label: 'Ngày nhập điểm', },
];
const modal = {
  headTitle: 'Bạn có chắc chắn muốn xóa kỳ học này không?',
  successMessage: 'Xóa học kỳ thành công',
  errorMessage: 'Xóa học kỳ thất bại',
  url: term,
}
export default function HomePage() {
  const router = useRouter();
  const [terms, setTerms] = useState<Term[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  useEffect(() => {

    get(term, {}).then((res) => {
      setTerms(res.data.data.map((term: any) => convertDataToTerm(term)));
    }).catch((res) => {
      toast.error(res.data.message);
      setError(res.data.message);
    }).finally(() => setLoading(false));
  }, []);
  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

  }
  if (error) {
    return <div className='text-red-500'>{error}</div>
  }
  return (
    <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý học kỳ</h1>
      <div className='w-full flex justify-between items-center relative px-6'>
        <div className='relative'>
          <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
          <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
        <button className='btn-text text-white py-2 px-4 w-40 rounded-md'

          onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Thêm học kỳ
        </button>
      </div>
      {loading ? <LoaderTable /> : terms.length === 0 ?
        <NoContent title='Không có học kỳ nào' description='Vui lòng thêm học kỳ mới' /> : 
        <TableComponent dataCells={terms} headCells={headCells} search={search} onRowClick={(id) => { router.push(`admin/${id}`) }} modal={modal} EditComponent={EditTermModal} setDatas={setTerms} />
      }
      {showModal && <CreateTerm setShowModal={setShowModal} showModal={showModal} setDatas={setTerms} />}
    </div>
  );
}
