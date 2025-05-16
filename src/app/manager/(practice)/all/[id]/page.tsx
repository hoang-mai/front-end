'use client';
import { managerAssessmentsPractice } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faSearch,
    faClipboardList,
    faFilter,
    faTrophy,
    faCheckCircle,
    faTimesCircle,
    faExclamationTriangle,
    faArrowUp,
    faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { useParams } from "next/navigation";
import PracticeDetail from "./practiceDetail";
import NoContent from "@/app/Components/noContent";

// Type definitions
export interface Thresholds {
    excellentThreshold: string;
    goodThreshold: string;
    passThreshold: string;
}

export interface Test {
    id: number;
    name: string;
    unit: string;
    higherIsBetter: boolean;
    thresholds: Thresholds;
}

export interface TestStatistics {
    excellent: number;
    good: number;
    pass: number;
    fail: number;
    notRated: number;
    total: number;
}

export interface TestResult {
    test: Test;
    statistics: TestStatistics;
    recordCount: number;
    assessedStudentCount: number;
}

export interface Session {
    id: number;
    name: string;
    weekStartDate: string;
    weekEndDate: string;
    isCurrentWeek: boolean;
    notes?: string;
}

export interface OverallStatistics {
    excellent: number;
    good: number;
    pass: number;
    fail: number;
    notRated: number;
    totalRecords: number;
    totalStudents: number;
    testsAssessed: number;
}

export interface TestSummaryResponse {
    session: Session;
    testResults: TestResult[];
    overallStatistics: OverallStatistics;
}

// Helper functions
function convertDataToWeek(data: any): TestSummaryResponse {
    return {
        session: {
            id: data.session.id,
            name: data.session.name,
            weekStartDate: data.session.week_start_date,
            weekEndDate: data.session.week_end_date,
            isCurrentWeek: data.session.is_current_week,
            notes: data.session.notes || undefined,
        },
        testResults: data.test_results.map((testResult: any) => ({
            test: {
                id: testResult.test.id,
                name: testResult.test.name,
                unit: testResult.test.unit,
                higherIsBetter: testResult.test.higher_is_better,
                thresholds: {
                    excellentThreshold: testResult.test.thresholds.excellent_threshold,
                    goodThreshold: testResult.test.thresholds.good_threshold,
                    passThreshold: testResult.test.thresholds.pass_threshold,
                },
            },
            statistics: {
                excellent: testResult.statistics.excellent,
                good: testResult.statistics.good,
                pass: testResult.statistics.pass,
                fail: testResult.statistics.fail,
                notRated: testResult.statistics.not_rated,
                total: testResult.statistics.total,
            },
            recordCount: testResult.record_count,
            assessedStudentCount: testResult.assessed_student_count,
        })),
        overallStatistics: {
            excellent: data.overall_statistics.excellent,
            good: data.overall_statistics.good,
            pass: data.overall_statistics.pass,
            fail: data.overall_statistics.fail,
            notRated: data.overall_statistics.not_rated,
            totalRecords: data.overall_statistics.total_records,
            totalStudents: data.overall_statistics.total_students,
            testsAssessed: data.overall_statistics.tests_assessed,
        },
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

const PracticeCurrent = () => {
    const params = useParams<{ id: string }>();
    const [week, setWeek] = useState<TestSummaryResponse>();
    const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>([]);
    const [filteredRecords, setFilteredRecords] = useState<PerformanceRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<PerformanceRecord | null>(null);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);
    const [showTestResults, setShowTestResults] = useState<boolean>(true);

    // Format date to local format
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Handle search input change
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    // Handle filter change
    const handleFilterChange = (filter: string | null) => {
        setActiveFilter(filter === activeFilter ? null : filter);
    };

    // Fetch data on component mount
    useEffect(() => {
        Promise.all([
            get(managerAssessmentsPractice + `/${params.id}`, {}),
            get(managerAssessmentsPractice + `/${params.id}/assessments`, {})
        ])
            .then(([weekResponse, performanceResponse]) => {
                setWeek(convertDataToWeek(weekResponse.data.data));
                const records = performanceResponse.data.data.map((record: any) => convertPerformanceRecord(record));
                setPerformanceRecords(records);
                setFilteredRecords(records);
            })
            .catch(() => {
                toast.error('Không có dữ liệu');
                setError('Không có dữ liệu');
            })
            .finally(() => setLoading(false));
    }, [params.id]);

    // Apply filters and search
    useEffect(() => {
        let result = [...performanceRecords];

        // Apply rating filter
        if (activeFilter) {
            result = result.filter(record => record.rating === activeFilter);
        }

        // Apply search
        if (search) {
            const searchLower = search.toLowerCase();
            result = result.filter(record =>
                record.student.name.toLowerCase().includes(searchLower) ||
                record.fitnessTest.name.toLowerCase().includes(searchLower) ||
                record.performance.toLowerCase().includes(searchLower) ||
                (record.notes && record.notes.toLowerCase().includes(searchLower))
            );
        }

        setFilteredRecords(result);
    }, [search, activeFilter, performanceRecords]);

    if(error){
        return <div className='text-red-500'>{error}</div>
    }

    // Loading skeleton
    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="w-full flex justify-center items-center mb-10">
                    <LoaderLine height="h-7" width="w-50" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-100 p-4 rounded-lg h-32"></div>
                    ))}
                </div>

                <div className="mb-6 bg-gray-100 p-4 rounded-lg h-20"></div>

                <div className="mb-8">
                    <LoaderTable  />
                </div>
            </div>
        );
    }

    return (
        <div className="pb-8">
            {week && (
                <>
                    {/* Session Header */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {week.session.name}
                        </h1>
                        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                            <span className="flex items-center">
                                <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-indigo-500" />
                                {formatDate(week.session.weekStartDate)} - {formatDate(week.session.weekEndDate)}
                            </span>
                            {week.session.isCurrentWeek && (
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                    Tuần hiện tại
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {/* Total Records Card */}
                        <StatCard
                            title="Tổng số đánh giá"
                            value={filteredRecords.length}
                            icon={faClipboardList}
                            color="blue"
                        />

                        {/* Excellent Count */}
                        <StatCard
                            title="Xuất sắc"
                            value={filteredRecords.filter(r => r.rating === 'Xuất sắc').length}
                            icon={faTrophy}
                            color="green"
                        />

                        {/* Good Count */}
                        <StatCard
                            title="Giỏi/Đạt"
                            value={filteredRecords.filter(r => r.rating === 'Giỏi' || r.rating === 'Đạt').length}
                            icon={faCheckCircle}
                            color="yellow"
                        />

                        {/* Fail Count */}
                        <StatCard
                            title="Không đạt"
                            value={filteredRecords.filter(r => r.rating === 'Không đạt').length}
                            icon={faTimesCircle}
                            color="red"
                        />
                    </div>

                    {/* Session Notes (if any) */}
                    {week.session.notes && (
                        <div className="bg-yellow-50 p-4 rounded-lg shadow-sm border border-yellow-200 mb-6">
                            <h2 className="text-lg font-semibold mb-2 text-yellow-700 flex items-center">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                Ghi chú
                            </h2>
                            <p className="text-gray-700">{week.session.notes}</p>
                        </div>
                    )}

                    {/* Test Results Section */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-800">Kết quả bài kiểm tra</h2>
                            <button
                                className="text-indigo-500 hover:text-indigo-700 transition duration-200"
                                onClick={() => setShowTestResults(!showTestResults)}
                            >
                                {showTestResults ? 'Ẩn' : 'Hiện'}
                            </button>
                        </div>
                        {showTestResults && week.testResults.length > 0 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-4">
                                <TestResultTable testResults={week.testResults} />
                            </div>
                        )}
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 mb-6">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                            {/* Search Input */}
                            <div className='relative flex-1'>
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className='absolute opacity-50 top-3 left-3 cursor-pointer'
                                />
                                <input
                                    value={search}
                                    onChange={handleOnChangeSearch}
                                    type='text'
                                    placeholder='Tìm theo tên học viên, bài kiểm tra, kết quả...'
                                    className='appearance-none block w-full pl-10 py-2 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]'
                                />
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap gap-2">
                                <FilterButton
                                    label="Xuất sắc"
                                    isActive={activeFilter === 'Xuất sắc'}
                                    onClick={() => handleFilterChange('Xuất sắc')}
                                    color="green"
                                />
                                <FilterButton
                                    label="Giỏi"
                                    isActive={activeFilter === 'Giỏi'}
                                    onClick={() => handleFilterChange('Giỏi')}
                                    color="blue"
                                />
                                <FilterButton
                                    label="Đạt"
                                    isActive={activeFilter === 'Đạt'}
                                    onClick={() => handleFilterChange('Đạt')}
                                    color="yellow"
                                />
                                <FilterButton
                                    label="Không đạt"
                                    isActive={activeFilter === 'Không đạt'}
                                    onClick={() => handleFilterChange('Không đạt')}
                                    color="red"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Table */}
                    {filteredRecords.length > 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <TableComponent
                                dataCells={filteredRecords}
                                headCells={headCells}
                                search=""  // We handle search separately
                                onRowClick={(id) => {
                                    const record = performanceRecords.find((record) => record.id === id);
                                    if (record) {
                                        setSelectedRecord(record);
                                        setShowModal(true);
                                    }
                                }}
                                actionCell={false}
                                deleteCell={false}
                            />
                        </div>
                    ) : (
                        <NoContent
                           
                            title="Không tìm thấy dữ liệu"
                            description="Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc."
                        />
                    )}
                </>
            )}

            {/* Detail Modal */}
            {showModal && selectedRecord &&
                <PracticeDetail
                    showModal={showModal}
                    setShowModal={setShowModal}
                    performanceRecord={selectedRecord}
                />
            }
        </div>
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: number;
    icon: any;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
    const colorMap = {
        blue: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-700',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-500'
        },
        green: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-700',
            iconBg: 'bg-green-100',
            iconColor: 'text-green-500'
        },
        yellow: {
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'text-yellow-700',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-500'
        },
        red: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-700',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-500'
        },
        purple: {
            bg: 'bg-purple-50',
            border: 'border-purple-200',
            text: 'text-purple-700',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-500'
        }
    };

    const styles = colorMap[color];

    return (
        <div className={`${styles.bg} rounded-xl shadow-sm border ${styles.border} p-4`}>
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className={`text-2xl font-bold mt-2 ${styles.text}`}>{value}</h3>
                </div>
                <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} className={styles.iconColor} />
                </div>
            </div>
        </div>
    );
};

// Filter Button Component
interface FilterButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
    color: 'blue' | 'green' | 'yellow' | 'red';
}

const FilterButton = ({ label, isActive, onClick, color }: FilterButtonProps) => {
    const colorMap = {
        blue: {
            activeBg: 'bg-blue-500',
            activeText: 'text-white',
            inactiveBg: 'bg-white',
            inactiveText: 'text-blue-500',
            inactiveBorder: 'border-blue-200',
            hoverBg: 'hover:bg-blue-50'
        },
        green: {
            activeBg: 'bg-green-500',
            activeText: 'text-white',
            inactiveBg: 'bg-white',
            inactiveText: 'text-green-500',
            inactiveBorder: 'border-green-200',
            hoverBg: 'hover:bg-green-50'
        },
        yellow: {
            activeBg: 'bg-yellow-500',
            activeText: 'text-white',
            inactiveBg: 'bg-white',
            inactiveText: 'text-yellow-500',
            inactiveBorder: 'border-yellow-200',
            hoverBg: 'hover:bg-yellow-50'
        },
        red: {
            activeBg: 'bg-red-500',
            activeText: 'text-white',
            inactiveBg: 'bg-white',
            inactiveText: 'text-red-500',
            inactiveBorder: 'border-red-200',
            hoverBg: 'hover:bg-red-50'
        }
    };

    const styles = colorMap[color];

    return (
        <button
            className={`px-3 py-2 rounded-lg border transition-colors duration-200
                ${isActive
                    ? `${styles.activeBg} ${styles.activeText} border-transparent`
                    : `${styles.inactiveBg} ${styles.inactiveText} border ${styles.inactiveBorder} ${styles.hoverBg}`
                }
                flex items-center gap-2`
            }
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faFilter} className="text-xs" />
            <span>{label}</span>
        </button>
    );
};

// Custom Test Results Table Component
interface TestResultRow {
    test: Test;
    statistics: TestStatistics;
    recordCount: number;
    assessedStudentCount: number;
}

interface TestResultTableProps {
    testResults: TestResultRow[];
}

const TestResultTable = ({ testResults }: TestResultTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bài kiểm tra
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Xuất sắc
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giỏi
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Đạt
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Không đạt
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tổng số
                        </th>
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hướng tối ưu
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {testResults.map((result, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{result.test.name}</div>
                                        <div className="text-xs text-gray-500">Đơn vị: {result.test.unit}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatisticCell count={result.statistics.excellent} total={result.statistics.total} color="green" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatisticCell count={result.statistics.good} total={result.statistics.total} color="blue" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatisticCell count={result.statistics.pass} total={result.statistics.total} color="yellow" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <StatisticCell count={result.statistics.fail} total={result.statistics.total} color="red" />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="text-sm text-gray-900 font-medium">{result.statistics.total}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center items-center">
                                    <FontAwesomeIcon 
                                        icon={result.test.higherIsBetter ? faArrowUp : faArrowDown} 
                                        className={result.test.higherIsBetter ? "text-green-500" : "text-blue-500"} 
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        {result.test.higherIsBetter ? "Cao hơn tốt hơn" : "Thấp hơn tốt hơn"}
                                    </span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface StatisticCellProps {
    count: number;
    total: number;
    color: 'green' | 'blue' | 'yellow' | 'red' | 'gray';
}

const StatisticCell = ({ count, total, color }: StatisticCellProps) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    
    const colorMap = {
        green: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-200'
        },
        blue: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            border: 'border-blue-200'
        },
        yellow: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-200'
        },
        red: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-200'
        },
        gray: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            border: 'border-gray-200'
        }
    };

    const style = colorMap[color];

    return (
        <div className="flex flex-col items-center">
            <div className={`text-sm font-medium ${style.text}`}>{count}</div>
            {total > 0 && (
                <div className="w-full mt-1">
                    <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                            <div
                                style={{ width: `${percentage}%` }}
                                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${style.bg}`}
                            ></div>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{Math.round(percentage)}%</div>
                </div>
            )}
        </div>
    );
};

export default PracticeCurrent;