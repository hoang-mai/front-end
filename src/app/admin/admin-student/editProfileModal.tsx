import React, { useRef, useMemo, Dispatch, SetStateAction } from "react";
import DatePickerComponent from "@/app/Components/datePicker";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SelectComponent from "@/app/Components/select";
import Image from "next/image";
import { toast } from "react-toastify";

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
import WorkIcon from '@mui/icons-material/Work';
import { uploadImage } from "@/app/Services/uploadImage";
import { post, put } from "@/app/Services/callApi";
import { adminStudentProfile, adminStudentUpdateImage } from "@/app/Services/api";
import { format } from "date-fns/format";



interface Student {
    id: number;
    name: string;
    email: string;
    image: string | null;
}

export interface ParentInfo {
    name: string | null;
    birthYear: number | null;
    phoneNumber: string | null;
    placeOfOrigin: string | null;
    occupation: string | null;
}

export interface StudentDetail {
    id: number;
    userId: number;
    dateOfBirth: Date | null;
    rank: string | null;
    placeOfOrigin: string | null;
    workingUnit: string | null;
    yearOfStudy: number | null;
    politicalStatus: string | null;
    phoneNumber: string | null;
    permanentResidence: string | null;
    father: ParentInfo;
    mother: ParentInfo;
    createdAt: Date;
    updatedAt: Date;
    class_role: string | null; // Assuming class_role is a string, adjust if it's different
}

interface EditProfileModalProps {
    showEdit: boolean;
    setShowEdit: (show: boolean) => void;
    userProfile: StudentDetail;
    setUserProfile: Dispatch<SetStateAction<StudentDetail>>;
    selectedStudent: Student;
    setSelectedStudent: Dispatch<SetStateAction<Student | undefined>>
}
function convertStringToPoliticalStatus(value: string): string | null {
    switch (value) {
        case 'Đảng viên':
            return 'party_member';
        case 'Đoàn viên':
            return 'youth_union_member';
        case 'Không':
            return 'none';
        default:
            return null;
    }
}
const EditProfileModal: React.FC<EditProfileModalProps> = ({
    showEdit,
    setShowEdit,
    userProfile,
    setUserProfile,
    selectedStudent,
    setSelectedStudent,
}) => {
    const [file, setFile] = React.useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUrlImage, setIsUrlImage] = React.useState<boolean>(!!selectedStudent?.image);
    const [selected, setSelected] = React.useState<Option>({ label: userProfile.politicalStatus || 'Không', id: userProfile.politicalStatus || 'Không' });

    // User profile state variables (keeping birthDate as Date object)
    const [birthDate, setBirthDate] = React.useState<Date | null>(userProfile?.dateOfBirth);
    const [rank, setRank] = React.useState<string | null>(userProfile?.rank);
    const [hometown, setHometown] = React.useState<string | null>(userProfile?.placeOfOrigin);
    const [workingUnit, setWorkingUnit] = React.useState<string | null>(userProfile?.workingUnit);
    const [yearOfStudy, setYearOfStudy] = React.useState<string | null>(userProfile?.yearOfStudy?.toString() || null);
    const [phoneNumber, setPhoneNumber] = React.useState<string | null>(userProfile?.phoneNumber);
    const [permanentAddress, setPermanentAddress] = React.useState<string | null>(userProfile?.permanentResidence);;

    // Father info
    const [fatherFullName, setFatherFullName] = React.useState<string | null>(userProfile?.father.name);
    const [fatherBirthYear, setFatherBirthYear] = React.useState<number | null>(userProfile?.father.birthYear);
    const [fatherPhoneNumber, setFatherPhoneNumber] = React.useState<string | null>(userProfile?.father.phoneNumber);
    const [fatherHometown, setFatherHometown] = React.useState<string | null>(userProfile?.father.placeOfOrigin);
    const [fatherOccupation, setFatherOccupation] = React.useState<string | null>(userProfile?.father.occupation);

    // Mother info
    const [motherFullName, setMotherFullName] = React.useState<string | null>(userProfile?.mother.name);
    const [motherBirthYear, setMotherBirthYear] = React.useState<number | null>(userProfile?.mother.birthYear);
    const [motherPhoneNumber, setMotherPhoneNumber] = React.useState<string | null>(userProfile?.mother.phoneNumber);
    const [motherHometown, setMotherHometown] = React.useState<string | null>(userProfile?.mother.placeOfOrigin);
    const [motherOccupation, setMotherOccupation] = React.useState<string | null>(userProfile?.mother.occupation);


    const handleOnSubmit = async () => {
        let urlImage: string = isUrlImage && selectedStudent.image ? selectedStudent.image : 'default';
        if (!isUrlImage && file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Kích thước ảnh không được vượt quá 10MB');
                return;
            }
            try {
                urlImage = await uploadImage(file, 'students', selectedStudent.id.toString(), 'avatar')
                
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Lỗi không xác định khi upload ảnh';
                toast.error(`Lỗi upload ảnh: ${errorMessage}`);
                return;
            }
        }
        await post(adminStudentUpdateImage + `/${selectedStudent?.id}/image`, { image: urlImage });
        toast.promise(
            put(adminStudentProfile + `/${selectedStudent?.id}/detail`,
                {
                    date_of_birth: birthDate ? format(birthDate, 'yyyy-MM-dd') : null,
                    rank: rank,
                    place_of_origin: hometown,
                    working_unit: workingUnit,
                    year_of_study: yearOfStudy,
                    political_status: convertStringToPoliticalStatus(selected.label),
                    phone_number: phoneNumber,
                    permanent_residence: permanentAddress,
                    father_name: fatherFullName,
                    father_birth_year: fatherBirthYear,
                    father_phone_number: fatherPhoneNumber,
                    father_place_of_origin: fatherHometown,
                    father_occupation: fatherOccupation,
                    mother_name: motherFullName,
                    mother_birth_year: motherBirthYear,
                    mother_phone_number: motherPhoneNumber,
                    mother_place_of_origin: motherHometown,
                    mother_occupation: motherOccupation
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
        ).then(() => {
            setSelectedStudent((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    image: isUrlImage ? prev.image : urlImage,
                }
            })
            setUserProfile((prev) => {
                return {
                    ...prev,
                    dateOfBirth: birthDate || prev?.dateOfBirth,
                    rank: rank,
                    placeOfOrigin: hometown,
                    workingUnit: workingUnit,
                    yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : null,
                    politicalStatus: selected.label,
                    phoneNumber: phoneNumber,
                    permanentResidence: permanentAddress,
                    father: {
                        name: fatherFullName,
                        birthYear: fatherBirthYear,
                        phoneNumber: fatherPhoneNumber,
                        placeOfOrigin: fatherHometown,
                        occupation: fatherOccupation,
                    },
                    mother: {
                        name: motherFullName,
                        birthYear: motherBirthYear,
                        phoneNumber: motherPhoneNumber,
                        placeOfOrigin: motherHometown,
                        occupation: motherOccupation,
                    }
                };
            }
            )
            setShowEdit(false);
        })
    }

    const imageSrc = useMemo(() => {
        if (file) return URL.createObjectURL(file);
        if (isUrlImage && selectedStudent?.image && selectedStudent.image !== 'default') return selectedStudent.image;
        return "/avatarDefault.svg";
    }, [file,isUrlImage, selectedStudent?.image]);

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

    const handleDateChange = (date: Date | null) => {
        setBirthDate(date);
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
                            <label htmlFor="dob" className="text-gray-700 font-medium flex items-center">
                                <CakeIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Ngày sinh
                            </label>
                            <DatePickerComponent
                                smWidth={"100%"}
                                xsWidth={"100%"}
                                value={birthDate}
                                onChange={handleDateChange}
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="rank" className="text-gray-700 font-medium flex items-center">
                                <MilitaryTechIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Cấp bậc
                            </label>
                            <input
                                value={rank ?? ''}
                                onChange={(e) => setRank(e.target.value)}
                                id="rank"
                                placeholder="Cấp bậc"
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
                                value={phoneNumber ?? ''
                                }
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="hometown" className="text-gray-700 font-medium flex items-center">
                                <LocationOnIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Quê quán
                            </label>
                            <input
                                value={hometown ?? ''}
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
                                Đơn vị công tác
                            </label>
                            <input
                                value={workingUnit ?? ''}
                                onChange={(e) => setWorkingUnit(e.target.value)}
                                id="unit"
                                placeholder="Đơn vị công tác"
                                type='text'
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors'
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="year" className="text-gray-700 font-medium flex items-center">
                                <WorkIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Năm công tác
                            </label>
                            <input
                                value={yearOfStudy ?? ''}
                                onChange={(e) => setYearOfStudy(e.target.value)}
                                id="year"
                                placeholder="Năm công tác"
                                type='text'
                                className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors'
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="party" className="text-gray-700 font-medium flex items-center">
                                <CardMembershipIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Đảng viên / Đoàn viên
                            </label>
                            <SelectComponent
                                width="w-full"
                                options={[
                                    { label: 'Đảng viên', id: 'Đảng viên' },
                                    { label: 'Đoàn viên', id: 'Đoàn viên' },
                                    { label: 'Không', id: 'Không' },
                                ]}
                                defaultOption={{ label: 'Đảng viên', id: 'Đảng viên' }}
                                selected={selected}
                                setSelected={setSelected}
                            />
                        </div>

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="permanentAddress" className="text-gray-700 font-medium flex items-center">
                                <HomeIcon sx={{ color: 'var(--color-text)', mr: 1, fontSize: 20 }} />
                                Hộ khẩu thường trú
                            </label>
                            <input
                                value={permanentAddress ?? ''}
                                onChange={(e) => setPermanentAddress(e.target.value)}
                                id="permanentAddress"
                                placeholder="Hộ khẩu thường trú"
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
                                    value={fatherFullName ?? ''}
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
                                <label htmlFor="fatherPhoneNumber" className="text-gray-700 font-medium">Số điện thoại</label>
                                <input
                                    id="fatherPhoneNumber"
                                    placeholder="Số điện thoại"
                                    type='text'
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors'
                                    pattern="\d*"
                                    maxLength={10}
                                    value={fatherPhoneNumber ?? ''}
                                    onChange={(e) => setFatherPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="fatherHometown" className="text-gray-700 font-medium">Quê quán</label>
                                <input
                                    value={fatherHometown ?? ''}
                                    onChange={(e) => setFatherHometown(e.target.value)}
                                    id="fatherHometown"
                                    placeholder="Quê quán"
                                    type='text'
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors'
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="fatherOccupation" className="text-gray-700 font-medium">Nghề nghiệp</label>
                                <input
                                    value={fatherOccupation ?? ''}
                                    onChange={(e) => setFatherOccupation(e.target.value)}
                                    id="fatherOccupation"
                                    placeholder="Nghề nghiệp"
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
                                    value={motherFullName ?? ''}
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
                                <label htmlFor="motherPhoneNumber" className="text-gray-700 font-medium">Số điện thoại</label>
                                <input
                                    id="motherPhoneNumber"
                                    placeholder="Số điện thoại"
                                    type='text'
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors'
                                    pattern="\d*"
                                    maxLength={10}
                                    value={motherPhoneNumber ?? ''}
                                    onChange={(e) => setMotherPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="motherHometown" className="text-gray-700 font-medium">Quê quán</label>
                                <input
                                    value={motherHometown ?? ''}
                                    onChange={(e) => setMotherHometown(e.target.value)}
                                    id="motherHometown"
                                    placeholder="Quê quán"
                                    type='text'
                                    className='h-10 border rounded-lg border-(--border-color) px-3 outline-none hover:border-(--border-color-hover) focus:border-(--border-color-focus) transition-colors'
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                <label htmlFor="motherOccupation" className="text-gray-700 font-medium">Nghề nghiệp</label>
                                <input
                                    value={motherOccupation ?? ''}
                                    onChange={(e) => setMotherOccupation(e.target.value)}
                                    id="motherOccupation"
                                    placeholder="Nghề nghiệp"
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

export default EditProfileModal;