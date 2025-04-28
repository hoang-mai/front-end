'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { get } from '@/app/Services/callApi';
import { toast } from 'react-toastify';
import LoaderLine from '@/app/Components/Loader/loaderLine';
import LoaderAvatar from '@/app/Components/Loader/loaderAvatar';
import { managerProfile } from '@/app/Services/api';

// Material UI Icons
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CakeIcon from '@mui/icons-material/Cake';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import FlagIcon from '@mui/icons-material/Flag';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';

// Import for edit modal

import EditManagerModal from './editProfileModal';

interface Manager {
    id: number;
    name: string;
    email: string;
    image: string | null;
    detail: ManagerDetail;
}

interface ManagerDetail {
    userId: number;
    fullName: string ;
    rank: string ;
    birthYear: number | null ;
    hometown: string ;
    phoneNumber: string ;
    isPartyMember: boolean;
    managementUnit: string;
    fatherName: string ;
    fatherBirthYear: number | null;
    motherName: string ;
    motherBirthYear: number | null;
    fatherHometown: string ;
    motherHometown: string ;
    fatherJob?: string ;
    motherJob?: string ;
    workYear?: number ;
    permanentAddress: string ;
    createdAt: Date;
    updatedAt: Date;
}

function convertManager(data: any): Manager {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        image: data.image,
        detail: {
            userId: data.detail.user_id,
            fullName: data.detail.full_name,
            rank: data.detail.rank,
            birthYear: data.detail.birth_year,
            hometown: data.detail.hometown,
            phoneNumber: data.detail.phone_number,
            isPartyMember: data.detail.is_party_member,
            managementUnit: data.detail.management_unit,
            workYear: data.detail.work_year,
            fatherName: data.detail.father_name,
            fatherBirthYear: data.detail.father_birth_year,
            motherName: data.detail.mother_name,
            motherBirthYear: data.detail.mother_birth_year,
            fatherHometown: data.detail.father_hometown,
            motherHometown: data.detail.mother_hometown,
            fatherJob: data.detail.father_job,
            motherJob: data.detail.mother_job,
            permanentAddress: data.detail.permanent_address,
            createdAt: data.detail.created_at,
            updatedAt: data.detail.updated_at,
        }
    };
}

const defaultProfileData: Manager = {
    id: 0,
    name: '',
    email: '',
    image: null,
    detail: {
        userId: 0,
        fullName: '',
        rank: '',
        birthYear: null,
        hometown: '',
        phoneNumber: '',
        isPartyMember: false,
        managementUnit: '',
        fatherName: '',
        fatherBirthYear: null,
        motherName: '',
        motherBirthYear: null,
        fatherHometown: '',
        motherHometown: '',
        fatherJob: '',
        motherJob: '',
        permanentAddress: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
};

const ProfilePage: React.FC = () => {
    const [profileData, setProfileData] = useState<Manager>(defaultProfileData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [showEditModal, setShowEditModal] = useState<boolean>(false);

    useEffect(() => {
        get(managerProfile)
            .then((res) => {
                setProfileData(convertManager(res.data.data));
            })
            .catch((res) => {
                toast.error(res.data.message ?? 'Failed to load profile data');
                setError(res.data.message ?? 'Failed to load profile data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (error) {
        return (
            <div className="w-full px-6 py-8 flex justify-center">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-red-600 max-w-md">
                    <p className="font-semibold text-lg mb-2">Đã xảy ra lỗi</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="xl:w-[90%] md:w-full mx-auto flex flex-col gap-6">
            {/* Profile content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile sidebar */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative bg-gradient-to-r from-green-50 to-green-100 p-6 flex flex-col items-center border-b border-(--border-color)">
                        {loading ? (
                            <LoaderAvatar />
                        ) : (
                            <div className="relative mb-4">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                                    <Image
                                        src={(profileData.image && profileData.image !== 'default') ? profileData.image : '/avatarDefault.svg'}
                                        alt="Ảnh đại diện"
                                        width={112}
                                        height={112}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center w-full gap-2 flex flex-col items-center">
                                <LoaderLine width="w-3/4" height="h-6" />
                                <LoaderLine width="w-1/2" height="h-4" />
                            </div>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-(--color-text) mb-1">
                                    {profileData.name || profileData.detail.fullName || "Chưa cập nhật"}
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    {profileData.email || "Không có email"}
                                </p>
                                <div className="font-bold inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-md text-(--color-text)">
                                    <MilitaryTechIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    {profileData.detail.rank || "Chưa cập nhật cấp bậc"}
                                </div>
                            </div>
                        )}
                    </div>

                    {!loading && (
                        <div className="p-4">
                            <div className="mb-5">
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3 border-b pb-1">Thông tin liên hệ</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <PhoneIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span>{profileData.detail.phoneNumber || "Chưa cập nhật"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <BusinessIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span>{profileData.detail.managementUnit || "Chưa cập nhật"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <HomeIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span>{profileData.detail.permanentAddress || "Chưa cập nhật"}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3 border-b pb-1">Thông tin khác</h3>
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                        <FlagIcon sx={{ fontSize: 18 }} />
                                    </div>
                                    <span>Đảng viên: {profileData.detail.isPartyMember ? "Có" : "Không"}</span>
                                </div>
                                <div className="flex items-center justify-center mt-4">
                                    <button
                                        className="btn-text text-white py-2 px-4 rounded-md flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={() => setShowEditModal(true)}
                                    >
                                        <EditIcon sx={{ fontSize: 20 }} />
                                        <span>Chỉnh sửa hồ sơ</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Main content area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 bg-gray-200 bg-opacity-10 flex items-center border-b border-(--border-color)">
                            <BadgeIcon sx={{ color: 'var(--color-text)', mr: 1 }} />
                            <h2 className="text-lg font-semibold text-(--color-text)">Thông tin cá nhân</h2>
                        </div>

                        <div className="p-5">
                            {loading ? (
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 mr-3 flex-shrink-0"></div>
                                        <LoaderLine width="w-full" height="h-6" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 mr-3 flex-shrink-0"></div>
                                        <LoaderLine width="w-full" height="h-6" />
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 mr-3 flex-shrink-0"></div>
                                        <LoaderLine width="w-full" height="h-6" />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                            <PersonIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Họ và tên</p>
                                            <p className="font-medium">{profileData.detail.fullName || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                            <CakeIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Năm sinh</p>
                                            <p className="font-medium">{profileData.detail.birthYear || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                            <LocationOnIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quê quán</p>
                                            <p className="font-medium">{profileData.detail.hometown || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>
                                    
                                    
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Family Information Card */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-4 bg-gray-200 bg-opacity-10 flex items-center border-b border-(--border-color)">
                            <PeopleIcon sx={{ color: 'var(--color-text)', mr: 1 }} />
                            <h2 className="text-lg font-semibold text-(--color-text)">Thông tin gia đình</h2>
                        </div>

                        <div className="p-5">
                            {loading ? (
                                <div className="space-y-4">
                                    <LoaderLine width="w-full" height="h-6" />
                                    <LoaderLine width="w-full" height="h-6" />
                                    <LoaderLine width="w-full" height="h-6" />
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Father information */}
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-(--border-color)">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-md font-semibold text-(--color-text)">Thông tin bố</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <PersonIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                                    <p className="font-medium">{profileData.detail.fatherName || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <CakeIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Năm sinh</p>
                                                    <p className="font-medium">{profileData.detail.fatherBirthYear || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <LocationOnIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Quê quán</p>
                                                    <p className="font-medium">{profileData.detail.fatherHometown || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            
                                        </div>
                                    </div>

                                    {/* Mother information */}
                                    <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-(--border-color)">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="text-md font-semibold text-(--color-text)">Thông tin mẹ</h3>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <PersonIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Họ và tên</p>
                                                    <p className="font-medium">{profileData.detail.motherName || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <CakeIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Năm sinh</p>
                                                    <p className="font-medium">{profileData.detail.motherBirthYear || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <LocationOnIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Quê quán</p>
                                                    <p className="font-medium">{profileData.detail.motherHometown || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                           
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showEditModal && <EditManagerModal setShowEdit={setShowEditModal} showEdit={showEditModal} manager={profileData} setManager={setProfileData} />}
        </div>
    );
};

export default ProfilePage;