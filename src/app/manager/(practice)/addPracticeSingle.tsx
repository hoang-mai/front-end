import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import useDebounce from "@/app/hooks/useDebounce";
import { managerAssessments, managerSearchStudent } from "@/app/Services/api";
import {  post } from "@/app/Services/callApi";
import { faCheckCircle, faDumbbell, faInfoCircle, faSave, faSearch, faStickyNote, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PersonIcon from '@mui/icons-material/Person';
interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

interface FitnessTest extends Record<string, any> {
    id: number,
    name: string,
    unit: string,
    higherIsBetter: string,
    createdAt: Date,
    updatedAt: Date,
    thresholdsExcellentThreshold: string,
    thresholdsGoodThreshold: string,
    thresholdsPassThreshold: string,
}
interface AddPracticeSingleProps {
    readonly fitnessTests: FitnessTest[];
    readonly setFilteredFitnessTests: Dispatch<SetStateAction<FitnessTest[]>>;
    readonly setError: Dispatch<SetStateAction<string>>;
    readonly setDatas?: Dispatch<SetStateAction<any[]>>;
    readonly weekId: number;
    readonly setShowModal: Dispatch<SetStateAction<boolean>>;
    readonly filteredFitnessTests: FitnessTest[];
    readonly error: string;

}
function convertRatingToString(status: string): string {
    switch (status) {
        case 'pass':
            return 'Vượt qua';
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
function AddPracticeSingle({
    fitnessTests,
    setFilteredFitnessTests,
    setError,
    setDatas,
    weekId,
    setShowModal,
    filteredFitnessTests,
    error,
}: AddPracticeSingleProps) {

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery = useDebounce<string>(search, 500, setLoading);
    const [students, setStudents] = useState<Student[] | undefined>();
    const searchRef = useRef<HTMLDivElement>(null);

    const [fitnessTestSearch, setFitnessTestSearch] = useState<string>('');
    const [selectedTest, setSelectedTest] = useState<FitnessTest | null>(null);
    const [fitnessTestLoading, setFitnessTestLoading] = useState<boolean>(false);
    const debouncedFitnessTestQuery = useDebounce<string>(fitnessTestSearch, 100, setFitnessTestLoading);
    const fitnessTestSearchRef = useRef<HTMLDivElement>(null);
    const [showFitnessTest, setShowFitnessTest] = useState<boolean>(false);

    const [performance, setPerformance] = useState<string>('');
    const [errorPerformance, setErrorPerformance] = useState<string>('');

    const [notes, setNotes] = useState<string>('');


    const [calculatedRating, setCalculatedRating] = useState<string>('');






    const handleFitnessTestSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFitnessTestSearch(e.target.value);
        if (e.target.value === '') {
            setFilteredFitnessTests(fitnessTests);
        }
    }







    useEffect(() => {
        if (debouncedQuery) {
            post(managerSearchStudent, { query: debouncedQuery }).then(res => {
                setStudents(res.data.data);
            }).catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [debouncedQuery])

    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearch('');
                setLoading(false);
                setStudents(undefined);
            }
        }
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        }
    }, [searchRef])

    useEffect(() => {
        if (debouncedFitnessTestQuery) {
            const filtered = fitnessTests.filter(test =>
                test.name.toLowerCase().includes(debouncedFitnessTestQuery.toLowerCase()) ||
                test.unit.toLowerCase().includes(debouncedFitnessTestQuery.toLowerCase())
            );
            setFilteredFitnessTests(filtered);
            setFitnessTestLoading(false);
        }
    }, [debouncedFitnessTestQuery])

    useEffect(() => {
        const handleFitnessTestClickOutside = (e: MouseEvent) => {
            if (fitnessTestSearchRef.current && !fitnessTestSearchRef.current.contains(e.target as Node)) {
                setFitnessTestSearch('');
                setFitnessTestLoading(false);
                setShowFitnessTest(false);
                setFilteredFitnessTests(fitnessTests);
            }
        }
        document.addEventListener('mousedown', handleFitnessTestClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleFitnessTestClickOutside);
        }
    }, [fitnessTestSearchRef])



    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value === '') {
            setStudents(undefined);
        }
    }

    const handleOnChangePerformance = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorPerformance("");
            setPerformance(value);
            setCalculatedRating('');
            return;
        }
        if (isNaN(Number(value))) {
            setErrorPerformance("Kết quả không hợp lệ");
            return;
        }
        setErrorPerformance("");
        setPerformance(value);

        // Calculate rating based on performance and selected test thresholds
        if (selectedTest) {
            const performanceValue = Number(value);
            calculateRating(performanceValue, selectedTest);
        }
    }

    const calculateRating = (performanceValue: number, test: FitnessTest) => {
        const excellentThreshold = Number(test.thresholdsExcellentThreshold);
        const goodThreshold = Number(test.thresholdsGoodThreshold);
        const passThreshold = Number(test.thresholdsPassThreshold);
        const isHigherBetter = test.higherIsBetter === "Càng cao càng tốt";

        let rating: string;

        if (isHigherBetter) {
            // For tests where higher performance is better (e.g., push-ups, pull-ups)
            if (performanceValue >= excellentThreshold) {
                rating = 'excellent';
            } else if (performanceValue >= goodThreshold) {
                rating = 'good';
            } else if (performanceValue >= passThreshold) {
                rating = 'pass';
            } else {
                rating = 'fail';
            }
        } else {
            // For tests where lower performance is better (e.g., running time)
            if (performanceValue <= excellentThreshold) {
                rating = 'excellent';
            } else if (performanceValue <= goodThreshold) {
                rating = 'good';
            } else if (performanceValue <= passThreshold) {
                rating = 'pass';
            } else {
                rating = 'fail';
            }
        }

        setCalculatedRating(rating);
    }

    const handleOnClickAddPractice = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!selectedStudent || !selectedTest) {
            setError("Vui lòng chọn học viên và bài kiểm tra");
            return;
        }

        if (!calculatedRating) {
            setError("Không thể xác định được đánh giá. Vui lòng kiểm tra lại kết quả nhập vào");
            return;
        }

        toast.promise(post(managerAssessments, {
            user_id: selectedStudent.id,
            fitness_test_id: selectedTest.id,
            assessment_session_id: weekId,
            performance: performance,
            notes: notes,
        }), {
            pending: "Đang xử lý...",
            success: "Thêm đánh giá thành công",
            error: "Thêm đánh giá thất bại",
        }).then((res) => {
            if (setDatas) {
                const practiceData = res.data.data;
                setDatas((prev: any) => [{
                    id: practiceData.id,
                    userId: practiceData.user_id,
                    managerId: practiceData.manager_id,
                    fitnessTestId: practiceData.fitness_test_id,
                    assessmentSessionId: practiceData.assessment_session_id,
                    performance: practiceData.performance,
                    rating: convertRatingToString(practiceData.rating),
                    notes: practiceData.notes,
                    createdAt: new Date(practiceData.created_at),
                    updatedAt: new Date(practiceData.updated_at),
                    student: {
                        id: selectedStudent.id,
                        name: selectedStudent.name,
                        email: selectedStudent.email,
                        emailVerifiedAt: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        role: 'user',
                        image: selectedStudent.image,
                    },
                    fitnessTest: {
                        id: selectedTest.id,
                        name: selectedTest.name,
                        unit: selectedTest.unit,
                        higherIsBetter: selectedTest.higherIsBetter,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        deletedAt: null,
                    },
                    manager: {
                        id: 0, // This will be filled by the backend
                        name: practiceData.manager.name,
                        email: practiceData.manager.email,
                        emailVerifiedAt: null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        role: 'manager',
                        image: null,
                    },
                }, ...prev]);
            }
            setShowModal(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    }
    return (
        <>
            {/* Fitness Test Selection */}
            <div className="form-group mb-6 relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bài kiểm tra <span className="text-red-500">*</span>
                </label>
                <div className="relative" ref={fitnessTestSearchRef}>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                        <input
                            onFocus={() => setShowFitnessTest(true)}
                            placeholder="Tìm kiếm bài kiểm tra..."
                            type="text"
                            className="appearance-none block w-full pl-10 py-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                            value={fitnessTestSearch}
                            onChange={handleFitnessTestSearch}
                        />
                    </div>

                    {/* Fitness Test Search Results */}
                    {(() => {
                        if (fitnessTestLoading) {
                            return (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                    <div className="p-4 flex justify-center">
                                        <LoaderSpinner />
                                    </div>
                                </div>
                            );
                        } else if (fitnessTestSearch || showFitnessTest) {
                            return filteredFitnessTests.length > 0 ? (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                    <ul className='max-h-60 overflow-y-auto divide-y divide-gray-100'>
                                        {filteredFitnessTests.map(test => (
                                            <li key={test.id} className='w-full'>
                                                <button
                                                    type="button"
                                                    className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedTest(test);
                                                        setFitnessTestSearch('');
                                                        setShowFitnessTest(false);
                                                        setFilteredFitnessTests(fitnessTests);
                                                        if (performance) {
                                                            calculateRating(Number(performance), test);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                                            <FontAwesomeIcon icon={faDumbbell} className="text-gray-500" />
                                                        </div>
                                                        <div className="text-left">
                                                            <h3>{test.name}</h3>
                                                            <p className="text-gray-500 text-sm">
                                                                {test.higherIsBetter === "Càng cao càng tốt"
                                                                    ? `Càng cao càng tốt (${test.unit})`
                                                                    : `Càng thấp càng tốt (${test.unit})`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg p-4 text-center text-gray-500">
                                    Không tìm thấy bài kiểm tra
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>

            {/* Selected Fitness Test Info */}
            {selectedTest && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-[color:var(--color-text)]" />
                        Bài kiểm tra đã chọn
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faDumbbell} className="text-gray-500" />
                        </div>
                        <div className="text-left">
                            <h3>{selectedTest.name}</h3>
                            <p className="text-gray-500 text-sm">
                                {selectedTest.higherIsBetter === "Càng cao càng tốt"
                                    ? `Càng cao càng tốt (${selectedTest.unit})`
                                    : `Càng thấp càng tốt (${selectedTest.unit})`}
                            </p>
                            <div className="mt-2 text-sm">
                                <span className="text-purple-600 font-medium">Xuất sắc: </span>
                                {selectedTest.higherIsBetter === "Càng cao càng tốt"
                                    ? `≥ ${selectedTest.thresholdsExcellentThreshold} ${selectedTest.unit}`
                                    : `≤ ${selectedTest.thresholdsExcellentThreshold} ${selectedTest.unit}`}
                                <span className="mx-2">•</span>
                                <span className="text-blue-600 font-medium">Giỏi: </span>
                                {selectedTest.higherIsBetter === "Càng cao càng tốt"
                                    ? `≥ ${selectedTest.thresholdsGoodThreshold} ${selectedTest.unit}`
                                    : `≤ ${selectedTest.thresholdsGoodThreshold} ${selectedTest.unit}`}
                                <span className="mx-2">•</span>
                                <span className="text-green-600 font-medium">Đạt: </span>
                                {selectedTest.higherIsBetter === "Càng cao càng tốt"
                                    ? `≥ ${selectedTest.thresholdsPassThreshold} ${selectedTest.unit}`
                                    : `≤ ${selectedTest.thresholdsPassThreshold} ${selectedTest.unit}`}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Search Student Section */}
            <div className='mb-6 relative'>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tìm kiếm học viên <span className="text-red-500">*</span>
                </label>
                <div
                    className="relative"
                    ref={searchRef}
                >
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                        <input
                            placeholder="Nhập tên hoặc email học viên..."
                            type="text"
                            className="appearance-none block w-full pl-10 py-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                            value={search}
                            onChange={handleOnChangeSearch}
                        />
                    </div>

                    {/* Search Results */}
                    {(() => {
                        if (loading) {
                            return (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                    <div className="p-4 flex justify-center">
                                        <LoaderSpinner />
                                    </div>
                                </div>
                            );
                        } else if (students) {
                            return students.length > 0 ? (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                    <ul className='max-h-60 overflow-y-auto divide-y divide-gray-100'>
                                        {students.map(student => (
                                            <li key={student.id} className='w-full'>
                                                <button
                                                    className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors"
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setSearch('');
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
                                                            <h3>{student.name}</h3>
                                                            <p className="text-gray-500 text-sm">{student.email}</p>
                                                        </div>
                                                    </div>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg p-4 text-center text-gray-500">
                                    Không tìm thấy học viên
                                </div>
                            );
                        }
                        return null;
                    })()}
                </div>
            </div>

            {/* Selected Student Info */}
            {selectedStudent && (
                <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                        <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-[color:var(--color-text)]" />
                        Thông tin học viên
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                            {selectedStudent.image && selectedStudent.image !== 'default' ? (
                                <img
                                    src={selectedStudent.image}
                                    alt={selectedStudent.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <PersonIcon className="text-gray-500" />
                            )}
                        </div>
                        <div className="text-left">
                            <h3>{selectedStudent.name}</h3>
                            <p className="text-gray-500 text-sm">{selectedStudent.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Form */}
            <form className="space-y-2">


                {/* Performance Field */}
                <div className="form-group">
                    <label htmlFor="performance" className="block text-sm font-medium text-gray-700 mb-1">
                        Kết quả <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faDumbbell} className="text-gray-400" />
                        </div>
                        <input
                            placeholder="Nhập kết quả"
                            type="text"
                            id="performance"
                            value={performance}
                            onChange={handleOnChangePerformance}
                            className={`appearance-none block w-full pl-10 pr-12 py-3 border ${errorPerformance ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorPerformance ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            {selectedTest?.unit || 'đơn vị'}
                        </span>
                    </div>
                    <p className='h-5 text-red-500 text-sm mt-1'>{errorPerformance}</p>
                </div>

                {/* Rating Selection */}
                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đánh giá <span className="text-red-500">*</span>
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4">
                        {calculatedRating ? (
                            <div className={`flex items-center ${calculatedRating === 'excellent' ? 'text-purple-700' :
                                calculatedRating === 'good' ? 'text-blue-700' :
                                    calculatedRating === 'pass' ? 'text-green-700' :
                                        'text-red-700'
                                } font-medium`}>
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                {calculatedRating === 'excellent' && 'Xuất sắc'}
                                {calculatedRating === 'good' && 'Giỏi'}
                                {calculatedRating === 'pass' && 'Vượt qua'}
                                {calculatedRating === 'fail' && 'Không đạt'}
                                <span className="ml-2 text-gray-500 font-normal">
                                    (Được tính tự động dựa trên kết quả và các ngưỡng)
                                </span>
                            </div>
                        ) : (
                            <div className="text-gray-500 italic">
                                Đánh giá sẽ được tính tự động khi bạn nhập kết quả và chọn bài kiểm tra
                            </div>
                        )}
                    </div>
                </div>

                {/* Notes Field */}
                <div className="form-group">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Ghi chú
                    </label>
                    <div className="relative">
                        <div className="absolute top-3.5 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faStickyNote} className="text-gray-400" />
                        </div>
                        <textarea
                            placeholder="Thêm ghi chú (nếu có)"
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="appearance-none block w-full py-2 pl-10 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                        />
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-2" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">
                    <button
                        type="submit"
                        disabled={!selectedStudent || !selectedTest || performance === '' || errorPerformance !== ''}
                        className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200"
                        onClick={handleOnClickAddPractice}
                    >
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Thêm đánh giá
                    </button>
                    <button
                        onClick={() => setShowModal(false)}
                        className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                        <FontAwesomeIcon icon={faXmark} className="mr-2" />
                        Hủy
                    </button>
                </div>
            </form>
        </>
    );
}

export default AddPracticeSingle;