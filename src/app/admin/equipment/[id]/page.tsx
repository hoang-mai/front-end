'use client';
import { adminEquipmentDistribution } from "@/app/Services/api";
import { get, put } from "@/app/Services/callApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoaderLine from "@/app/Components/Loader/loaderLine";
import LoaderTable from "@/app/Components/Loader/loaderTable";
import TableComponent from "@/app/Components/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply, faSearch, faBox, faClipboard, faUsers, faCheck, faClock } from "@fortawesome/free-solid-svg-icons";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

interface DistributionResponse {
    distribution: Distribution;
    statistics: DistributionStatistics;
    studentReceipts: StudentReceipt[];
}

interface Distribution {
    id: number;
    year: number;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
    equipmentType: EquipmentType;
}

interface EquipmentType {
    id: number;
    name: string;
    description: string;
}

interface DistributionStatistics {
    totalStudents: number;
    receivedCount: number;
    pendingCount: number;
}

interface StudentReceipt extends Record<string, any> {
    id: number;
    received: boolean;
    receivedAt: Date;
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
            equipmentType: {
                id: data.distribution.equipment_type.id,
                name: data.distribution.equipment_type.name,
                description: data.distribution.equipment_type.description,
            }
        },
        statistics: {
            totalStudents: data.statistics.total_students,
            receivedCount: data.statistics.received_count,
            pendingCount: data.statistics.pending_count
        },
        studentReceipts: data.student_receipts.map((receipt: any) => ({
            id: receipt.receipt_id,
            received: receipt.received,
            receivedAt: new Date(receipt.received_at),
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
    const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);


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
            .catch((res) => {
                toast.error(res.data?.message || 'Đã có lỗi xảy ra');
                setError(res.data?.message || 'Đã có lỗi xảy ra');
            })
            .finally(() => {
                setLoading(false);
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
                            {distributionData?.distribution.equipmentType.name} - Phân phối năm {distributionData?.distribution.year}
                        </h1>
                        <p className="text-gray-500 mb-4">
                            {distributionData?.distribution.equipmentType.description}
                        </p>
                    </div>

                    {/* Statistics cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faBox} className="text-blue-500" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500">Số lượng</h2>
                                    <p className="text-xl font-bold text-(--color-text)">{distributionData?.distribution.quantity}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faUsers} className="text-green-500" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500">Tổng số sinh viên</h2>
                                    <p className="text-xl font-bold text-(--color-text)">{distributionData?.statistics.totalStudents}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faClipboard} className="text-yellow-500" />
                                </div>
                                <div className="ml-4">
                                    <h2 className="text-sm font-medium text-gray-500">Đã nhận / Chưa nhận</h2>
                                    <p className="text-xl font-bold text-(--color-text)">
                                        {distributionData?.statistics.receivedCount} / {distributionData?.statistics.pendingCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search bar */}
                    <div className="w-full flex items-center relative px-6 mb-4">
                        <div className="relative w-full md:w-1/3">
                            <FontAwesomeIcon icon={faSearch} className="absolute opacity-50 top-3 left-2 cursor-pointer" />
                            <input
                                value={search}
                                onChange={handleOnChangeSearch}
                                type="text"
                                placeholder="Tìm kiếm sinh viên"
                                className="shadow appearance-none border rounded-2xl w-full py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                            />
                        </div>
                    </div>

                    {/* Students table */}
                    {tableData && <TableComponent dataCells={tableData} headCells={headCells} search={search} onRowClick={() => { }} />}

                </>
            )}
        </div>
    );
}

export default EquipmentDistributionDetail;