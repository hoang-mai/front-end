import { faXmark, faUser, faEnvelope, faUserTag, faCheckCircle, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    image: string | null;

}

interface StudentDetailProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly student: Student | undefined;
}

function StudentDetail({ student, showModal, setShowModal }: StudentDetailProps) {
    const [statusColor, setStatusColor] = useState<string>('');
    
    useEffect(() => {
        setStatusColor(student?.status === 'Đang học' ? 'text-green-500' : 'text-yellow-500');
    }, [student]);

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
                    <h2 className='text-center text-2xl font-bold text-white'>Thông tin học viên</h2>
                </div>

                <div className="p-6">
                    {/* Student name header section with image */}
                    <div className='w-full flex flex-col items-center justify-center mb-6'>
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg mb-4">
                            {student?.image && student.image !== 'default' ? (
                                <Image
                                    src={student.image}
                                    alt={student.name || "Ảnh đại diện"}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <FontAwesomeIcon icon={faUser} className="text-gray-400 text-3xl" />
                                </div>
                            )}
                        </div>
                        <h1 className='text-xl md:text-2xl font-bold text-(--color-text)'>
                            {student?.name ?? "Không tìm thấy"}
                        </h1>
                    </div>

                    {/* Status badge */}
                    <div className="flex justify-center mb-6">
                        <div className={`px-4 py-2 rounded-full ${statusColor === 'text-green-500' ? 'bg-green-100' : 'bg-yellow-100'} flex items-center`}>
                            <FontAwesomeIcon 
                                icon={statusColor === 'text-green-500' ? faCheckCircle : faClock} 
                                className={`${statusColor} mr-2`} 
                            />
                            <span className={`font-medium ${statusColor}`}>{student?.status ?? 'N/A'}</span>
                        </div>
                    </div>

                    {/* Main content - information cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-2 md:px-4">
                    
                        <InfoItem
                            icon={faEnvelope}
                            label="Email"
                            value={student?.email ?? 'N/A'}
                        />

                        <InfoItem
                            icon={faUserTag}
                            label="Vai trò"
                            value={student?.role ?? 'N/A'}
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
                    <FontAwesomeIcon icon={icon} />
                </div>
                <span className={`ml-2 text-gray-500 ${small ? 'text-sm' : ''}`}>{label}</span>
            </div>
            <div className={`pl-10 font-medium text-gray-800 ${small ? 'text-sm' : 'text-base'} whitespace-pre-wrap break-words`}>
                {value}
            </div>
        </div>
    );
};

export default StudentDetail;