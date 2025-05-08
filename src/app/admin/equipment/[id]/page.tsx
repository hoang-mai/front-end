'use client';
import { adminEquipmentDistribution } from "@/app/Services/api";
import { del, get, put } from "@/app/Services/callApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faSearch, faBox, faClipboard, faUsers, faCheck, faClock, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import EditEquipmentDistribution from "./editEquipmentDistribution";
import EditReceivedEquipment from "./editStudentDistributon";
import AddStudent from "./addStudent";
import DetailStudentDistribution from "./detailStudentDistribution";

interface DistributionResponse {
    distribution: Distribution;
    statistics: DistributionStatistics;
    studentReceipts: StudentReceipt[];
}

interface Distribution extends Record<string, unknown> {
    id: number,
    year: number,
    equipmentTypeId: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    equipmentTypeName: string,
    equipmentTypeDescription: string,
    equipmentTypeCreatedAt: Date,
    equipmentTypeUpdatedAt: Date
}


interface DistributionStatistics {
    totalStudents: number;
    receivedCount: number;
    pendingCount: number;
}

interface StudentReceipt extends Record<string, any> {
    id: number;
    received: string;
    receivedAt: Date | null;
    notes: string;
    studentId: number;
    studentName: string;
    studentEmail: string;
    studentCode: string | null;
}



function convertDistributionResponse(data: any): DistributionResponse {
    return {
        distribution: {
            id: data.distribution.id,
            year: data.distribution.year,
            quantity: data.distribution.quantity,
            createdAt: new Date(data.distribution.created_at),
            updatedAt: new Date(data.distribution.updated_at),
            equipmentTypeId: data.distribution.equipment_type.id,
            equipmentTypeName: data.distribution.equipment_type.name,
            equipmentTypeDescription: data.distribution.equipment_type.description,
            equipmentTypeCreatedAt: new Date(),
            equipmentTypeUpdatedAt: new Date(),
        },
        statistics: {
            totalStudents: data.statistics.total_students,
            receivedCount: data.statistics.received_count,
            pendingCount: data.statistics.pending_count
        },
        studentReceipts: data.student_receipts.map((receipt: any) => ({
            id: receipt.receipt_id,
            received: receipt.received ? 'Đã nhận' : 'Chưa nhận',
            receivedAt: receipt.received_at ? new Date(receipt.received_at) : null,
            notes: receipt.notes,

            studentId: receipt.student.id,
            studentName: receipt.student.name,
            studentEmail: receipt.student.email,
            studentCode: receipt.student.student_code,

        }))
    };
}


function EquipmentDistributionDetail() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const [distributionData, setDistributionData] = useState<DistributionResponse | null>(null);
    const [tableData, setTableData] = useState<StudentReceipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);

    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [detailEquipment, setDetailEquipment] = useState<StudentReceipt | null>(null);

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        fetchDistributionData();
    }, [params.id]);

    const fetchDistributionData = () => {
        setLoading(true);
        get(`${adminEquipmentDistribution}/${params.id}/detail`)
            .then((res) => {
                const responseData = convertDistributionResponse(res.data.data);
                setDistributionData(responseData);
                setTableData(responseData.studentReceipts);
            })
            .catch(() => {
                setError("Không tìm thấy đợt cấp phát này");
                toast.error("Không tìm thấy đợt cấp phát này");
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchDistributionDataReload();
    }, [reload]);
    const fetchDistributionDataReload = () => {

        get(`${adminEquipmentDistribution}/${params.id}/detail`)
            .then((res) => {
                const responseData = convertDistributionResponse(res.data.data);
                setDistributionData(responseData);
                setTableData(responseData.studentReceipts);
            })
            .catch((res) => {
                toast.error(res.data?.message || 'Đã có lỗi xảy ra');
                setError(res.data?.message || 'Đã có lỗi xảy ra');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleOnConfirmDeleteDistribution = () => {
        toast.promise(
            del(`${adminEquipmentDistribution}/${params.id}`, {}),
            {
                pending: "Đang xử lý...",
                success: "Xóa đợt cấp phát thành công",
                error: "Xóa đợt cấp phát thất bại",
            }
        ).then(() => {
            setShowModal(false);
            router.push('/admin/equipment');

        });
    };

    interface HeadCell {
        id: keyof StudentReceipt;
        label: string;
    }

    const headCells: HeadCell[] = [
        { id: 'studentName', label: 'Tên sinh viên' },
        { id: 'studentEmail', label: 'Email' },
        { id: 'received', label: 'Trạng thái' },
        { id: 'receivedAt', label: 'Thời gian nhận' },
        { id: 'notes', label: 'Ghi chú' },
    ];

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4">
            {loading ? (
                <>
                    <LoaderLine width="w-1/2" height="h-6" />
                    <div className="w-full flex flex-row gap-20">
                        <LoaderLine width="w-1/3" height="h-5" />
                        <LoaderLine width="w-1/3" height="h-5" />
                        <LoaderLine width="w-1/3" height="h-5" />
                    </div>
                    <div className="w-full flex flex-row gap-20 mb-10">
                        <LoaderLine width="w-1/2" height="h-5" />
                        <LoaderLine width="w-1/2" height="h-5" />
                    </div>
                    <LoaderTable />
                </>
            ) : (
                <>
                    {/* Back button */}
                    <div className="self-start">
                        <button onClick={() => router.push('/admin/equipment')}>
                            <FontAwesomeIcon
                                icon={faReply}
                                className="text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95"
                            />
                        </button>
                    </div>

                    {/* Header section */}
                    <div className="w-full flex flex-col items-center">
                        <h1 className="font-bold text-2xl text-center text-(--color-text) mb-2">
                            {distributionData?.distribution.equipmentTypeName} - Phân phối năm {distributionData?.distribution.year}
                        </h1>
                        <p className="text-gray-500 mb-4">
                            {distributionData?.distribution.equipmentTypeDescription}
                        </p>
                        {/* Statistics cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-4">
                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 border-l-4 border-l-blue-500 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-lg font-semibold mb-3 text-blue-600">Số lượng thiết bị</h2>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faBox} className="text-blue-500 text-xl" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-2xl">{distributionData?.distribution.quantity}</p>
                                        <p className="text-sm text-gray-600">Tổng số thiết bị</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 border-l-4 border-l-green-500 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-lg font-semibold mb-3 text-green-600">Tổng số sinh viên</h2>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faUsers} className="text-green-500 text-xl" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-2xl">{distributionData?.statistics.totalStudents}</p>
                                        <p className="text-sm text-gray-600">Sinh viên được phân phối</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 border-l-4 border-l-yellow-500 hover:shadow-lg transition-all duration-300">
                                <h2 className="text-lg font-semibold mb-3 text-yellow-600">Trạng thái nhận</h2>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                                        <FontAwesomeIcon icon={faClipboard} className="text-yellow-500 text-xl" />
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCheck} className="text-green-500 text-sm" />
                                            <p className="font-medium">{distributionData?.statistics.receivedCount} đã nhận</p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faClock} className="text-orange-500 text-sm" />
                                            <p className="font-medium">{distributionData?.statistics.pendingCount} chưa nhận</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className="flex flex-col lg:flex-row justify-between gap-5 mt-6 items-center">
                        <div className="flex flex-wrap gap-3 items-center">
                            {/* Tab Navigation Icons - moved to the left */}


                            <button
                                className="btn-text text-white h-10 px-4 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowAddStudent(true)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                <span>Thêm học viên</span>
                            </button>
                            <div className='relative'>
                                <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                                <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm học viên...' className='w-full shadow appearance-none border rounded-lg py-2 pl-10 pr-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--background-button) focus:border-transparent border-(--border-color) hover:border-(--border-color-hover)' />
                            </div>
                        </div>



                        <div className="flex gap-3 shrink-0">
                            <button
                                className="btn-text text-white h-10 px-5 rounded-lg flex items-center justify-center shadow-sm hover:shadow transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowEdit(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Chỉnh sửa
                            </button>
                            <button
                                className="bg-red-500 text-white h-10 px-5 rounded-lg flex items-center justify-center shadow-sm hover:bg-red-600 hover:shadow active:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                                onClick={() => setShowModal(true)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa đợt cấp phát
                            </button>
                        </div>
                    </div>
                    <Modal
                        open={showModal}
                        onClose={() => setShowModal(false)}
                        className="flex items-center justify-center"
                    >
                        <Box className="p-8 bg-white rounded-xl shadow-lg transform transition-all max-w-md w-full mx-4 animate-[fadeIn_0.3s_ease-in-out]">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="bg-red-100 p-3 rounded-full mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold text-gray-800 mb-2">Xác nhận xóa đợt trợ cấp này</h2>
                                <p className="text-gray-600">Bạn có chắc chắn muốn xóa đợt trợ cấp này <span className="font-semibold">{distributionData?.distribution.equipmentTypeName}- {distributionData?.distribution.year}</span>? Hành động này không thể hoàn tác.</p>
                            </div>

                            <div className="flex justify-center gap-4 mt-6">
                                <button
                                    className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                                    onClick={() => setShowModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                                    onClick={handleOnConfirmDeleteDistribution}
                                >
                                    Xác nhận xóa
                                </button>
                            </div>
                        </Box>
                    </Modal>
                    {
                        showAddStudent && distributionData &&
                        <AddStudent distributionId={distributionData.distribution.id} showAddStudent={showAddStudent} setShowAddStudent={setShowAddStudent} setReload={setReload} />
                    }
                    {showEdit && distributionData &&
                        <EditEquipmentDistribution
                            data={distributionData.distribution}
                            showEdit={showEdit}
                            setShowEdit={setShowEdit}
                            setData={setDistributionData}
                        />
                    }
                    {/* Students table */}
                    {tableData && <TableComponent dataCells={tableData} headCells={headCells} search={search} onRowClick={(id) => {
                        const selectedStudent = tableData.find((student) => student.id === id);
                        if (selectedStudent) {
                            setDetailEquipment(selectedStudent);
                            setShowDetailModal(true);
                        }
                    }} deleteCell={false} setReload={setReload} EditComponent={EditReceivedEquipment} setDatas={setTableData} />}
                    {showDetailModal && detailEquipment &&
                        <DetailStudentDistribution
                            studentReceipt={detailEquipment}
                            showModal={showDetailModal}
                            setShowModal={setShowDetailModal}
                        />
                    }
                </>
            )}
        </div>
    );
}

export default EquipmentDistributionDetail;