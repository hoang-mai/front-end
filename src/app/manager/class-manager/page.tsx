'use client'
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { managerClasses } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import StudentDetail from "./studentDetail";
import EditStudentModal from "./editStudentModal";

  
   interface Student  extends Record<string, any> {
    id: number;
    name: string;
    email: string;
    classId: number;
    userId: number;
    role: string;
    status: string;
    reason: string | null;
    note: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
 
 interface Manager {
    id: number;
    name: string;
    email: string;
  }
  
   interface ClassManager {
    id: number;
    name: string;
    managerId: number;
    createdAt: Date;
    updatedAt: Date;
    manager: Manager;
    students: Student[];
    
  }
function convertClassData(data: any): ClassManager {
    return {
      id: data.id,
      name: data.name,
      managerId: data.manager_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      manager: {
        id: data.manager.id,
        name: data.manager.name,
        email: data.manager.email,
      },
        students: data.students.map((student: any) => convertStudent(student)),
    };
  }
function convertStudent(data: any): Student {
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      classId: data.pivot.classId,
      userId: data.pivot.userId,
      role: convertRoleToText(data.pivot.role),
      status: convertStatusToText(data.pivot.status),
      reason: data.pivot.reason,
      note: data.pivot.note,
      createdAt: new Date(data.pivot.created_at),
      updatedAt: new Date(data.pivot.updated_at),
    };
  }
  function convertRoleToText(role: string): string {
    switch (role) {
        case 'student':
            return 'Học viên';
        case 'monitor':
            return 'Lớp trưởng';
        case 'vice_monitor':
            return 'Lớp phó';
        default:
            return 'Học viên';
    }
}
function convertStatusToText(status: string): string {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'suspended':
            return 'Đình chỉ';
        default:
            return 'Hoạt động';
    }
}
const classesDefault: ClassManager = {
    id: 0,
    name: '',
    managerId: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    manager: {
        id: 0,
        name: '',
        email: '',
    },
    students: [],
};
interface HeadCell {
    id: keyof Student;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên sinh viên', },
    { id: 'email', label: 'Email', },
    { id: 'role', label: 'Vai trò', },
    { id: 'status', label: 'Trạng thái', },
    { id: 'reason', label: 'Lý do', },
    { id: 'note', label: 'Ghi chú', },
];
const modal = {
        headTitle: 'Bạn có chắc chắn muốn xóa học viên này không?',
        successMessage: 'Xóa học viên thành công',
        errorMessage: 'Xóa học viên thất bại',
        url: '',
    }
function ClassManager() {
    const [classes, setClasses] = useState<ClassManager>(classesDefault);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showStudentDetail, setShowStudentDetail] = useState(false);
    const [studentDetail, setStudentDetail] = useState(0);
    const [error, setError] = useState<string>('');

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        get(managerClasses).then(res => {
            
                const data = convertClassData(res.data.data)
                setClasses(data);
                setStudents(data.students);
            
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })
        .finally(() => {
            setLoading(false);
        })
    }, []);
    if (error) {
        return <div className='text-red-500'>{error}</div>
      }


    return ( 
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            {loading ?
                <>
                    <div className='w-full flex justify-center items-center mb-10'>
                        <LoaderLine height='h-7' width='w-50' />
                    </div>
                    <div className='w-full flex flex-row gap-20 '>
                        <LoaderLine width='w-1/2' height='h-5' />
                        <LoaderLine width='w-1/2' height='h-5' />
                    </div>
                    <div className='w-full flex flex-row gap-20 mb-10'>
                        <LoaderLine width='w-1/2' height='h-5' />
                        <LoaderLine width='w-1/2' height='h-5' />
                    </div>
                    <LoaderTable />
                </>
                :
                <>
                    
                    <div className='w-full flex justify-center items-center'>
                        <h1 className='text-2xl font-bold mb-6 text-center text-(--color-text)'>Lớp quản lý: {classes.name}</h1>
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:gap-x-90 lg:gap-x-50">
                        <p>Tên quản lý: {classes.manager.name}</p>
                        <p>Email: {classes.manager.email}</p>
                        <p>Số lượng học viên: {students.length}</p>
                        <p>Ngày tạo: {classes.createdAt.toLocaleDateString("vi-VN")}</p>
                    </div>
                    <div className='flex justify-between gap-5 lg:gap-3 xl:gap-5 lg:flex-row flex-col'>
                        <div className='flex gap-5 lg:gap-3 xl:gap-5 '>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                                <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='xl:w-auto lg:w-30 shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' />
                            </div>
                        </div>
                    </div>

                    
                    
                    {showStudentDetail &&
                        <StudentDetail student={students.find(student => student.id === studentDetail) as Student} showStudentDetail={showStudentDetail} setShowStudentDetail={setShowStudentDetail} />
                    }
                    <TableComponent headCells={headCells} dataCells={students} search={search} onRowClick={(studentId) => {setShowStudentDetail(true); setStudentDetail(studentId); }} EditComponent={EditStudentModal} deleteCell={false} modal={modal} setDatas={setStudents}/>
                </>
            }
        </div>
     );
}

export default ClassManager;