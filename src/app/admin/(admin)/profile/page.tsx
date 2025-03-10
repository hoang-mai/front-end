'use client';

import React from 'react';
import EditProfileModal from './editProfileModal';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
    
    const [showEdit, setShowEdit] = React.useState<boolean>(false);
    return (
        <div className='w-full flex flex-col gap-4 lg:gap-7'>
            
                    <section className='border border-(--border-color) rounded-lg p-4 md:p-7 shadow-lg bg-green-50'>
                        <div className='flex items-center gap-4'>
                            <div className='relative w-25 h-25 rounded-full border flex items-center justify-center border-(--border-color)'>
                                <Image src="avatarDefault.svg" alt="profile" className="w-15 h-15 " fill />
                            </div>
                            <span>
                                <span>fullname</span>
                                <div>Ngày sinh</div>
                            </span>
                        </div>
                    </section>
                    <div className='flex gap-4 lg:flex-row flex-col lg:gap-7'>
                        <section className='w-full lg:w-1/2 border p-4 md:p-7 rounded-lg border-(--border-color) flex flex-col items-center  gap-4 md:gap-7 shadow-lg'>
                            <h2 className='text-lg font-semibold text-(--color-text)'>Thông tin cá nhân</h2>
                            <div className='w-full flex flex-col gap-4 '>
                                <div>Cấp bậc: </div>
                                <div>Quê quán: </div>
                                <div>Đơn vị công tác: </div>
                                <div>Năm công tác: </div>
                                <div>Đảng viên / Đoàn viên: </div>
                                <div>Số điện thoại:</div>
                                <div>Hộ khẩu thường chú:</div>
                            </div>
                            <button className='md:relative md:-bottom-5 btn-text text-white h-10 w-30 rounded-lg' onClick={() => setShowEdit(true)}>Chỉnh sửa</button>
                        </section>
                        <div className='w-full lg:w-1/2 flex flex-col gap-4 lg:gap-7'>
                            <section className='border p-4  rounded-lg border-(--border-color) flex flex-col items-center  gap-2 shadow-lg'>
                                <h2 className='text-lg font-semibold text-(--color-text)'>Thông tin bố </h2>
                                <div className='w-full flex flex-col gap-2'>
                                    <div>Họ và tên: </div>
                                    <div>Ngày sinh: </div>
                                    <div>Số điện thoại: </div>
                                    <div>Quê quán: </div>
                                    <div>Nghề nghiệp</div>
                                </div>
                            </section>
                            <section className='border p-4  rounded-lg border-(--border-color) flex flex-col items-center  gap-2 shadow-lg'>
                                <h2 className='text-lg font-semibold text-(--color-text)'>Thông tin mẹ</h2>
                                <div className='w-full flex flex-col gap-2 '>
                                    <div>Họ và tên: </div>
                                    <div>Ngày sinh: </div>
                                    <div>Số điện thoại: </div>
                                    <div>Quê quán: </div>
                                    <div>Nghề nghiệp</div>
                                </div>
                            </section>
                        </div>
                    </div>

            {showEdit && (<EditProfileModal showEdit={showEdit} setShowEdit={setShowEdit} />)}
        </div>
    );
};

export default ProfilePage;