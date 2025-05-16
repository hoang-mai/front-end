'use client';
import { faXmark, faUser, faStopwatch, faStar, faClipboard, faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Box, Modal } from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

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

function formatDate(date: Date | null): string {
    if (!date) return 'Không có ngày';
    return new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getRatingColor(rating: string): string {
    switch (rating.toLowerCase()) {
        case 'xuất sắc':
            return 'text-green-600';
        case 'tốt':
            return 'text-blue-500';
        case 'đạt':
            return 'text-yellow-500';
        case 'không đạt':
            return 'text-red-500';
        default:
            return 'text-gray-500';
    }
}

interface PracticeDetailProps {
    readonly showDetail: boolean;
    readonly setShowDetail: (show: boolean) => void;
    readonly assessment: FitnessTestAssessment | undefined;
}

function PracticeDetail({
    assessment,
    showDetail,
    setShowDetail
}: PracticeDetailProps) {
    const [ratingColor, setRatingColor] = useState<string>('text-gray-500');

    useEffect(() => {
        if (assessment?.rating) {
            setRatingColor(getRatingColor(assessment.rating));
        }
    }, [assessment]);

    return (
        <Modal
            open={showDetail}
            onClose={() => setShowDetail(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowDetail(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Thông tin bài kiểm tra thể lực</h2>
                </div>

                <div className="p-6">
                    {/* Test name header section */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center mb-4 shadow-lg">
                            <FitnessCenterIcon sx={{ fontSize: 48, color: 'rgba(59, 130, 246, 0.8)' }} />
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-center'>
                            {assessment?.fitnessTestName}
                        </h1>
                    </div>

                    {/* Rating badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${
                            ratingColor === 'text-green-600' ? 'bg-green-100' :
                            ratingColor === 'text-blue-500' ? 'bg-blue-100' :
                            ratingColor === 'text-yellow-500' ? 'bg-yellow-100' :
                            ratingColor === 'text-red-500' ? 'bg-red-100' : 'bg-gray-100'
                        } flex items-center`}>
                            <FontAwesomeIcon icon={faStar} className={`${ratingColor} mr-2`} />
                            <span className={`font-medium ${ratingColor}`}>{assessment?.rating || 'Chưa đánh giá'}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">


                        <InfoItem
                            icon={faStopwatch}
                            label="Kết quả thực hiện"
                            value={assessment?.performance || 'Chưa có kết quả'}
                            highlighted={true}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Ghi nhận lúc"
                            value={assessment?.recordedAt ? formatDate(assessment.recordedAt) : 'Không có thông tin'}
                        />

                        <InfoItem
                            icon={faClipboard}
                            label="Cập nhật lúc"
                            value={assessment?.updatedAt ? formatDate(assessment.updatedAt) : 'Không có thông tin'}
                        />

                        <InfoItem
                            icon={faNoteSticky}
                            label="Ghi chú"
                            value={assessment?.notes || 'Không có ghi chú'}
                            
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
    highlighted?: boolean;
}

const InfoItem = ({ icon, label, value, fullWidth = false, small = false, highlighted = false }: InfoItemProps) => {
    return (
        <div className={`${highlighted ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-3 shadow-sm border ${highlighted ? 'border-blue-200' : 'border-gray-200'} ${fullWidth ? 'md:col-span-2' : ''}`}>
            <div className="flex items-center mb-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${highlighted ? 'text-blue-600' : ''}`}>
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium ${highlighted ? 'text-blue-700' : 'text-gray-800'} ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
};

export default PracticeDetail;
