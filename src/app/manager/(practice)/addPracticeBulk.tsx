import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import useDebounce from "@/app/hooks/useDebounce";
import { managerSearchStudent, managerAssessments, managerAssessmentsBatch } from "@/app/Services/api";
import { post } from "@/app/Services/callApi";
import { faCheckCircle, faDumbbell, faInfoCircle, faSearch, faStickyNote, faUser, faUsers, faXmark, faSave } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import { toast } from "react-toastify";

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
interface AddPracticeBulkProps {
    readonly setFilteredFitnessTests: Dispatch<SetStateAction<FitnessTest[]>>;
    readonly fitnessTests: FitnessTest[];
    readonly setError: Dispatch<SetStateAction<string>>;
    readonly filteredFitnessTests: FitnessTest[];
    readonly setDatas: Dispatch<SetStateAction<any[]>>;
    readonly setShowModal: Dispatch<SetStateAction<boolean>>;
    readonly weekId: number;
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
function AddPracticeBulk({
    setFilteredFitnessTests,
    fitnessTests,
    setError,
    filteredFitnessTests,
    setDatas,
    weekId,
    setShowModal,
    error
}: AddPracticeBulkProps) {

    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debouncedQuery = useDebounce<string>(search, 500, setLoading);
    const [students, setStudents] = useState<Student[] | undefined>();
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    const [fitnessTestSearch, setFitnessTestSearch] = useState<string>('');
    const [selectedTest, setSelectedTest] = useState<FitnessTest | null>(null);
    const [fitnessTestLoading, setFitnessTestLoading] = useState<boolean>(false);
    const debouncedFitnessTestQuery = useDebounce<string>(fitnessTestSearch, 100, setFitnessTestLoading);
    const fitnessTestSearchRef = useRef<HTMLDivElement>(null);
    const [showFitnessTest, setShowFitnessTest] = useState<boolean>(false);

    const [performances, setPerformances] = useState<string[]>([]);

    const [errorPerformances, setErrorPerformances] = useState<string[]>([]);

    const [calculatedRatings, setCalculatedRatings] = useState<string[]>([]);

    const [notes, setNotes] = useState<string[]>([]);

    const handleOnChangePerformance = (index: number, value: string) => {
        const newPerformances = [...performances];
        if (value === '') {
            setErrorPerformances(prev => {
                const newErrors = [...prev];
                newErrors[index] = '';
                return newErrors;
            });
            setPerformances(newPerformances);
            return;
        }
        if (isNaN(Number(value))) {
            setErrorPerformances(prev => {
                const newErrors = [...prev];
                newErrors[index] = 'Kết quả không hợp lệ';
                return newErrors;
            });
        }
        setErrorPerformances(prev => {
            const newErrors = [...prev];
            newErrors[index] = '';
            return newErrors;
        });
        newPerformances[index] = value;
        setPerformances(newPerformances);
        if (selectedTest) {
            const performanceValue = Number(value);
            calculateRating(performanceValue, selectedTest, index);
        }

    }
    const calculateRating = (performanceValue: number, test: FitnessTest, index: number) => {
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

        setCalculatedRatings(prev => {
            const newRatings = [...prev];
            newRatings[index] = rating;
            return newRatings;
        });
    }
    const handleOnChangeNotes = (index: number, value: string) => {
        const newNotes = [...notes];
        newNotes[index] = value;
        setNotes(newNotes);
    }


    const handleFitnessTestSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFitnessTestSearch(e.target.value);
        if (e.target.value === '') {
            setFilteredFitnessTests(fitnessTests);
        }
    }

    const handleOnClickAddPractice = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!selectedTest) {
            setError("Vui lòng chọn bài kiểm tra");
            return;
        }

        if (selectedStudents.length === 0) {
            setError("Vui lòng chọn ít nhất một học viên");
            return;
        }

        const hasEmptyPerformances = selectedStudents.some((_, index) => !performances[index]);
        if (hasEmptyPerformances) {
            setError("Vui lòng nhập kết quả cho tất cả học viên");
            return;
        }

        const hasInvalidPerformances = errorPerformances.some(error => error !== '');
        if (hasInvalidPerformances) {
            setError("Vui lòng sửa lỗi kết quả không hợp lệ");
            return;
        }



        toast.promise(post(managerAssessmentsBatch, {
            fitness_test_id: selectedTest.id,
            assessment_session_id: weekId,
            assessments: selectedStudents.map((student, i) => ({
                user_id: student.id,
                performance: performances[i],
                notes: notes[i],
            })),
        }), {
            pending: "Đang xử lý...",
            success: "Thêm đánh giá thành công",
            error: "Thêm đánh giá thất bại"
        }).then((results) => {
            if (setDatas) {
                const newDataItems = results.data.data.success.map((res: any, index: number) => {
                    const practiceData = res;
                    return {
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
                            id: selectedStudents[index].id,
                            name: selectedStudents[index].name,
                            email: selectedStudents[index].email,
                            emailVerifiedAt: null,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            role: 'user',
                            image: selectedStudents[index].image,
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
                    };
                });

                setDatas(prevData => [...newDataItems, ...prevData]);
            }
            setShowModal(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
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
                                                        // if (performance) {
                                                        //     calculateRating(Number(performance), test);
                                                        // }
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
                                                    className={`w-full flex items-center p-3 hover:bg-gray-50 transition-colors ${selectedStudents.some(s => s.id === student.id) ? 'bg-blue-50' : ''
                                                        }`}
                                                    onClick={() => {
                                                        // Toggle student selection
                                                        const isSelected = selectedStudents.some(s => s.id === student.id);
                                                        if (isSelected) {
                                                            setSelectedStudents(selectedStudents.filter(s => s.id !== student.id));
                                                        } else {
                                                            setSelectedStudents([...selectedStudents, student]);
                                                        }
                                                    }}
                                                >
                                                    <div className="flex items-center w-full">
                                                        <div className={`w-6 h-6 flex items-center justify-center rounded mr-3 ${selectedStudents.some(s => s.id === student.id)
                                                            ? 'bg-green-600 text-white'
                                                            : 'border border-gray-300'
                                                            }`}>
                                                            {selectedStudents.some(s => s.id === student.id) && (
                                                                <FontAwesomeIcon icon={faUser} className="text-xs" />
                                                            )}
                                                        </div>
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

            {/* Selected Students Display */}
            {selectedStudents.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center'>
                            <FontAwesomeIcon icon={faUsers} className="mr-2 text-[color:var(--color-text)]" />
                            Học viên đã chọn ({selectedStudents.length})
                        </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {selectedStudents.map((student, index) => (
                            <div key={student.id} className="flex flex-col justify-between items-center py-2 border-b border-blue-100 last:border-0">
                                <div className="flex justify-between items-center w-full mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {student.image  && student.image !== 'default' ? (
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
                                    <button
                                        type="button"
                                        onClick={() => setSelectedStudents(selectedStudents.filter(s => s.id !== student.id))}
                                        className="text-red-600 hover:text-red-700 p-1"
                                        title="Xóa khỏi danh sách"
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </div>
                                {/* Form */}
                                <form className="space-y-2 w-full px-2">


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
                                                value={performances[index]}
                                                onChange={(e) => handleOnChangePerformance(index, e.target.value)}
                                                className={`appearance-none block w-full pl-10 pr-12 py-3 border ${errorPerformances[index] ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorPerformances[index] ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                            />
                                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                {selectedTest?.unit || 'đơn vị'}
                                            </span>
                                        </div>
                                        <p className='h-5 text-red-500 text-sm mt-1'>{errorPerformances[index]}</p>
                                    </div>

                                    {/* Rating Selection */}
                                    <div className="form-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Đánh giá <span className="text-red-500">*</span>
                                        </label>
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            {calculatedRatings[index] ? (
                                                <div className={`flex items-center ${calculatedRatings[index] === 'excellent' ? 'text-purple-700' :
                                                    calculatedRatings[index] === 'good' ? 'text-blue-700' :
                                                        calculatedRatings[index] === 'pass' ? 'text-green-700' :
                                                            'text-red-700'
                                                    } font-medium`}>
                                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                                    {calculatedRatings[index] === 'excellent' && 'Xuất sắc'}
                                                    {calculatedRatings[index] === 'good' && 'Giỏi'}
                                                    {calculatedRatings[index] === 'pass' && 'Vượt qua'}
                                                    {calculatedRatings[index] === 'fail' && 'Không đạt'}
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
                                                value={notes[index]}
                                                onChange={(e) => handleOnChangeNotes(index, e.target.value)}
                                                rows={3}
                                                className="appearance-none block w-full py-2 pl-10 px-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)] resize-none"
                                            />
                                        </div>
                                    </div>

                                </form>
                            </div>
                        ))}

                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-2" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">
                <button
                    type="submit"
                    disabled={!selectedTest || selectedStudents.length === 0}
                    className="btn-text inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200"
                    onClick={handleOnClickAddPractice}
                >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Thêm đánh giá hàng loạt
                </button>
                <button
                    onClick={() => setShowModal(false)}
                    className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                    <FontAwesomeIcon icon={faXmark} className="mr-2" />
                    Hủy
                </button>
            </div>
        </>
    );
}

export default AddPracticeBulk;