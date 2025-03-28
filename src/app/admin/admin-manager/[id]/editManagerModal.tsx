import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Dispatch, SetStateAction, useMemo, useRef } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SelectComponent from "@/app/Components/select";
import { toast } from "react-toastify";
import {  put } from "@/app/Services/callApi";
import { adminAdminManager } from "@/app/Services/api";
import { set } from "date-fns";
import Image from "next/image";
import { uploadImage } from "@/app/Services/uploadImage";
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

interface EditManagerModalProps {
    showEdit: boolean;
    setShowEdit: (show: boolean) => void;
    manager: Manager;
    setManager: Dispatch<SetStateAction<Manager>>;
}
function convertPartyMember(isPartyMember: boolean): Option {
    switch (isPartyMember) {
        case true:
            return { label: 'Có', id: 'Có' };
        case false:
            return { label: 'Không', id: 'Không' };
        default:
            return { label: 'Không', id: 'Không' };
    }
}
const EditManagerModal: React.FC<EditManagerModalProps> = ({
    showEdit,
    setShowEdit,
    manager,
    setManager,
}) => {
    const [file, setFile] = React.useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUrlImage, setIsUrlImage] = React.useState<boolean>(!!manager.detail.photoUrl);
    const [selected, setSelected] = React.useState<Option>(convertPartyMember(manager.detail.isPartyMember));
    const [fullName, setFullName] = React.useState<string>(manager.detail.fullName);
    const [rank, setRank] = React.useState<string>(manager.detail.rank);
    const [birthYear, setBirthYear] = React.useState<number | null>(manager.detail.birthYear);
    const [hometown, setHometown] = React.useState<string>(manager.detail.hometown);
    const [phoneNumber, setPhoneNumber] = React.useState<string>(manager.detail.phoneNumber);
    const [managementUnit, setManagementUnit] = React.useState<string>(manager.detail.managementUnit);
    const [permanentAddress, setPermanentAddress] = React.useState<string>(manager.detail.permanentAddress);
    const [fatherFullName, setFatherFullName] = React.useState<string>(manager.detail.fatherName);
    const [fatherBirthYear, setFatherBirthYear] = React.useState<number | null>(manager.detail.fatherBirthYear);
    const [fatherHometown, setFatherHometown] = React.useState<string>(manager.detail.fatherHometown);
    const [motherFullName, setMotherFullName] = React.useState<string>(manager.detail.motherName);
    const [motherBirthYear, setMotherBirthYear] = React.useState<number | null>(manager.detail.motherBirthYear);
    const [motherHometown, setMotherHometown] = React.useState<string>(manager.detail.motherHometown);

    const handleOnSubmit = async () => {
        let urlImage: string= "";
        if (!isUrlImage && file) {
            if(file.size > 10 * 1024 * 1024){
                toast.error('Kích thước ảnh không được vượt quá 10MB');
                return;
            }
            try{
            urlImage= await uploadImage(file, 'managers', manager.id.toString(), 'avatar')
            }catch(e){
                toast.error('Lỗi upload ảnh');
                return;
            }
        }
        toast.promise(
            put(adminAdminManager + `/${manager.id}`, {
                photo_url:isUrlImage ? manager.detail.photoUrl : urlImage,
                full_name: fullName,
                rank: rank,
                birth_year: birthYear,
                hometown: hometown,
                phone_number: phoneNumber,
                management_unit: managementUnit,
                is_party_member: selected.id === 'Có',
                permanent_address: permanentAddress,
                father_name: fatherFullName,
                father_birth_year: fatherBirthYear,
                father_hometown: fatherHometown,
                mother_name: motherFullName,
                mother_birth_year: motherBirthYear,
                mother_hometown: motherHometown,
            }),
            {
                pending: "Đang cập nhật thông tin",
                success: "Cập nhật thông tin thành công",
                error: {
                    render({ data }) {
                        if (data && typeof data === "object" && "errors" in data) {
                            const errorData = data.errors as Record<string, string[]>;
                            const firstErrorKey = Object.keys(errorData)[0];
                            return errorData[firstErrorKey]?.[0] || "Lỗi không xác định";
                        }
                        return "Đã xảy ra lỗi không xác định";
                    }

                }
            }
        ).then((res) => {
            setManager((prev) => {
                return {
                    ...prev,
                    detail: {
                        ...prev.detail,
                        photoUrl: isUrlImage ? manager.detail.photoUrl : urlImage,
                        fullName,
                        rank,
                        birthYear,
                        hometown,
                        phoneNumber,
                        managementUnit,
                        isPartyMember: selected.id === 'Có',
                        permanentAddress,
                        fatherName: fatherFullName,
                        fatherBirthYear,
                        fatherHometown,
                        motherName: motherFullName,
                        motherBirthYear,
                        motherHometown,
                    }
                }
            })
            setShowEdit(false);
        }).catch((res: any) => {
            toast.error(res.data.message);
        })

    }
    const imageSrc = useMemo(() => {
        if (file) return URL.createObjectURL(file);
        if (isUrlImage) return manager.detail.photoUrl;
        return "/avatarDefault.svg";
    }, [file, manager?.detail?.photoUrl, isUrlImage]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsUrlImage(false);
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
        }
        e.target.value = "";
    };
    const handleRemoveFile = () => {
        setFile(null);
        setIsUrlImage(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[80%] h-[90%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa thông tin</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowEdit(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className='flex-1 w-full flex flex-col gap-4 overflow-y-auto '>
                    <h2 className='text-xl font-semibold text-(--color-text)'>Thông tin cá nhân</h2>
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <label htmlFor="file" className="text-lg md:w-1/3">Ảnh đại diện:</label>


                        <Image
                            src={imageSrc}
                            alt="Ảnh đại diện"
                            className="w-32 h-32 object-cover rounded-full border border-gray-300"
                            width={64}
                            height={64}
                        />


                        <input
                            type="file"
                            id="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"

                        />


                        <div className="flex flex-col gap-2 relative top-1/2 transform -translate-y-1/2">
                            <div className="flex gap-2">
                                <label
                                    htmlFor="file"
                                    className="btn-text text-white py-2 px-4 rounded cursor-pointer"
                                >
                                    Chọn ảnh
                                </label>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Xóa ảnh
                                </button>
                            </div>
                            <p className='text-gray-500 text-sm'>Lưu ý *: Ảnh phải có kích thước dưới 10MB.</p>

                        </div>
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="fullName" className="text-lg md:w-1/3">Họ và tên:</label>
                        <input
                            value={fullName || ''}
                            onChange={(e) => setFullName(e.target.value)}
                            id="fullName" placeholder="Họ và tên" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="rank" className="text-lg md:w-1/3">Cấp bậc:</label>
                        <input
                            value={rank || ''}
                            onChange={(e) => setRank(e.target.value)}
                            id="rank" placeholder="Cấp bậc" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="dob" className="text-lg md:w-1/3">Năm sinh:</label>
                        <input value={birthYear ?? ''} onChange={(e) => {
                            if (e.target.value === '') {
                                setBirthYear(null);
                            } else {
                                setBirthYear(parseInt(e.target.value));
                            }
                        }
                        }
                            id="dob" placeholder="Năm sinh" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="phoneNumber" className="text-lg md:w-1/3">Số điện thoại:</label>
                        <input id="phoneNumber" placeholder="Số điện thoại" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' pattern="\d*" maxLength={10} onInput={(e) => {
                            e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                        }}
                            value={phoneNumber || ''}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="hometown" className="text-lg md:w-1/3">Quê quán:</label>
                        <input
                            value={hometown || ''}
                            onChange={(e) => setHometown(e.target.value)}

                            id="hometown" placeholder="Quê quán" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="unit" className="text-lg md:w-1/3">Đơn vị quản lý:</label>
                        <input
                            value={managementUnit || ''}
                            onChange={(e) => setManagementUnit(e.target.value)}
                            id="unit" placeholder="Đơn vị quản lý" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="party" className="text-lg md:w-1/3">Đảng viên:</label>
                        <SelectComponent
                            mdWidth="md:w-2/3"
                            width="w-full"
                            options={[
                                { label: 'Có', id: 'Có' },
                                { label: 'Không', id: 'Không' },
                            ]}
                            defaultOption={{ label: 'Không', id: 'Không' }}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>

                    <div className='flex flex-col md:flex-row gap-2 mr-2'>
                        <label htmlFor="permanentAddress" className="text-lg md:w-1/3">Địa chỉ thường trú:</label>
                        <input
                            value={permanentAddress || ''}
                            onChange={(e) => setPermanentAddress(e.target.value)}
                            id="permanentAddress" placeholder="Địa chỉ thường trú" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-xl font-semibold text-(--color-text)'>Thông tin bố</h2>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherFullName" className="text-lg md:w-1/3">Họ và tên:</label>
                            <input
                                value={fatherFullName || ''}
                                onChange={(e) => setFatherFullName(e.target.value)}
                                id="fatherFullName" placeholder="Họ và tên" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="dob" className="text-lg md:w-1/3">Năm sinh:</label>
                            <input value={fatherBirthYear ?? ''} onChange={(e) => {
                                if (e.target.value === '') {
                                    setFatherBirthYear(null);
                                } else {
                                    setFatherBirthYear(parseInt(e.target.value));
                                }
                            }
                            }
                                id="dob" placeholder="Năm sinh" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>

                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="fatherHometown" className="text-lg md:w-1/3">Quê quán:</label>
                            <input
                                value={fatherHometown || ''}
                                onChange={(e) => setFatherHometown(e.target.value)}
                                id="fatherHometown" placeholder="Quê quán" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>

                    </div>
                    <div className='flex flex-col gap-4'>
                        <h2 className='text-xl font-semibold text-(--color-text)'>Thông tin mẹ</h2>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherFullName" className="text-lg md:w-1/3">Họ và tên:</label>
                            <input
                                value={motherFullName || ''}
                                onChange={(e) => setMotherFullName(e.target.value)}
                                id="motherFullName" placeholder="Họ và tên" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>
                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="dob" className="text-lg md:w-1/3">Năm sinh:</label>
                            <input value={motherBirthYear ?? ''} onChange={(e) => {
                                if (e.target.value === '') {
                                    setMotherBirthYear(null);
                                } else {
                                    setMotherBirthYear(parseInt(e.target.value));
                                }
                            }
                            }
                                id="dob" placeholder="Năm sinh" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>

                        <div className='flex flex-col md:flex-row gap-2 mr-2'>
                            <label htmlFor="motherHometown" className="text-lg md:w-1/3">Quê quán:</label>
                            <input
                                value={motherHometown || ''}
                                onChange={(e) => setMotherHometown(e.target.value)}
                                id="motherHometown" placeholder="Quê quán" type='text' className='h-10 border rounded-lg border-(--border-color) px-2 outline-none md:w-2/3 hover:border-(--border-color-hover) focus:border-(--border-color-focus)' />
                        </div>

                    </div>
                </div>
                <div className='flex justify-center gap-4 w-full mt-4'>
                    <button className='btn-text text-white w-20 h-10 rounded-lg'
                        onClick={handleOnSubmit}
                    >Lưu</button>
                    <button className='bg-red-700 text-white w-20 h-10 rounded-lg hover:bg-red-800 active:bg-red-900' onClick={() => setShowEdit(false)}>Hủy</button>
                </div>
            </Box>
        </Modal>
    );
};

export default EditManagerModal;