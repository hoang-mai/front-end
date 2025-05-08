'use client';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { managerSearchStudent, managerViolations } from "@/app/Services/api";
import { get, post } from "@/app/Services/callApi";
import { faPlus, faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PersonIcon from '@mui/icons-material/Person';
import AddViolation from "./addViolation";
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import useDebounce from "@/app/hooks/useDebounce";
import DetailViolation from "./detailViolation";
import EditViolationModal from "./editViolationModal";

interface Student {
  id: number;
  name: string;
  email: string;
  image: string | null;
}

interface Violation extends Record<string, unknown> {
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
  studentName: string;
  studentEmail: string;
  studentImage: string | null;
}

function convertDataToViolation(data: any, student: Student): Violation {
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
    studentName: student.name,
    studentEmail: student.email,
    studentImage: student.image,
  }
}

interface HeadCell {
  id: keyof Violation;
  label: string;
}

const headCells: HeadCell[] = [
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
};

function StudentSelector({
  selectedStudent,
  setSelectedStudent,
  searchRef
}: Readonly<{
  selectedStudent?: Student;
  setSelectedStudent: (student?: Student) => void;
  searchRef: React.RefObject<HTMLDivElement | null>;
}>) {
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>();
  const debouncedQuery = useDebounce(search, 500, setLoading);

  const handleClearSelection = () => {
    setSelectedStudent(undefined);
    setSearch('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      setStudents(undefined);
    }
  };

  useEffect(() => {
    if (selectedStudent) {
      setLoading(false);
      return;
    }

    if (debouncedQuery && loading) {
      post(managerSearchStudent, { query: debouncedQuery })
        .then((res) => {
          setStudents(res.data.data.map((student: any) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            image: student.image,
          })));
        })
        .catch((res) => {
          toast.error(res.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [debouncedQuery, selectedStudent, loading]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setLoading(false);
        setStudents(undefined);
        if (!selectedStudent) {
          setSearch('');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchRef, selectedStudent]);

  return (
    <div className="w-full md:w-96 flex flex-col rounded-lg h-fit relative">
      <div className="flex flex-row items-center">
        <label htmlFor="studentSearch" className="mr-2 whitespace-nowrap">Học viên:</label>
        <div className="relative flex-1">
          <input
            id="studentSearch"
            placeholder="Nhập tên học viên"
            type="text"
            className="appearance-none border rounded-lg py-2 px-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
            value={selectedStudent ? selectedStudent.name : search}
            onChange={handleSearchChange}
            disabled={!!selectedStudent}
          />
          {selectedStudent && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={handleClearSelection}
              title="Xóa lựa chọn"
            >
              <FontAwesomeIcon icon={faTimesCircle} />
            </button>
          )}
        </div>
      </div>

      <div className="absolute z-10 w-full top-12">
        {loading && (
          <div className="bg-white border border-(--border-color) rounded-lg shadow-md p-4 flex justify-center">
            <LoaderSpinner />
          </div>
        )}

        {students && students.length > 0 && (
          <ul className="max-h-72 overflow-y-auto bg-white border border-(--border-color) rounded-lg shadow-md">
            {students.map(student => (
              <li key={student.id} className="w-full">
                <button
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => {
                    setSelectedStudent(student);
                    setStudents(undefined);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                      {student.image && student.image !== 'default' ? (
                        <img
                          src={student.image}
                          alt={student.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <PersonIcon className="text-gray-500" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-gray-500 text-sm">{student.email}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        {students && students.length === 0 && (
          <div className="bg-white border border-(--border-color) rounded-lg shadow-md p-4 text-center text-gray-500">
            Không tìm thấy học viên
          </div>
        )}
      </div>
    </div>
  );
}

function Violation() {
  const [violations, setViolations] = useState<Violation[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [error, setError] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailViolation, setDetailViolation] = useState<Violation>();
  const searchStudentRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAddViolation = () => {
    setShowAddModal(true);
  };

  const handleRowClick = (id: number) => {
    const violation = violations.find(v => v.id === id);
    if (violation) {
      setDetailViolation(violation);
      setShowDetailModal(true);
    }
  };

  useEffect(() => {
    if (!selectedStudent) {
      setViolations([]);
      return;
    }

    setLoading(true);
    get(`${managerViolations}/student/${selectedStudent.id}`)
      .then((res) => {
        setViolations(res.data.data.map((violation: any) => convertDataToViolation(violation,selectedStudent)));
      })
      .catch((res) => {
        toast.error(res.data.message);
        setError(res.data.message);
      })
      .finally(() => {
        setLoading(false);

      });
  }, [selectedStudent]);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 shadow-sm">
        <p className="font-medium">Đã xảy ra lỗi:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">
      <h1 className="font-bold text-2xl text-center text-(--color-text)">Quản lý vi phạm</h1>

      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto" ref={searchStudentRef}>
          <StudentSelector
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
            searchRef={searchStudentRef}
          />

          <div className="relative w-full md:w-64">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={handleSearchChange}
              type="text"
              placeholder="Tìm kiếm vi phạm"
              className="appearance-none border rounded-lg py-2 pl-10 pr-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
            />
          </div>
        </div>

        <button
          className="btn-text text-white py-2 px-4 rounded-md flex items-center justify-center whitespace-nowrap"
          onClick={handleAddViolation}
          disabled={!selectedStudent}
          title={!selectedStudent ? "Vui lòng chọn học viên trước" : "Thêm vi phạm mới"}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Thêm vi phạm
        </button>
      </div>

      {!selectedStudent ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-blue-700">
          <p className="text-lg font-medium mb-2">Vui lòng chọn học viên</p>
          <p>Chọn một học viên để xem và quản lý các vi phạm</p>
        </div>
      ) : loading ? (
        <LoaderTable />
      ) : violations.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
          <p className="text-lg font-medium mb-2">Không có vi phạm nào</p>
          <p>Học viên này chưa có vi phạm nào được ghi nhận</p>
        </div>
      ) : (
        <TableComponent
          index={true}
          dataCells={violations}
          headCells={headCells}
          search={search}
          onRowClick={handleRowClick}
          modal={modal}
          setDatas={setViolations}
          EditComponent={EditViolationModal}
        />
      )}

      {showAddModal && selectedStudent && (
        <AddViolation
          showModal={showAddModal}
          setShowModal={setShowAddModal}
          setDatas={setViolations}
          preSelectedStudent={selectedStudent}
        />
      )}

      {showDetailModal && detailViolation && (
        <DetailViolation
          showModal={showDetailModal}
          setShowModal={setShowDetailModal}
          violation={detailViolation}
          student={selectedStudent}
        />
      )}
    </div>
  );
}

export default Violation;