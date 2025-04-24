'use client'
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { adminFitnessTest } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AddFitnessTest from "./addPractice";
import EditPractice from "./editPractice";
import PracticeDetail from "./practiceDetail";


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

function convertDataToFitnessTest(data: any): FitnessTest[] {
    
    return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        higherIsBetter: item.higher_is_better ? "Có" : "Không",
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        thresholdsExcellentThreshold: item.thresholds.excellent_threshold,
        thresholdsGoodThreshold: item.thresholds.good_threshold,
        thresholdsPassThreshold: item.thresholds.pass_threshold,
    }));
}

interface HeadCell {
    id: keyof FitnessTest;
    label: string;
}

const headCells: HeadCell[] = [
    { id: 'name', label: 'Tên bài kiểm tra thể lực', },
    { id: 'unit', label: 'Đơn vị', },
    { id: 'higherIsBetter', label: 'Giá trị cao hơn là tốt hơn', },
    { id: 'createdAt', label: 'Ngày tạo', },
    { id: 'updatedAt', label: 'Ngày cập nhật', },
    { id: 'thresholdsExcellentThreshold', label: 'Ngưỡng giỏi', },
    { id: 'thresholdsGoodThreshold', label: 'Ngưỡng khá', },
    { id: 'thresholdsPassThreshold', label: 'Ngưỡng đạt', },
];

const modal = {
    headTitle: 'Bạn có chắc chắn muốn xóa bài kiểm tra thể lực này không?',
    successMessage: 'Xóa bài kiểm tra thể lực thành công',
    errorMessage: 'Xóa bài kiểm tra thể lực thất bại',
    url: adminFitnessTest,
}

function Practice() {
    
    const [fitnessTests, setFitnessTests] = useState<FitnessTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showFitnessTestDetail, setShowFitnessTestDetail] = useState<boolean>(false);
    const [fitnessTestDetail, setFitnessTestDetail] = useState<FitnessTest>();

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    
    useEffect(() => {
        get(adminFitnessTest, {})
            .then((res) => {
                setFitnessTests(convertDataToFitnessTest(res.data.data.data));
            }).catch((err) => {
                setError(err.data.message);
                toast.error(err.data.message);
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    if (error) {
        return <div className='text-red-500'>{error}</div>
    }

    return (
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý bài kiểm tra thể lực</h1>
            <div className='w-full flex justify-between items-center relative px-6'>
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
                <button
                    className='btn-text text-white py-2 px-4 w-60 rounded-md'
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className='mr-2' />
                    Thêm bài kiểm tra thể lực
                </button>
            </div>
            {loading ? <LoaderTable />
                : <TableComponent
                    dataCells={fitnessTests}
                    headCells={headCells}
                    search={search}
                    onRowClick={(id) => {
                        setShowFitnessTestDetail(true);
                        setFitnessTestDetail(fitnessTests.find((fitnessTest) => fitnessTest.id === id));
                    }}
                    modal={modal}
                    setDatas={setFitnessTests}
                    EditComponent={EditPractice}
                />
            }
            {/* Add modal component when needed */}
            {showModal && <AddFitnessTest setShowModal={setShowModal} showModal={showModal} setDatas={setFitnessTests} />}
            {showFitnessTestDetail && <PracticeDetail showModal={showFitnessTestDetail} setShowModal={setShowFitnessTestDetail} practiceStudent={fitnessTestDetail} />}
        </div>
    );
}

export default Practice;