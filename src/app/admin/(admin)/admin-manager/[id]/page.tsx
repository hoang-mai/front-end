'use client';
import { adminAdminManager } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

import LoaderAvatar from "@/app/Components/Loader/loaderAvatar";
import LoaderLine from "@/app/Components/Loader/loaderLine";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import EditManagerModal from "./editManagerModal";
interface Manager {
    id: number;
    name: string;
    email: string;
    detail: Detail;
}
interface Detail {
    userId: number;
    fullName: string;
    rank: string;
    birthYear: number | null;
    hometown: string;
    phoneNumber: string;
    isPartyMember: boolean;
    photoUrl: string;
    managementUnit: string;
    fatherName: string;
    motherName: string;
    motherBirthYear: number | null;
    fatherBirthYear: number | null;
    fatherHometown: string;
    motherHometown: string;
    permanentAddress: string;
    createdAt: Date;
    updatedAt: Date;
}
const managerDefault: Manager = {
    id: 0,
    name: '',
    email: '',
    detail: {
        userId: 0,
        fullName: '',
        rank: '',
        birthYear: null,
        hometown: '',
        phoneNumber: '',
        isPartyMember: false,
        photoUrl: '',
        managementUnit: '',
        fatherName: '',
        motherName: '',
        motherBirthYear: null,
        fatherBirthYear: null,
        fatherHometown: '',
        motherHometown: '',
        permanentAddress: '',
        createdAt: new Date(),
        updatedAt: new Date(),
    }
}
function convertDataToManager(data: any): Manager {
    return {
        id: data.id,
        name: data.name,
        email: data.email,
        detail: {
            userId: data.detail.user_id,
            fullName: data.detail.full_name,
            rank: data.detail.rank,
            birthYear: data.detail.birth_year,
            hometown: data.detail.hometown,
            phoneNumber: data.detail.phone_number,
            isPartyMember: data.detail.is_party_member,
            photoUrl: data.detail.photo_url,
            managementUnit: data.detail.management_unit,
            fatherName: data.detail.father_name,
            motherName: data.detail.mother_name,
            motherBirthYear: data.detail.mother_birth_year,
            fatherBirthYear: data.detail.father_birth_year,
            fatherHometown: data.detail.father_hometown,
            motherHometown: data.detail.mother_hometown,
            permanentAddress: data.detail.permanent_address,
            createdAt: new Date(data.detail.created_at),
            updatedAt: new Date(data.detail.updated_at),
        }
    }
}
function ManagerDetail() {
    const router = useRouter();
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [manager, setManager] = useState<Manager>(managerDefault);
    const [error, setError] = useState<string>('');
    useEffect(() => {
        get(adminAdminManager + '/' + params.id)
            .then((res) => {
                setManager(convertDataToManager(res.data.data));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            }).finally(() => {
                setLoading(false);
            });
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>
    }
    return (
        <div className="xl:w-[90%] md:w-full mx-auto flex flex-col gap-8">
            <div className="flex lg:flex-row lg:gap-4 flex-col gap-8 ">
                <div className="flex flex-col items-center gap-6 pb-4 bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                    {loading ?
                        <>
                            <LoaderAvatar />
                            <div className="text-center md:text-left gap-2 flex flex-col">
                                <LoaderLine width="w-50" height="h-6" />
                                <LoaderLine width="w-50" height="h-6" />
                            </div>
                        </>
                        :
                        <>
                            <div className="self-start">
                                <button onClick={() => router.push('/admin/admin-manager')}>
                                    <FontAwesomeIcon
                                        icon={faReply}
                                        className='text-(--background-button) transition-transform duration-200 hover:scale-110 active:scale-95'
                                    />
                                </button>
                            </div>
                            <Image
                                src={manager.detail.photoUrl || "/avatarDefault.svg"}
                                alt="Ảnh đại diện"
                                width={100}
                                height={100}
                                className="rounded-full border-2 border-gray-300 shadow-md mx-auto md:mx-0"
                            />
                            <div className="text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center ">
                                    {manager.name || "Chưa cập nhật"}
                                </h2>
                                <p className="text-gray-500 flex items-center justify-center ">
                                    {manager.email || "Không có email"}
                                </p>
                            </div>
                            <div className="flex-1 flex lg:justify-end justify-center">
                                <button className="btn-text text-white h-10 w-30 rounded-lg"
                                    onClick={() => setShowEditModal(true)}
                                >Chỉnh sửa</button>
                            </div>
                        </>}
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                    <h2 className='text-lg font-semibold text-(--color-text) mb-8' >Thông tin cá nhân</h2>
                    <div className="flex lg:flex-row flex-col gap-4  xl:gap-30">
                        <div className="flex flex-col gap-8">
                            {loading ?
                                <>
                                    <div className="flex flex-row"><strong className="mr-1">Họ và tên:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                    <div className="flex flex-row"><strong className="mr-1">Cấp bậc:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                    <div className="flex flex-row"><strong className="mr-1">Năm sinh:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                    <div className="flex flex-row"><strong className="mr-1">Số điện thoại:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                </>
                                : <>
                                    <p><strong className="mr-1">Họ và tên:</strong> {manager.detail.fullName || "Chưa cập nhật"}</p>
                                    <p><strong className="mr-1">Cấp bậc:</strong> {manager.detail.rank || "Chưa cập nhật"}</p>
                                    <p ><strong className="mr-1">Năm sinh:</strong> {manager.detail.birthYear ?? "Chưa cập nhật"}</p>
                                    <p><strong className="mr-1">Số điện thoại:</strong>{manager.detail.phoneNumber || "Chưa cập nhật"}</p>
                                </>}
                        </div>
                        <div className="flex flex-col gap-8">
                            {loading ?
                                <>
                                    <div className="flex flex-row"><strong className="mr-1">Quê quán:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                    <div className="flex flex-row"><strong className="mr-1">Đơn vị quản lý:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                    <div className="flex flex-row"><strong className="mr-1">Đảng viên:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                    <div className="flex flex-row"><strong className="mr-1">Địa chỉ thường trú:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                </>
                                : <>
                                    <p ><strong className="mr-1">Quê quán:</strong> {manager.detail.hometown || "Chưa cập nhật"}</p>
                                    <p><strong className="mr-1">Đơn vị quản lý:</strong> {manager.detail?.managementUnit || "Không có thông tin"}</p>
                                    <p><strong className="mr-1">Đảng viên:</strong> {manager.detail?.isPartyMember ? "Có" : "Không"}</p>
                                    <p><strong className="mr-1">Địa chỉ thường trú:</strong> {manager.detail?.permanentAddress || "Không có thông tin"}</p>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>


            <div className="bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition duration-300">
                <p className="text-lg font-semibold text-(--color-text) mb-3">Thông tin gia đình</p>
                <div className="flex flex-col lg:flex-row gap-4 xl:gap-84 lg:gap-30">
                    <div className="flex flex-col gap-4">
                        {loading ?

                            <>
                                <div className="flex flex-row"><strong className="mr-1">Cha:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                <div className="flex flex-row"><strong className="mr-1">Quê quán bố:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                <div className="flex flex-row"><strong className="mr-1">Năm sinh bố:</strong><LoaderLine width="w-50" height="h-6" /></div>
                            </>
                            :
                            <>

                                <p><strong className="mr-1">Cha:</strong> {manager.detail.fatherName || "Chưa cập nhật"}</p>
                                <p><strong className="mr-1">Quê quán bố:</strong> {manager.detail.fatherHometown || "Chưa cập nhật"}</p>
                                <p><strong className="mr-1">Năm sinh bố:</strong> {manager.detail.fatherBirthYear ?? "Chưa cập nhật"}</p>
                            </>
                        }
                    </div>
                    <div className="flex flex-col gap-4">
                        {loading ?
                            <>

                                <div className="flex flex-row"><strong className="mr-1">Mẹ:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                <div className="flex flex-row"><strong className="mr-1">Quê quán mẹ:</strong><LoaderLine width="w-50" height="h-6" /></div>
                                <div className="flex flex-row"><strong className="mr-1">Năm sinh mẹ:</strong><LoaderLine width="w-50" height="h-6" /></div>
                            </>
                            :
                            <>
                                <p><strong className="mr-1">Mẹ:</strong> {manager.detail.motherName || "Chưa cập nhật"}</p>
                                <p><strong className="mr-1">Quê quán mẹ:</strong> {manager.detail.motherHometown || "Chưa cập nhật"}</p>
                                <p><strong className="mr-1">Năm sinh mẹ:</strong> {manager.detail.motherBirthYear ?? "Chưa cập nhật"}</p>
                            </>
                        }
                    </div>
                </div>
            </div>

            
            {/* <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col gap-2 hover:shadow-md transition duration-300">
                <p className="text-lg font-semibold text-(--color-text) mb-3">Lịch sử cập nhật</p>
                {loading ?

                    <>
                        <div className="flex flex-row"><strong className="mr-1">Ngày tạo:</strong><LoaderLine width="w-50" height="h-6" /></div>
                        <div className="flex flex-row"><strong className="mr-1">Cập nhật lần cuối:</strong><LoaderLine width="w-50" height="h-6" /></div>
                    </>
                    :
                    <>
                        <p><strong className="mr-1">Ngày tạo:</strong>{manager.detail.createdAt ? manager.detail.createdAt.toLocaleDateString("vi-VN") : "Không có dữ liệu"}</p>
                        <p><strong className="mr-1">Cập nhật lần cuối:</strong>{manager.detail.updatedAt ? manager.detail.updatedAt.toLocaleDateString("vi-VN") : "Không có dữ liệu"}</p>
                    </>
                }
            </div> */}
            {showEditModal && <EditManagerModal setShowEdit={setShowEditModal} showEdit={showEditModal} manager={manager} setManager={setManager}/>}
        </div>

    );
}

export default ManagerDetail;