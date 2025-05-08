'use client';
import { faXmark, faUser, faEnvelope, faBox, faCalendar, faClipboard, faCheckCircle, faBoxOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Modal } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';

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

interface DetailEquipmentProps {
    readonly student: Student;
    readonly equipmentRecord: EquipmentRecord;
    readonly showModal: boolean;
    readonly setShowModal: Dispatch<SetStateAction<boolean>>;
}

function DetailEquipment({ equipmentRecord, student, showModal, setShowModal }: DetailEquipmentProps) {

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return 'Chưa nhận';
        return new Date(date).toLocaleDateString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Function to get color based on received status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Đã nhận':
                return 'bg-green-100 text-green-500';
            case 'Chưa nhận':
                return 'bg-red-100 text-red-500';
            default:
                return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowModal(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Chi tiết trang bị</h2>
                </div>

                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    {/* Student name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <div className="w-25 h-25 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                            {student?.image && student.image !== 'default'? (
                                <img
                                    src={student.image}
                                    alt={student.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <PersonIcon sx={{ fontSize: 64, color: 'rgba(107, 114, 128, 0.8)' }} />
                                </div>
                            )}
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-[color:var(--color-text)]'>
                            {student.name ?? "Không tìm thấy thông tin"}
                        </h1>
                    </div>



                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${getStatusColor(equipmentRecord.received)} flex items-center`}>
                            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                            <span className="font-medium">{equipmentRecord.received}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">


                        <InfoItem
                            icon={faEnvelope}
                            label="Email"
                            value={student.email ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faBox}
                            label="Trang bị"
                            value={equipmentRecord?.distribution?.equipmentType?.name ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faBoxOpen}
                            label="Mô tả"
                            value={equipmentRecord?.distribution?.equipmentType?.description ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Năm phân phối"
                            value={equipmentRecord?.distribution?.year?.toString() ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Ngày nhận"
                            value={formatDate(equipmentRecord?.receivedAt)}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Ghi chú"
                            value={equipmentRecord?.notes ?? ''}

                        />
                        <InfoItem
                            icon={faCalendar}
                            label="Ngày tạo"
                            value={formatDate(equipmentRecord?.createdAt)}
                        />

                        <InfoItem
                            icon={faCalendar}
                            label="Ngày cập nhật"
                            value={formatDate(equipmentRecord?.updatedAt)}
                        />

                    </div>
                </div>
            </Box>
        </Modal>
    );
}

interface InfoItemProps {
    icon: typeof faUser;
    label: string;
    value: string;
    fullWidth?: boolean;
    small?: boolean;
}

const InfoItem = ({ icon, label, value, fullWidth = false, small = false }: InfoItemProps) => {
    return (
        <div className={`bg-gray-50 rounded-lg p-3 shadow-sm border border-gray-200 ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center`}>
                    <FontAwesomeIcon icon={icon} className="text-gray-400" />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium text-gray-800 ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
};

export default DetailEquipment;