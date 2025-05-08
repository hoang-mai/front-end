
import React, { Dispatch, SetStateAction, useMemo, useRef } from "react";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SelectComponent from "@/app/Components/select";
import { toast } from "react-toastify";
import { put } from "@/app/Services/callApi";
import { adminAdminManager, managerProfile } from "@/app/Services/api";
import Image from "next/image";
import { uploadImage } from "@/app/Services/uploadImage";

// MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import CakeIcon from '@mui/icons-material/Cake';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useImage } from "@/app/hooks/useImage";

interface Manager {
    id: number;
    name: string;
    email: string;
    detail: Detail;
    image: string | null;
}
interface Detail {
    userId: number;
    fullName: string;
    rank: string;
    birthYear: number | null;
    hometown: string;
    phoneNumber: string;
    isPartyMember: boolean;
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
    const [isUrlImage, setIsUrlImage] = React.useState<boolean>(!!manager.image);
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
        let urlImage: string= (isUrlImage && manager.image) ? manager.image : 'default';
        if (!isUrlImage && file) {
            if(file.size > 10 * 1024 * 1024){
                toast.error('Kích thước ảnh không được vượt quá 10MB');
                return;
            }
            try{
            urlImage= await uploadImage(file, 'managers', manager.id.toString(), 'avatar')
            }catch(e){
                const errorMessage = e instanceof Error ? e.message : 'Lỗi không xác định khi upload ảnh';
                toast.error(`Lỗi upload ảnh: ${errorMessage}`);
                return;
            }
        }
        toast.promise(
            put(managerProfile, {
                image: isUrlImage ? manager.image : urlImage,
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
            useImage.getState().setImage(isUrlImage ? manager.image : urlImage);

            setManager((prev) => {
                return {
                    ...prev,
                    image: isUrlImage ? prev.image : urlImage,
                    detail: {
                        ...prev.detail,
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
        if (isUrlImage && manager.image) return manager.image;
        return "/avatarDefault.svg";
    }, [file, manager?.image, isUrlImage]);


    
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
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[60%] lg:w-[70%] md:w-[80%] h-[90%] w-[99%] flex flex-col bg-white p-6 md:p-7 rounded-lg shadow-lg overflow-y-auto'>
                <div className='relative w-full'>
                    <div className="flex items-center justify-center mb-4">
                        <PersonIcon sx={{ color: 'var(--color-text)', fontSize: 28, mr: 1 }} />
                        <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Chỉnh sửa thông tin</h2>
                    </div>
                    <button 
                        className='absolute top-0 right-0 p-1.5 rounded-full hover:bg-gray-200 transition-colors'
                        onClick={() => setShowEdit(false)}
                    >
                        <CloseIcon sx={{ color: 'var(--color-text)' }} />
                    </button>
                    <hr className='my-3' />
                </div>
                
                <div className='flex-1 w-full flex flex-col gap-4 overflow-y-auto px-2'>
                    <h2 className='text-xl font-semibold text-(--color-text) flex items-center'>
                        <PersonIcon sx={{ color: 'var(--color-text)', mr: 1 }} />
                        Thông tin cá nhân
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-50 p-4 rounded-lg">
                        <div className="relative">
                            <Image
                                src={imageSrc}
                                alt="Ảnh đại diện"
                                className="w-32 h-32 object-cover rounded-full border-2 border-(--color-text)"
                                width={128}
                                height={128}
                            />
                            <input
                                type="file"
                                id="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>

                        <div className="flex flex-col gap-3 flex-1">
                            <div className="flex gap-2 flex-wrap justify-center">
                                <label
                                    htmlFor="file"
                                    className="btn-text text-white py-2 px-4 rounded-full cursor-pointer flex items-center"
                                >
                                    <PhotoCameraIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Chọn ảnh
                                </label>
                                <button
                                    type="button"
                                    onClick={handleRemoveFile}
                                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-full focus:outline-none flex items-center"
                                >
                                    <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                                    Xóa ảnh
                                </button>
                            </div>
                            <p className='text-gray-500 text-sm text-center'>Lưu ý: Ảnh phải có kích thước dưới 10MB</p>
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="fullName" className="text-gray-700 font-medium flex items-center">
                                <PersonIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Họ và tên
                            </label>
                            <input
                                value={fullName || ''}
                                onChange={(e) => setFullName(e.target.value)}
                                id="fullName" 
                                placeholder="Họ và tên" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="rank" className="text-gray-700 font-medium flex items-center">
                                <MilitaryTechIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Cấp bậc
                            </label>
                            <input
                                value={rank || ''}
                                onChange={(e) => setRank(e.target.value)}
                                id="rank" 
                                placeholder="Cấp bậc" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="dob" className="text-gray-700 font-medium flex items-center">
                                <CakeIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Năm sinh
                            </label>
                            <input 
                                value={birthYear ?? ''} 
                                onChange={(e) => {
                                    if (e.target.value === '') {
                                        setBirthYear(null);
                                    } else {
                                        setBirthYear(parseInt(e.target.value));
                                    }
                                }}
                                id="dob" 
                                placeholder="Năm sinh" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="phoneNumber" className="text-gray-700 font-medium flex items-center">
                                <PhoneIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Số điện thoại
                            </label>
                            <input 
                                id="phoneNumber" 
                                placeholder="Số điện thoại" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                pattern="\d*" 
                                maxLength={10} 
                                onInput={(e) => {
                                    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
                                }}
                                value={phoneNumber || ''}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="hometown" className="text-gray-700 font-medium flex items-center">
                                <HomeIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Quê quán
                            </label>
                            <input
                                value={hometown || ''}
                                onChange={(e) => setHometown(e.target.value)}
                                id="hometown" 
                                placeholder="Quê quán" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="unit" className="text-gray-700 font-medium flex items-center">
                                <BusinessIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Đơn vị quản lý
                            </label>
                            <input
                                value={managementUnit || ''}
                                onChange={(e) => setManagementUnit(e.target.value)}
                                id="unit" 
                                placeholder="Đơn vị quản lý" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                            />
                        </div>
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="party" className="text-gray-700 font-medium flex items-center">
                                <CardMembershipIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Đảng viên
                            </label>
                            <SelectComponent
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
                        
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="permanentAddress" className="text-gray-700 font-medium flex items-center">
                                <LocationOnIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Địa chỉ thường trú
                            </label>
                            <input
                                value={permanentAddress || ''}
                                onChange={(e) => setPermanentAddress(e.target.value)}
                                id="permanentAddress" 
                                placeholder="Địa chỉ thường trú" 
                                type='text' 
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                            />
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-4 bg-gray-50 p-4 rounded-lg mt-2'>
                        <h2 className='text-xl font-semibold text-(--color-text) flex items-center'>
                            <FamilyRestroomIcon sx={{ color: 'var(--color-text)', mr: 1 }} />
                            Thông tin bố
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="fatherFullName" className="text-gray-700 font-medium">Họ và tên</label>
                                <input
                                    value={fatherFullName || ''}
                                    onChange={(e) => setFatherFullName(e.target.value)}
                                    id="fatherFullName" 
                                    placeholder="Họ và tên" 
                                    type='text' 
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                />
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="fatherBirthYear" className="text-gray-700 font-medium">Năm sinh</label>
                                <input 
                                    value={fatherBirthYear ?? ''} 
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setFatherBirthYear(null);
                                        } else {
                                            setFatherBirthYear(parseInt(e.target.value));
                                        }
                                    }}
                                    id="fatherBirthYear" 
                                    placeholder="Năm sinh" 
                                    type='text' 
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                />
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="fatherHometown" className="text-gray-700 font-medium">Quê quán</label>
                                <input
                                    value={fatherHometown || ''}
                                    onChange={(e) => setFatherHometown(e.target.value)}
                                    id="fatherHometown" 
                                    placeholder="Quê quán" 
                                    type='text' 
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className='flex flex-col gap-4 bg-gray-50 p-4 rounded-lg'>
                        <h2 className='text-xl font-semibold text-(--color-text) flex items-center'>
                            <FamilyRestroomIcon sx={{ color: 'var(--color-text)', mr: 1 }} />
                            Thông tin mẹ
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="motherFullName" className="text-gray-700 font-medium">Họ và tên</label>
                                <input
                                    value={motherFullName || ''}
                                    onChange={(e) => setMotherFullName(e.target.value)}
                                    id="motherFullName" 
                                    placeholder="Họ và tên" 
                                    type='text' 
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                />
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="motherBirthYear" className="text-gray-700 font-medium">Năm sinh</label>
                                <input 
                                    value={motherBirthYear ?? ''} 
                                    onChange={(e) => {
                                        if (e.target.value === '') {
                                            setMotherBirthYear(null);
                                        } else {
                                            setMotherBirthYear(parseInt(e.target.value));
                                        }
                                    }}
                                    id="motherBirthYear" 
                                    placeholder="Năm sinh" 
                                    type='text' 
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                />
                            </div>
                            
                            <div className='flex flex-col gap-2'>
                                <label htmlFor="motherHometown" className="text-gray-700 font-medium">Quê quán</label>
                                <input
                                    value={motherHometown || ''}
                                    onChange={(e) => setMotherHometown(e.target.value)}
                                    id="motherHometown" 
                                    placeholder="Quê quán" 
                                    type='text' 
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors' 
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='flex justify-center gap-4 w-full mt-6'>
                    <button 
                        className='btn-text text-white py-2.5 px-6 rounded-full flex items-center'
                        onClick={handleOnSubmit}
                    >
                        <SaveIcon sx={{ mr: 1 }} />
                        Lưu
                    </button>
                    <button 
                        className='bg-red-600 hover:bg-red-700 active:bg-red-800 text-white py-2.5 px-6 rounded-full flex items-center' 
                        onClick={() => setShowEdit(false)}
                    >
                        <CancelIcon sx={{ mr: 1 }} />
                        Hủy
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default EditManagerModal;