'use client';
import { managerAssessmentsPractice, managerCurrentPractice, managerFitnessTests } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faDumbbell, faSearch, faClipboardList, faUser } from "@fortawesome/free-solid-svg-icons";
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import PracticeDetail from "./practiceDetail";
import AddPractice from "./addPractice";

interface Week {
    id: number;
    name: string;
    weekStartDate: Date;
    weekEndDate: Date;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
}
function convertDataToWeek(data: any): Week {
    return {
        id: data.id,
        name: data.name,
        weekStartDate: new Date(data.week_start_date),
        weekEndDate: new Date(data.week_end_date),
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}
interface PerformanceRecord extends Record<string, unknown> {
    id: number;
    userId: number;
    managerId: number;
    fitnessTestId: number;
    assessmentSessionId: number;
    performance: string;
    rating: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    fitnessTest: FitnessTest;
    manager: Manager;
}

export interface Student {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    image: string | null;
}

export interface FitnessTest {
    id: number;
    name: string;
    unit: string;
    higherIsBetter: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface Manager {
    id: number;
    name: string;
    email: string;
    emailVerifiedAt: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    image: string | null;
}

function convertRatingToString(status: string): string {
    switch (status) {
        case 'pass':
            return 'Đạt';
        case 'good':
            return 'Giỏi';
        case 'fail':
            return 'Không đạt';
        case 'excellent':
            return 'Xuất sắc';
        default:
            return 'Không rõ trạng thái';
    }
}

function convertPerformanceRecord(data: any): PerformanceRecord {
    return {
        id: data.id,
        userId: data.user_id,
        managerId: data.manager_id,
        fitnessTestId: data.fitness_test_id,
        assessmentSessionId: data.assessment_session_id,
        performance: data.performance,
        rating: convertRatingToString(data.rating),
        notes: data.notes,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        student: {
            id: data.student.id,
            name: data.student.name,
            email: data.student.email,
            emailVerifiedAt: data.student.email_verified_at,
            createdAt: new Date(data.student.created_at),
            updatedAt: new Date(data.student.updated_at),
            role: data.student.role,
            image: data.student.image,
        },
        fitnessTest: {
            id: data.fitness_test.id,
            name: data.fitness_test.name,
            unit: data.fitness_test.unit,
            higherIsBetter: data.fitness_test.higher_is_better,
            createdAt: new Date(data.fitness_test.created_at),
            updatedAt: new Date(data.fitness_test.updated_at),
            deletedAt: data.fitness_test.deleted_at,
        },
        manager: {
            id: data.manager.id,
            name: data.manager.name,
            email: data.manager.email,
            emailVerifiedAt: data.manager.email_verified_at,
            createdAt: new Date(data.manager.created_at),
            updatedAt: new Date(data.manager.updated_at),
            role: data.manager.role,
            image: data.manager.image,
        },
    }
};

interface HeadCell {
    id: keyof PerformanceRecord | 'student.name' | 'fitnessTest.name';
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'student.name', label: 'Học viên' },
    { id: 'fitnessTest.name', label: 'Bài kiểm tra' },
    { id: 'performance', label: 'Kết quả' },
    { id: 'rating', label: 'Đánh giá' },
    { id: 'notes', label: 'Ghi chú' },
];

function PracticeCurrent() {
    const [week, setWeek] = useState<Week>();
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<PerformanceRecord | null>(null);
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    useEffect(() => {
        get(managerCurrentPractice)
            .then((res) => {
                setWeek(convertDataToWeek(res.data.data));
                get(managerAssessmentsPractice + `/${res.data.data.id}` + '/assessments')
                    .then((res) => {
                        setPerformanceRecords(res.data.data.map((record: any) => convertPerformanceRecord(record)));
                    }).catch((err) => {
                        setError(err.data.message);
                        toast.error(err.data.message);
                    })
            })
            .catch((err) => {
                setError(err.data.message);
                toast.error(err.data.message);
            }).finally(() => {
                setLoading(false);
            });

    }, []);

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <>
            {loading ? (
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
                </>
            ) : (
                <>
                    {week && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {/* Week Name Card */}
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-blue-500">
                                    <h2 className="text-lg font-semibold mb-3 text-blue-600">Tên tuần tập</h2>
                                    <div className="space-y-2 flex items-center">
                                        <FontAwesomeIcon icon={faClipboardList} className="text-blue-500 mr-2" />
                                        <p className="font-medium">{week.name}</p>
                                    </div>
                                </div>

                                {/* Start Date Card */}
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-green-500">
                                    <h2 className="text-lg font-semibold mb-3 text-green-600">Ngày bắt đầu</h2>
                                    <div className="space-y-2 flex items-center">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-green-500 mr-2" />
                                        <p className="font-medium">{formatDate(week.weekStartDate)}</p>
                                    </div>
                                </div>

                                {/* End Date Card */}
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-purple-500">
                                    <h2 className="text-lg font-semibold mb-3 text-purple-600">Ngày kết thúc</h2>
                                    <div className="space-y-2 flex items-center">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-purple-500 mr-2" />
                                        <p className="font-medium">{formatDate(week.weekEndDate)}</p>
                                    </div>
                                </div>

                                {/* Performance Count Card */}
                                <div className="bg-white p-4 rounded-lg shadow border border-gray-200 border-l-4 border-l-red-500">
                                    <h2 className="text-lg font-semibold mb-3 text-red-600">Số lượng đánh giá</h2>
                                    <div className="space-y-2 flex items-center">
                                        <FontAwesomeIcon icon={faUser} className="text-red-500 mr-2" />
                                        <p className="font-medium">{performanceRecords.length}</p>
                                    </div>
                                </div>
                            </div>
                            {showAdd && <AddPractice showModal={showAdd} setShowModal={setShowAdd} setDatas={setPerformanceRecords} weekId={week.id} />}
                        </>

                    )}

                    {week?.notes && (
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                            <h2 className="text-lg font-semibold mb-3 text-gray-700">Ghi chú</h2>
                            <p className="text-gray-600">{week.notes}</p>
                        </div>
                    )}

                    <div className="flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setShowAdd(true)}
                                className="btn-text text-white h-10 px-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <FontAwesomeIcon icon={faDumbbell} className="mr-2" />
                                <span>Thêm đánh giá</span>
                            </button>
                        </div>

                        <div className='relative'>
                            <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                            <input
                                value={search}
                                onChange={handleOnChangeSearch}
                                type='text'
                                placeholder='Tìm kiếm...'
                                className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)'
                            />
                        </div>
                    </div>

                    {performanceRecords.length > 0 ? (
                        <TableComponent
                            dataCells={performanceRecords}
                            headCells={headCells}
                            search={search}
                            onRowClick={(id) => {
                                setShowModal(true);
                                setSelectedRecord(performanceRecords.find((record) => record.id === id) || null);
                            }}
                            actionCell={false}
                            deleteCell={false}
                        />
                    ) : (
                        <div className="text-center py-8">
                            <FontAwesomeIcon icon={faClipboardList} className="text-gray-400 text-5xl mb-4" />
                            <p className="text-gray-500 text-lg">Không có dữ liệu đánh giá nào</p>
                        </div>
                    )}
                </>
            )
            }
            {showModal && selectedRecord && <PracticeDetail showModal={showModal} setShowModal={setShowModal} performanceRecord={selectedRecord} />}

        </>
    );
}

export default PracticeCurrent;