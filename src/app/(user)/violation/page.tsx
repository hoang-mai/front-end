'use client';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import { get } from "@/app/Services/callApi";
import { toast } from "react-toastify";
import { studentViolations } from '@/app/Services/api';
import TableComponent from '@/app/Components/table';
import ViolationDetail from './violationDetail';
import NoContent from '@/app/Components/noContent';

interface Violation extends Record<string, unknown> {
  id: number;
  recordedAt: Date;
  managerId: number;
  violationName: string;
  violationDate: Date;
  isEditable: boolean;
  updatedAt: Date;
  managerName: string;

}

function convertDataToViolation(data: any): Violation {
  return {
    id: data.id,
    managerId: data.manager_id,
    violationName: data.violation_name,
    violationDate: new Date(data.violation_date),
    recordedAt: new Date(data.recorded_at),
    updatedAt: new Date(data.updated_at),
    managerName: data.manager_name,
    isEditable: data.is_editable,
  }
}


interface HeadCell {
  id: keyof Violation;
  label: string;
}
const headCells: HeadCell[] = [
  { id: 'violationName', label: 'Tên vi phạm' },
  { id: 'violationDate', label: 'Ngày vi phạm' },
  { id: 'recordedAt', label: 'Ngày ghi nhận' },
  { id: 'managerName', label: 'Người ghi nhận' },
];

const Violation = () => {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [studentDetail, setStudentDetail] = useState<any>(null);

  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  useEffect(() => {

    get(studentViolations)
      .then((res) => {

        setViolations(res.data.data.map((violation: any) => convertDataToViolation(violation)));
      })
      .catch((res) => {

        toast.error(res.data?.message || 'Không thể tải dữ liệu vi phạm');
        setError(res.data?.message || 'Đã xảy ra lỗi khi tải dữ liệu vi phạm');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  if (error) {
    return <div className='text-red-500'>{error}</div>
  }

  return (
    <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl text-center text-(--color-text) mb-10'>Vi phạm</h1>
      <div className='relative'>
        <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
        <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
      </div>
      {loading ? (
        <LoaderTable />
      ) 
      : violations.length === 0 ? <NoContent title="Không có vi phạm nào" description="" />
      : (
        <>

          <TableComponent actionCell={false} index={true} dataCells={violations} headCells={headCells} search={search} onRowClick={(id) => { setShowModal(true); setStudentDetail(violations.find(violation => violation.id === id)); }} />
          {showModal && studentDetail && <ViolationDetail showModal={showModal} setShowModal={setShowModal} violation={studentDetail} />}
        </>
      )}
    </div>
  );
};

export default Violation;
