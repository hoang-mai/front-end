'use client';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { managerSearchStudent, managerViolations } from "@/app/Services/api";
import { get, post } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import AddViolation from "./addViolation";
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import useDebounce from "@/app/hooks/useDebounce";
import DetailViolation from "./detailViolation";
import EditViolationModal from "./editViolationModal";
interface Student extends Record<string, any> {
  id: number;
  name: string;
  email: string;
}
interface Violation extends Record<string, any> {
  id: number;
  studentId: number;
  managerId: number;
  violationName: string;
  violationDate: Date;
  createdAt: Date;
  updatedAt: Date;
  isEditable: boolean;
  managerName: string;
  managerEmail: string;
}
function convertDataToViolation(data: any): Violation {
  return {
    id: data.id,
    studentId: data.student_id,
    managerId: data.manager_id,
    violationName: data.violation_name,
    violationDate: new Date(data.violation_date),
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    isEditable: data.is_editable,
    managerName: data.manager.name,
    managerEmail: data.manager.email,
  }
}
interface HeadCell {
  id: keyof Violation;
  label: string;
}
const headCells: HeadCell[] = [
  { id: 'studentId', label: 'Mã học viên' },
  { id: 'violationName', label: 'Tên vi phạm' },
  { id: 'managerName', label: 'Người quản lý' },
  { id: 'managerEmail', label: 'Email người quản lý' },
  { id: 'violationDate', label: 'Ngày vi phạm' },
];
const modal = {
  headTitle: 'Bạn có chắc chắn muốn xóa vi phạm này không?',
  successMessage: 'Xóa vi phạm thành công',
  errorMessage: 'Xóa vi phạm thất bại',
  url: managerViolations,
}


function Violation() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  const [searchStudent, setSearchStudent] = useState<string>('');
  const [loadingStudentViolation, setLoadingStudentViolation] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>();
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [error, setError] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);
  const debouncedQuery = useDebounce(searchStudent, 500, setLoadingStudentViolation);
  const searchStudentViolationRef = useRef<HTMLInputElement>(null);

  const [showDetailViolation, setShowDetailViolation] = useState<boolean>(false);
  const [detailViolation, setDetailViolation] = useState<Violation>();

  const [reRender, setReRender] = useState<boolean>(false);

    const handleOnChangeSearchStudentViolation = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchStudent(e.target.value);
        setSelectedStudent(undefined);
        if(e.target.value === ''){
            setStudents(undefined);
        }
    }
    useEffect(() => {
        if(selectedStudent){
            setLoadingStudentViolation(false);
            return;
        }
        if (debouncedQuery && loadingStudentViolation) {
          
            post(managerSearchStudent, { query: debouncedQuery }).then((res) => {
              setStudents(res.data.data.map((student: any) => ({
                id: student.id,
                name: student.name,
                email: student.email,
              })));
            }).catch((res) => {
              toast.error(res.data.message);
              setError(res.data.message);
            }).finally(() => {
              setLoadingStudentViolation(false);  
            });
        }
    }, [debouncedQuery, selectedStudent])
    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchStudentViolationRef.current && !searchStudentViolationRef.current.contains(e.target as Node)) {

                setLoadingStudentViolation(false);
                setStudents(undefined);
                if(!selectedStudent) {
                    setSearchStudent('');
                }
            }
        }
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        }
    }, [searchStudentViolationRef, selectedStudent])


  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }
  useEffect(() => {
    if(!selectedStudent) {
      return;
    }
    setLoading(true);
    get(managerViolations+'/student/'+selectedStudent.id).then((res) => {
      setViolations(res.data.data.map((violation: any) => convertDataToViolation(violation)));
    })
    .catch((res) => {
      toast.error(res.data.message);
      setError(res.data.message);
    }).finally(() => {
      setLoading(false);
      setReRender(false);
    });
  }, [selectedStudent, reRender]);

  if (error) {
    return <div className='text-red-500'>{error}</div>
  }
  return (
    <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
      <h1 className='font-bold text-2xl text-center text-(--color-text) mb-10'>Quản lý vi phạm</h1>

      <div className='w-full flex justify-between items-center relative px-6'>
        <div className='flex gap-4 xl:flex-row md:flex-col flex-1'>
          
              <div className={` flex flex-col rounded-lg h-fit relative`}
                ref={searchStudentViolationRef}
              >
                <div className='flex flex-row items-center'>
                  <label htmlFor="manager" className="mr-2">Tên học viên:</label>
                  <input
                    placeholder="Nhập tên học viên"
                    type="text"
                    className="appearance-none border rounded-lg  py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                    value={searchStudent}
                    onChange={handleOnChangeSearchStudentViolation}
                  />
                </div>
                
                <div className={`absolute z-10 w-full top-12 ${loadingStudentViolation || students ? ' bg-green-100 border border-(--border-color) rounded-lg shadow-md' : ''}`}>
                  {(() => {
                    let content;
                    if (loadingStudentViolation) {
                      content = <LoaderSpinner />;
                    } else if (students) {
                      content = students.length > 0 ? (
                        <ul className='max-h-40 overflow-y-auto '>
                          {
                            students.map(student => (
                              <li key={student.id} className='w-full '>
                                <button className=" w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 "
                                  onClick={() => {
                  
                                    setSelectedStudent(student);
                                    setSearchStudent(student.name);
                                    setStudents(undefined);
                                  }}
                                >
                                  <div className="text-left">
                                    <h3>{student.name}</h3>
                                    <p className="text-gray-500 text-sm">{student.email}</p>
                                  </div>
                                </button>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p className="text-center my-2">Không tìm thấy học viên</p>
                      );
                    } else {
                      content = null;
                    }
                    return content;
                  })()}
                </div>
              </div>
  
          <div className='relative'>
            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
            <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
          </div>
        </div>
        <button className='btn-text text-white py-2 px-4 w-40 rounded-md'

          onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Thêm vi phạm
        </button>
      </div>
      {loading ? <LoaderTable />
        : <TableComponent dataCells={violations} headCells={headCells} search={search} onRowClick={(id) => {setShowDetailViolation(true); setDetailViolation(violations.find(v => v.id === id)); }} modal={modal} setDatas={setViolations} EditComponent={EditViolationModal} /> 
      }
      {showModal && <AddViolation setShowModal={setShowModal} showModal={showModal} setReRender={setReRender} studentId={selectedStudent?.id} />}
      {showDetailViolation && <DetailViolation setShowModal={setShowDetailViolation} showModal={showDetailViolation} violation={detailViolation} />}
    </div>
  );
}

export default Violation;