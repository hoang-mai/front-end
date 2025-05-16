'use client';
import { useState, useEffect, useRef } from "react";
import { adminEquipmentStudents, searchStudent } from "@/app/Services/api";
import { get, post } from "@/app/Services/callApi";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import TableComponent from "@/app/Components/table";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import useDebounce from "@/app/hooks/useDebounce";
import PersonIcon from '@mui/icons-material/Person';
import DetailEquipment from "./detailEquipment";
import EditReceivedEquipment from "./editReceivedEquipment";

export interface EquipmentType {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Distribution {
    id: number;
    year: number;
    equipmentTypeId: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    equipmentType: EquipmentType;
}

export interface EquipmentRecord extends Record<string, unknown> {
    id: number;
    userId: number;
    distributionId: number;
    received: string;
    receivedAt: Date | null;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    distribution: Distribution;
}

interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

interface HeadCell {
    id: keyof EquipmentRecord;
    label: string;
}


const headCells: HeadCell[] = [
    { id: 'distribution.equipmentType.name', label: 'Tên thiết bị' },
    { id: 'distribution.year', label: 'Cấp phát năm' },
    { id: 'received', label: 'Đã nhận' },
    { id: 'receivedAt', label: 'Ngày nhận' },
    { id: 'notes', label: 'Ghi chú' },
];

function convertDataToEquipmentRecord(data: any): EquipmentRecord {
    return {
        id: data.id,
        userId: data.user_id,
        distributionId: data.distribution_id,
        received: data.received ? 'Đã nhận' : 'Chưa nhận',
        receivedAt: data.received_at ? new Date(data.received_at) : null,
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        distribution: {
            id: data.distribution.id,
            year: data.distribution.year,
            equipmentTypeId: data.distribution.equipment_type_id,
            quantity: data.distribution.quantity,
            createdAt: new Date(data.distribution.created_at),
            updatedAt: new Date(data.distribution.updated_at),
            equipmentType: {
                id: data.distribution.equipment_type.id,
                name: data.distribution.equipment_type.name,
                description: data.distribution.equipment_type.description,
                createdAt: new Date(data.distribution.equipment_type.created_at),
                updatedAt: new Date(data.distribution.equipment_type.updated_at),
            },
        },
    };
}

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
            post(searchStudent, { query: debouncedQuery })
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
                                            {student.image && student.image !== 'default'? (
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

function Student() {
    const [equipmentRecords, setEquipmentRecords] = useState<EquipmentRecord[]>([]);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedStudent, setSelectedStudent] = useState<Student>();
    const [error, setError] = useState<string>('');
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [detailEquipment, setDetailEquipment] = useState<EquipmentRecord>();
    const searchStudentRef = useRef<HTMLDivElement | null>(null);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };


    const handleRowClick = (id: number) => {
        const equipment = equipmentRecords.find(e => e.id === id);
        if (equipment) {
            setDetailEquipment(equipment);
            setShowDetailModal(true);
        }
    };

    useEffect(() => {
        if (!selectedStudent) {
            setEquipmentRecords([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        get(`${adminEquipmentStudents}/${selectedStudent.id}`)
            .then((res) => {
                setEquipmentRecords(res.data.data.map((record: EquipmentRecord) => convertDataToEquipmentRecord(record)));
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
        <div className=" bg-white rounded-lg  p-6 flex flex-col gap-6">

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
                            placeholder="Tìm kiếm thiết bị"
                            className="appearance-none border rounded-lg py-2 pl-10 pr-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
                        />
                    </div>
                </div>


            </div>

            {!selectedStudent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-blue-700">
                    <p className="text-lg font-medium mb-2">Vui lòng chọn học viên</p>
                    <p>Chọn một học viên để xem và quản lý trang thiết bị</p>
                </div>
            ) : loading ? (
                <LoaderTable />
            ) : equipmentRecords.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                    <p className="text-lg font-medium mb-2">Không có thiết bị nào</p>
                    <p>Học viên này chưa được cấp phát thiết bị</p>
                </div>
            ) : (
                <TableComponent
                    index={true}
                    dataCells={equipmentRecords}
                    headCells={headCells}
                    search={search}
                    onRowClick={handleRowClick}
                    deleteCell={false}
                    setDatas={setEquipmentRecords}
                    EditComponent={EditReceivedEquipment}
                />
            )}

            {/* Detail modal will be implemented later */}
            {showDetailModal && detailEquipment && selectedStudent && (
                <DetailEquipment
                    showModal={showDetailModal}
                    setShowModal={setShowDetailModal}
                    equipmentRecord={detailEquipment}
                    student={selectedStudent}
                />
            )}
        </div>
    );
}

export default Student;