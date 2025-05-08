'use client'
import useDebounce from "@/app/hooks/useDebounce";
import { managerSearchStudent, managerAssessmentsPractice, managerFitnessTests, managerAssessments, managerAssessmentsBatch } from "@/app/Services/api";
import { get, post } from "@/app/Services/callApi";
import { useEffect, useRef, useState } from "react";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSearch, faCalendarAlt, faStickyNote, faUserCheck, faInfoCircle, faSave, faDumbbell, faCheckCircle, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import PersonIcon from '@mui/icons-material/Person';
import DatePicker from "@/app/Components/datePicker";
import { set } from "date-fns";
import AddPracticeSingle from "./addPracticeSingle";
import AddPracticeBulk from "./addPracticeBulk";

// Tab types
type TabType = 'single' | 'bulk';

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
function convertDataToFitnessTest(data: any): FitnessTest[] {
    return data.data.map((item: any) => ({
        id: item.id,
        name: item.name,
        unit: item.unit,
        higherIsBetter: item.higher_is_better ? "Càng cao càng tốt" : "Càng thấp càng tốt",
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        thresholdsExcellentThreshold: item.thresholds.excellent_threshold,
        thresholdsGoodThreshold: item.thresholds.good_threshold,
        thresholdsPassThreshold: item.thresholds.pass_threshold,
    }));
}

interface PracticeProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas: any;
    readonly weekId: number;
}

function AddPractice({ showModal, setShowModal, setDatas, weekId }: PracticeProps) {

    const [activeTab, setActiveTab] = useState<TabType>('single');

    const [fitnessTests, setFitnessTests] = useState<FitnessTest[]>([]);
    const [filteredFitnessTests, setFilteredFitnessTests] = useState<FitnessTest[]>([]);




    const [error, setError] = useState<string>('');

    useEffect(() => {
        get(managerFitnessTests)
            .then((res) => {
                setFitnessTests(convertDataToFitnessTest(res.data.data));
                setFilteredFitnessTests(convertDataToFitnessTest(res.data.data));
            }).catch((err) => {
                const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                setError(firstValue);
            });
    }, [])


    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[60%] lg:w-[60%] md:w-[80%] w-[95%] h-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowModal(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thêm đánh giá tập luyện</h2>
                </div>

                <div className="p-4 m-2 overflow-y-auto max-h-[80vh]">
                    {/* Tabs */}
                    <div className="flex justify-center mb-6">
                        <button
                            className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'single' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setActiveTab('single')}
                        >
                            <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                            Thêm đánh giá cá nhân
                        </button>
                        <button
                            className={`px-4 py-2 rounded-lg font-medium ml-4 ${activeTab === 'bulk' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            onClick={() => setActiveTab('bulk')}
                        >
                            <FontAwesomeIcon icon={faUsers} className="mr-2" />
                            Thêm đánh giá hàng loạt
                        </button>
                    </div>

                    {activeTab === 'single' ? (
                        // Single assessment tab content
                        <AddPracticeSingle
                            setFilteredFitnessTests={setFilteredFitnessTests}
                            filteredFitnessTests={filteredFitnessTests}
                            error={error}
                            setError={setError}
                            weekId={weekId}
                            fitnessTests={fitnessTests}
                            setDatas={setDatas}
                            setShowModal={setShowModal} />
                    ) : (
                        // Bulk assessment tab content
                        <AddPracticeBulk
                            error={error}
                            
                            setShowModal={setShowModal}
                            setDatas={setDatas}
                            weekId={weekId}
                            filteredFitnessTests={filteredFitnessTests}
                            setError={setError}
                            fitnessTests={fitnessTests}
                            setFilteredFitnessTests={setFilteredFitnessTests}

                        />
                    )}
                </div>
            </Box>
        </Modal>
    );
}

export default AddPractice;