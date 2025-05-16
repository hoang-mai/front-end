'use client';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { get } from "@/app/Services/callApi";
import { studentFitnessAssessments } from "@/app/Services/api";
import PracticeDetail from "./practiceDetail";
import NoContent from "@/app/Components/noContent";
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

interface FitnessTestAssessment extends Record<string, unknown> {
    id: number;
    fitnessTestId: number;
    fitnessTestName: string;
    assessmentSessionId: number;
    sessionDate: Date | null;
    performance: string;
    rating: string;
    notes: string;
    recordedAt: Date;
    updatedAt: Date;
}

const convertFitnessTestAssessment = (data: any): FitnessTestAssessment => {
    return {
        id: data.id,
        fitnessTestId: data.fitness_test_id,
        fitnessTestName: data.fitness_test_name,
        assessmentSessionId: data.assessment_session_id,
        sessionDate: data.session_date ? new Date(data.session_date) : null,
        performance: data.performance,
        rating: convertRatingToString(data.rating),
        notes: data.notes,
        recordedAt: new Date(data.recorded_at),
        updatedAt: new Date(data.updated_at),
    };
};

interface HeadCell {
    id: keyof FitnessTestAssessment;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'fitnessTestName', label: 'Tên bài kiểm tra', },
    { id: 'performance', label: 'Thành tích', },
    { id: 'rating', label: 'Đánh giá', },
    { id: 'notes', label: 'Ghi chú', },
    { id: 'recordedAt', label: 'Ngày ghi nhận', },
];

function Practice() {
    const [search, setSearch] = useState<string>('');
    const [assessments, setAssessments] = useState<FitnessTestAssessment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showDetail, setShowDetail] = useState<boolean>(false);
    const [assessment, setAssessment] = useState<FitnessTestAssessment | undefined>(undefined);

    useEffect(() => {
        get(studentFitnessAssessments, {})
            .then((res) => {
                setAssessments(res.data.data.map((item: any) => convertFitnessTestAssessment(item)));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Đánh giá thể lực</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
                <div className='flex gap-4'>
                    <div className='relative'>
                        <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                        <input
                            value={search}
                            onChange={handleOnChangeSearch}
                            type='text'
                            placeholder='Tìm kiếm'
                            className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)'
                        />
                    </div>
                </div>
            </div>
            {loading ?
                <LoaderTable /> :
                assessments.length === 0 ?
                    <NoContent title="Không có bài kiểm tra nào" description="" /> :
                <TableComponent
                    headCells={headCells}
                    dataCells={assessments}
                    search={search}
                    onRowClick={(id) => {
                        setShowDetail(true);
                        setAssessment(assessments.find((assessment) => assessment.id === id));
                    }}
                    actionCell={false}
                />
            }
            {showDetail && assessment &&
                <PracticeDetail
                    showDetail={showDetail}
                    setShowDetail={setShowDetail}
                    assessment={assessment}
                />}
        </div>
    );
}

export default Practice;
