'use client';
import { adminAdminManager } from "@/app/Services/api";
import { get } from "@/app/Services/callApi";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import LoaderTable from "@/app/Components/Loader/loaderTable";
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
    birthYear: Date;
    hometown: string;
    phoneNumber: string;
    isPartyMember: boolean;
    photoUrl: string;
    managementUnit: string;
    fatherName: string;
    motherName: string;
    parentHometown: string;
    permanentAddress: string;
    createdAt: Date;
    updatedAt: Date;
}
function ManagerDetail() {
    const params = useParams<{ id: string }>();
    const [loading, setLoading] = useState<boolean>(true);
    const [manager, setManager] = useState<Manager>();
    useEffect(() => {
        get(adminAdminManager + '/' + params.id)
            .then((res) => {
                setManager(res.data.data);
            })
            .catch((res) => {
                toast.error(res.data.message);
            }).finally(() => {
                setLoading(false);
            })
    }, [loading]);


    return (
<div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-6">
    {!manager ? (
        <LoaderTable />
    ) : (
        <>
            {/* Ảnh đại diện + Thông tin cơ bản */}
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
                <Image
                    src={manager.detail?.photoUrl || "/default-avatar.png"}
                    alt="Ảnh đại diện"
                    width={100}
                    height={100}
                    className="rounded-full border border-gray-300"
                />
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{manager.detail?.fullName || "Chưa cập nhật"}</h2>
                    <p className="text-gray-500">{manager.email || "Không có email"}</p>
                </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><strong>Cấp bậc:</strong> {manager.detail?.rank || "Chưa cập nhật"}</p>
                <p><strong>Năm sinh:</strong> {manager.detail?.birthYear ? new Date(manager.detail.birthYear).getFullYear() : "Không rõ"}</p>
                <p><strong>Quê quán:</strong> {manager.detail?.hometown || "Chưa cập nhật"}</p>
                <p><strong>Đơn vị quản lý:</strong> {manager.detail?.managementUnit || "Không có thông tin"}</p>
                <p><strong>Số điện thoại:</strong> {manager.detail?.phoneNumber || "Chưa có"}</p>
                <p><strong>Đảng viên:</strong> {manager.detail?.isPartyMember ? "Có" : "Không"}</p>
            </div>

            {/* Thông tin gia đình */}
            <div className="border-t pt-4">
                <p className="text-lg font-semibold">Thông tin gia đình</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <p><strong>Cha:</strong> {manager.detail?.fatherName || "Chưa cập nhật"}</p>
                    <p><strong>Mẹ:</strong> {manager.detail?.motherName || "Chưa cập nhật"}</p>
                    <p><strong>Quê quán bố mẹ:</strong> {manager.detail?.parentHometown || "Không rõ"}</p>
                </div>
            </div>

            {/* Địa chỉ và thời gian cập nhật */}
            <div className="border-t pt-4">
                <p><strong>Địa chỉ thường trú:</strong> {manager.detail?.permanentAddress || "Không có thông tin"}</p>
                <p>
                    <strong>Ngày tạo:</strong> 
                    {manager.detail?.createdAt ? new Date(manager.detail.createdAt).toLocaleDateString("vi-VN") : "Không có dữ liệu"}
                </p>
                <p>
                    <strong>Cập nhật lần cuối:</strong> 
                    {manager.detail?.updatedAt ? new Date(manager.detail.updatedAt).toLocaleDateString("vi-VN") : "Không có dữ liệu"}
                </p>
            </div>
        </>
    )}
</div>


    );
}

export default ManagerDetail;