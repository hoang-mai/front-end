'use client';

import React, { useEffect } from 'react';
import EditProfileModal from './editProfileModal';
import Image from 'next/image';
import { get } from '@/app/Services/callApi';
import { studentProfile } from '@/app/Services/api';
import { toast } from 'react-toastify';
import LoaderLine from '@/app/Components/Loader/loaderLine';
import LoaderAvatar from '@/app/Components/Loader/loaderAvatar';

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
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export interface UserWithStudentDetail {
    id: number;
    name: string;
    email: string | null;
    role: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    studentDetail: StudentDetail;
}

export interface StudentDetail {
    id: number;
    userId: number;
    dateOfBirth: Date  | null;
    rank: string | null;
    placeOfOrigin: string | null;
    workingUnit: string | null;
    yearOfStudy: number | null;
    politicalStatus: string | null;
    phoneNumber: string | null;
    permanentResidence: string | null;
    father: ParentInfo;
    mother: ParentInfo;
    createdAt: string;
    updatedAt: string;
}

export interface ParentInfo {
    name: string | null;
    birthYear: number | null;
    phoneNumber: string | null;
    placeOfOrigin: string | null;
    occupation: string | null;
}

function convertPoliticalStatusToString(status: string | null): string {
    if (status === 'party_member') {
        return 'Đảng viên';
    } else if (status === 'youth_union_member') {
        return 'Đoàn viên';
    }else if (status === 'none') {
        return 'Không';
    } else {
        return 'Chưa cập nhật';
    }
}

function convertUserWithStudentDetail(data: any): UserWithStudentDetail {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        image: data.image,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        studentDetail: {
            id: data.student_detail.id,
            userId: data.student_detail.user_id,
            dateOfBirth: new Date(data.student_detail.date_of_birth),
            rank: data.student_detail.rank,
            placeOfOrigin: data.student_detail.place_of_origin,
            workingUnit: data.student_detail.working_unit,
            yearOfStudy: data.student_detail.year_of_study,
            politicalStatus: convertPoliticalStatusToString(data.student_detail.political_status),
            phoneNumber: data.student_detail.phone_number,
            permanentResidence: data.student_detail.permanent_residence,
            father: {
                name: data.student_detail.father.name,
                birthYear: data.student_detail.father.birth_year,
                phoneNumber: data.student_detail.father.phone_number,
                placeOfOrigin: data.student_detail.father.place_of_origin,
                occupation: data.student_detail.father.occupation,
            },
            mother: {
                name: data.student_detail.mother.name,
                birthYear: data.student_detail.mother.birth_year,
                phoneNumber: data.student_detail.mother.phone_number,
                placeOfOrigin: data.student_detail.mother.place_of_origin,
                occupation: data.student_detail.mother.occupation,
            },
            createdAt: data.student_detail.created_at,
            updatedAt: data.student_detail.updated_at,
        },
    };
}
const profileDefault: UserWithStudentDetail = {
    id: 0,
    name: '',
    email: '',
    role: '',
    image: null,
    createdAt: '',
    updatedAt: '',
    studentDetail: {
        id: 0,
        userId: 0,
        dateOfBirth: null,
        rank: null,
        placeOfOrigin: null,
        workingUnit: null,
        yearOfStudy: null,
        politicalStatus: null,
        phoneNumber: null,
        permanentResidence: null,
        father: {
            name: null,
            birthYear: null,
            phoneNumber: null,
            placeOfOrigin: null,
            occupation: null,
        },
        mother: {
            name: null,
            birthYear: null,
            phoneNumber: null,
            placeOfOrigin: null,
            occupation: null,
        },
        createdAt: '',
        updatedAt: '',
    },
};

function ProfilePage() {
    const [userProfile, setUserProfile] = React.useState<UserWithStudentDetail>(profileDefault);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const [showEdit, setShowEdit] = React.useState<boolean>(false);

    useEffect(() => {
        get(studentProfile)
            .then(response => {
                setUserProfile(convertUserWithStudentDetail(response.data.data));
            })
            .catch(err => {
                setError(err.data.message);
                toast.error(err.data.message);
            }).finally(() => {
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
                    <div className="relative bg-gradient-to-r from-green-50 to-green-100 p-6 pb-2 flex flex-col items-center border-b border-(--border-color)">
                        {loading ? (
                            <LoaderAvatar />
                        ) : (
                            <div className="relative mb-4">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                                    <Image
                                        src={(userProfile.image && userProfile.image !== 'default') ? userProfile.image : '/avatarDefault.svg'}
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
                                    {userProfile?.name || "Chưa cập nhật tên"}
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    {userProfile?.email || "Không có email"}
                                </p>
                                <div className="font-bold inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-md text-(--color-text)">
                                    <MilitaryTechIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                    {userProfile?.studentDetail?.rank || "Chưa cập nhật cấp bậc"}
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
                                        <span>{userProfile?.studentDetail?.phoneNumber || "Chưa cập nhật"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <BusinessIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span>{userProfile?.studentDetail?.workingUnit || "Chưa cập nhật"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <HomeIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span>{userProfile?.studentDetail?.permanentResidence || "Chưa cập nhật"}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm uppercase text-gray-500 font-semibold mb-3 border-b pb-1">Thông tin khác</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span >Năm học: {userProfile?.studentDetail?.yearOfStudy || "Chưa cập nhật"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                            <FlagIcon sx={{ fontSize: 18 }} />
                                        </div>
                                        <span>Đảng viên/Đoàn viên: {userProfile?.studentDetail?.politicalStatus ? userProfile.studentDetail.politicalStatus : "Chưa cập nhật"}</span>
                                    </div>

                                </div>
                                <div className="flex items-center justify-center mt-4">
                                    <button
                                        className="btn-text text-white py-2 px-4 rounded-md flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                                        onClick={() => setShowEdit(true)}
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
                                            <CakeIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Ngày sinh</p>
                                            <p className="font-medium">{userProfile.studentDetail.dateOfBirth?.toLocaleDateString('vi-VN') || "Chưa cập nhật"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                            <LocationOnIcon />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quê quán</p>
                                            <p className="font-medium">{userProfile?.studentDetail?.placeOfOrigin || "Chưa cập nhật"}</p>
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
                                                    <p className="font-medium">{userProfile?.studentDetail?.father?.name || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <CakeIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Năm sinh</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.father?.birthYear || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <PhoneIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.father?.phoneNumber || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <LocationOnIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Quê quán</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.father?.placeOfOrigin || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <WorkIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Nghề nghiệp</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.father?.occupation || "Chưa cập nhật"}</p>
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
                                                    <p className="font-medium">{userProfile?.studentDetail?.mother?.name || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <CakeIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Năm sinh</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.mother?.birthYear || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <PhoneIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.mother?.phoneNumber || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <LocationOnIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Quê quán</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.mother?.placeOfOrigin || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <WorkIcon fontSize="small" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Nghề nghiệp</p>
                                                    <p className="font-medium">{userProfile?.studentDetail?.mother?.occupation || "Chưa cập nhật"}</p>
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

            {showEdit && userProfile && <EditProfileModal userWithStudentDetail={userProfile} setUserWithStudentDetail={setUserProfile} showEdit={showEdit} setShowEdit={setShowEdit} />}
        </div>
    );
};

export default ProfilePage;