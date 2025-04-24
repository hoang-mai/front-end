'use client';

import React, { useEffect, useState } from 'react';
import EditProfileModal from './editProfileModal';
import Image from 'next/image';
import { get } from '@/app/Services/callApi';
import { toast } from 'react-toastify';
import LoaderLine from '@/app/Components/Loader/loaderLine';
import LoaderAvatar from '@/app/Components/Loader/loaderAvatar';

interface ProfileData {
    userId: number;
    fullName: string;
    rank: string;
    birthYear: number | null;
    hometown: string;
    phoneNumber: string;
    isPartyMember: boolean;
    photoUrl: string;
    managementUnit: string;
    workYear: number;
    permanentAddress: string;
    fatherName: string;
    motherName: string;
    fatherBirthYear: number | null;
    motherBirthYear: number | null;
    fatherHometown: string;
    motherHometown: string;
    fatherJob: string;
    motherJob: string;
}

const defaultProfileData: ProfileData = {
    userId: 0,
    fullName: '',
    rank: '',
    birthYear: null,
    hometown: '',
    phoneNumber: '',
    isPartyMember: false,
    photoUrl: '',
    managementUnit: '',
    workYear: 0,
    permanentAddress: '',
    fatherName: '',
    motherName: '',
    fatherBirthYear: null,
    motherBirthYear: null,
    fatherHometown: '',
    motherHometown: '',
    fatherJob: '',
    motherJob: ''
};

const ProfilePage: React.FC = () => {
    const [showEdit, setShowEdit] = React.useState<boolean>(false);
    const [profileData, setProfileData] = useState<ProfileData>(defaultProfileData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        get('/api/admin/profile')
            .then((res) => {
                setProfileData(res.data.data);
            })
            .catch((res) => {
                toast.error(res.data.message || 'Failed to load profile data');
                setError(res.data.message || 'Failed to load profile data');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className='xl:w-[90%] md:w-full flex flex-col gap-4 lg:gap-7'>
            <section className='border border-(--border-color) rounded-lg p-4 md:p-7 shadow-lg bg-green-50'>
                {loading ? (
                    <div className='flex items-center gap-4'>
                        <LoaderAvatar />
                        <div className='flex flex-col gap-2 w-40'>
                            <LoaderLine />
                            <LoaderLine />
                        </div>
                    </div>
                ) : (
                    <div className='flex items-center gap-4'>
                        <div className='relative w-25 h-25 rounded-full border flex items-center justify-center border-(--border-color)'>
                            <Image 
                                src={profileData.photoUrl || "/avatarDefault.svg"} 
                                alt="profile" 
                                className="w-15 h-15" 
                                fill 
                            />
                        </div>
                        <span>
                            <span className="text-lg font-medium">{profileData.fullName}</span>
                            <div>Năm sinh: {profileData.birthYear}</div>
                        </span>
                    </div>
                )}
            </section>
            <div className='flex gap-4 lg:flex-row flex-col lg:gap-7'>
                <section className='w-full lg:w-1/2 border p-4 md:p-7 rounded-lg border-(--border-color) flex flex-col items-center gap-4 md:gap-7 shadow-lg'>
                    <h2 className='text-lg font-semibold text-(--color-text)'>Thông tin cá nhân</h2>
                    {loading ? (
                        <div className='w-full flex flex-col gap-3'>
                            {Array(7).fill(0).map((_, i) => (
                                <LoaderLine key={i} />
                            ))}
                        </div>
                    ) : (
                        <div className='w-full flex flex-col gap-4'>
                            <div>Cấp bậc: {profileData.rank}</div>
                            <div>Quê quán: {profileData.hometown}</div>
                            <div>Đơn vị công tác: {profileData.managementUnit}</div>
                            <div>Năm công tác: {profileData.workYear}</div>
                            <div>Đảng viên / Đoàn viên: {profileData.isPartyMember ? 'Đảng viên' : 'Đoàn viên'}</div>
                            <div>Số điện thoại: {profileData.phoneNumber}</div>
                            <div>Hộ khẩu thường chú: {profileData.permanentAddress}</div>
                        </div>
                    )}
                    <button 
                        className='md:relative md:-bottom-5 btn-text text-white h-10 w-30 rounded-lg' 
                        onClick={() => setShowEdit(true)}
                        disabled={loading}
                    >
                        Chỉnh sửa
                    </button>
                </section>
                <div className='w-full lg:w-1/2 flex flex-col gap-4 lg:gap-7'>
                    <section className='border p-4 rounded-lg border-(--border-color) flex flex-col items-center gap-2 shadow-lg'>
                        <h2 className='text-lg font-semibold text-(--color-text)'>Thông tin bố</h2>
                        {loading ? (
                            <div className='w-full flex flex-col gap-2'>
                                {Array(5).fill(0).map((_, i) => (
                                    <LoaderLine key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className='w-full flex flex-col gap-2'>
                                <div>Họ và tên: {profileData.fatherName}</div>
                                <div>Năm sinh: {profileData.fatherBirthYear}</div>
                                <div>Quê quán: {profileData.fatherHometown}</div>
                                <div>Nghề nghiệp: {profileData.fatherJob}</div>
                            </div>
                        )}
                    </section>
                    <section className='border p-4 rounded-lg border-(--border-color) flex flex-col items-center gap-2 shadow-lg'>
                        <h2 className='text-lg font-semibold text-(--color-text)'>Thông tin mẹ</h2>
                        {loading ? (
                            <div className='w-full flex flex-col gap-2'>
                                {Array(5).fill(0).map((_, i) => (
                                    <LoaderLine key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className='w-full flex flex-col gap-2'>
                                <div>Họ và tên: {profileData.motherName}</div>
                                <div>Năm sinh: {profileData.motherBirthYear}</div>
                                <div>Quê quán: {profileData.motherHometown}</div>
                                <div>Nghề nghiệp: {profileData.motherJob}</div>
                            </div>
                        )}
                    </section>
                </div>
            </div>

            {showEdit && <EditProfileModal showEdit={showEdit} setShowEdit={setShowEdit} profileData={profileData} setProfileData={setProfileData} />}
        </div>
    );
};

export default ProfilePage;