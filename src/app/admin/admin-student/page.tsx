'use client'
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import useDebounce from "@/app/hooks/useDebounce";
import { adminStudentProfile, searchStudent } from "@/app/Services/api";
import { get, post } from "@/app/Services/callApi";
import { faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import PersonIcon from '@mui/icons-material/Person';
import LoaderTable from "@/app/Components/Loader/loaderTable";
import LoaderAvatar from "@/app/Components/Loader/loaderAvatar";
import Image from "next/image";
import LoaderLine from "@/app/Components/Loader/loaderLine";
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
import EditProfileModal from "./editProfileModal";

import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
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
}

export function convertStudentDetail(data: any): StudentDetail {
    return {
        id: data.id,
        userId: data.user_id,
        dateOfBirth: new Date(data.date_of_birth),
        rank: data.rank,
        placeOfOrigin: data.place_of_origin,
        workingUnit: data.working_unit,
        yearOfStudy: data.year_of_study,
        politicalStatus: data.political_status,
        phoneNumber: data.phone_number,
        permanentResidence: data.permanent_residence,
        father: {
            name: data.father.name,
            birthYear: data.father.birth_year,
            phoneNumber: data.father.phone_number,
            placeOfOrigin: data.father.place_of_origin,
            occupation: data.father.occupation,
        },
        mother: {
            name: data.mother.name,
            birthYear: data.mother.birth_year,
            phoneNumber: data.mother.phone_number,
            placeOfOrigin: data.mother.place_of_origin,
            occupation: data.mother.occupation,
        },
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}


export const defaultParentInfo: ParentInfo = {
    name: null,
    birthYear: null,
    phoneNumber: null,
    placeOfOrigin: null,
    occupation: null,
};

export const defaultStudentDetail: StudentDetail = {
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
    father: { ...defaultParentInfo },
    mother: { ...defaultParentInfo },
    createdAt: new Date(),
    updatedAt: new Date(),
};

function StudentSelector({
    selectedStudent,
    setSelectedStudent,
    searchRef
}: Readonly<{
    selectedStudent?: Student;
    setSelectedStudent: (student?: Student) => void;
    searchRef: React.RefObject<HTMLDivElement | null>;
}>) {
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [students, setStudents] = useState<Student[]>();
    const debouncedQuery = useDebounce(search, 500, setLoading);

    const handleClearSelection = () => {
        setSelectedStudent(undefined);
        setSearch('');
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (e.target.value === '') {
            setStudents(undefined);
        }
    };

    useEffect(() => {
        if (selectedStudent) {
            setLoading(false);
            return;
        }

        if (debouncedQuery && loading) {
            post(searchStudent, { query: debouncedQuery })
                .then((res) => {
                    setStudents(res.data.data.map((student: any) => ({
                        id: student.id,
                        name: student.name,
                        email: student.email,
                        image: student.image,
                    })));
                })
                .catch((res) => {
                    toast.error(res.data.message);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [debouncedQuery, selectedStudent, loading]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setLoading(false);
                setStudents(undefined);
                if (!selectedStudent) {
                    setSearch('');
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchRef, selectedStudent]);

    return (
        <div className="w-full md:w-96 flex flex-col rounded-lg h-fit relative">
            <div className="flex flex-row items-center">
                <label htmlFor="studentSearch" className="mr-2 whitespace-nowrap">Học viên:</label>
                <div className="relative flex-1">
                    <input
                        id="studentSearch"
                        placeholder="Nhập tên học viên"
                        type="text"
                        className="appearance-none border rounded-lg py-2 px-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
                        value={selectedStudent ? selectedStudent.name : search}
                        onChange={handleSearchChange}
                        disabled={!!selectedStudent}
                    />
                    {selectedStudent && (
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={handleClearSelection}
                            title="Xóa lựa chọn"
                        >
                            <FontAwesomeIcon icon={faTimesCircle} />
                        </button>
                    )}
                </div>
            </div>

            <div className="absolute z-10 w-full top-12">
                {loading && (
                    <div className="bg-white border border-(--border-color) rounded-lg shadow-md p-4 flex justify-center">
                        <LoaderSpinner />
                    </div>
                )}

                {students && students.length > 0 && (
                    <ul className="max-h-72 overflow-y-auto bg-white border border-(--border-color) rounded-lg shadow-md">
                        {students.map(student => (
                            <li key={student.id} className="w-full">
                                <button
                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    onClick={() => {
                                        setSelectedStudent(student);
                                        setStudents(undefined);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {student.image ? (
                                                <img
                                                    src={student.image}
                                                    alt={student.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <PersonIcon className="text-gray-500" />
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h3 className="font-medium">{student.name}</h3>
                                            <p className="text-gray-500 text-sm">{student.email}</p>
                                        </div>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                {students && students.length === 0 && (
                    <div className="bg-white border border-(--border-color) rounded-lg shadow-md p-4 text-center text-gray-500">
                        Không tìm thấy học viên
                    </div>
                )}
            </div>
        </div>
    );
}

function AdminStudent() {
    const [userProfile, setUserProfile] = useState<StudentDetail>(defaultStudentDetail);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStudent, setSelectedStudent] = useState<Student>();
    const [error, setError] = useState<string>('');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const searchStudentRef = useRef<HTMLDivElement | null>(null);



    useEffect(() => {
        if (!selectedStudent) {
            setUserProfile(defaultStudentDetail);
            return;
        }

        setLoading(true);
        get(`${adminStudentProfile}/${selectedStudent.id}/detail`)
            .then((res) => {

                setUserProfile(convertStudentDetail(res.data.data));
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [selectedStudent]);

    if (error) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 shadow-sm">
                <p className="font-medium">Đã xảy ra lỗi:</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="xl:w-[90%] md:w-full bg-white rounded-lg shadow-md p-6 flex flex-col gap-6">

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto" ref={searchStudentRef}>
                    <StudentSelector
                        selectedStudent={selectedStudent}
                        setSelectedStudent={setSelectedStudent}
                        searchRef={searchStudentRef}
                    />
                </div>
            </div>

            {!selectedStudent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center text-blue-700">
                    <p className="text-lg font-medium mb-2">Vui lòng chọn học viên</p>
                    <p>Chọn một học viên để xem thông tin</p>
                </div>
            ) : (
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
                                                src={selectedStudent?.image || "/avatarDefault.svg"}
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
                                            {selectedStudent?.name || "Chưa cập nhật tên"}
                                        </h2>
                                        <p className="text-gray-600 mb-2">
                                            {selectedStudent?.email || "Không có email"}
                                        </p>
                                        <div className="font-bold inline-flex items-center px-3 py-1 bg-green-100 rounded-full text-md text-(--color-text)">
                                            <MilitaryTechIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                            {userProfile?.rank || "Chưa cập nhật cấp bậc"}
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
                                                <span>{userProfile?.phoneNumber || "Chưa cập nhật"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                                    <BusinessIcon sx={{ fontSize: 18 }} />
                                                </div>
                                                <span>{userProfile?.workingUnit || "Chưa cập nhật"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                                    <HomeIcon sx={{ fontSize: 18 }} />
                                                </div>
                                                <span>{userProfile?.permanentResidence || "Chưa cập nhật"}</span>
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
                                                <span >Năm học: {userProfile?.yearOfStudy || "Chưa cập nhật"}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-gray-700">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text)">
                                                    <FlagIcon sx={{ fontSize: 18 }} />
                                                </div>
                                                <span>Đảng viên: {userProfile?.politicalStatus ? (userProfile.politicalStatus === 'party_member' ? 'Có' : 'Không') : "Chưa cập nhật"}</span>
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
                                                    <p className="font-medium">{userProfile.dateOfBirth?.toLocaleDateString('vi-VN') || "Chưa cập nhật"}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                    <LocationOnIcon />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Quê quán</p>
                                                    <p className="font-medium">{userProfile?.placeOfOrigin || "Chưa cập nhật"}</p>
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
                                                            <p className="font-medium">{userProfile?.father?.name || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <CakeIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Năm sinh</p>
                                                            <p className="font-medium">{userProfile?.father?.birthYear || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <PhoneIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                                            <p className="font-medium">{userProfile?.father?.phoneNumber || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <LocationOnIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Quê quán</p>
                                                            <p className="font-medium">{userProfile?.father?.placeOfOrigin || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <WorkIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Nghề nghiệp</p>
                                                            <p className="font-medium">{userProfile?.father?.occupation || "Chưa cập nhật"}</p>
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
                                                            <p className="font-medium">{userProfile?.mother?.name || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <CakeIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Năm sinh</p>
                                                            <p className="font-medium">{userProfile?.mother?.birthYear || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <PhoneIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Số điện thoại</p>
                                                            <p className="font-medium">{userProfile?.mother?.phoneNumber || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <LocationOnIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Quê quán</p>
                                                            <p className="font-medium">{userProfile?.mother?.placeOfOrigin || "Chưa cập nhật"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 bg-opacity-10 flex items-center justify-center text-(--color-text) flex-shrink-0">
                                                            <WorkIcon fontSize="small" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500">Nghề nghiệp</p>
                                                            <p className="font-medium">{userProfile?.mother?.occupation || "Chưa cập nhật"}</p>
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

                    {selectedStudent && showEdit &&
                        <EditProfileModal
                            userProfile={userProfile}
                            setUserProfile={setUserProfile}
                            showEdit={showEdit}
                            setShowEdit={setShowEdit}
                            selectedStudent={selectedStudent}
                            setSelectedStudent={setSelectedStudent}
                        />
                    }
                </div>
            )

            }

        </div>
    );
}

export default AdminStudent;