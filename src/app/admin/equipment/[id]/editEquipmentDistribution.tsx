'use client'
import useDebounce from "@/app/hooks/useDebounce";
import { adminEquipmentType, adminEquipmentDistribution } from "@/app/Services/api";
import { get, put } from "@/app/Services/callApi";
import { useEffect, useRef, useState } from "react";
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import LoaderSpinner from "@/app/Components/Loader/loaderSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSearch, faCalendarAlt, faInfoCircle, faSave, faBoxes } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

interface EquipmentType extends Record<string, any> {
    id: number,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date
}
interface EquipmentDistribution extends Record<string, unknown> {
    id: number,
    year: number,
    equipmentTypeId: number,
    quantity: number,
    createdAt: Date,
    updatedAt: Date,
    equipmentTypeName: string,
    equipmentTypeDescription: string,
    equipmentTypeCreatedAt: Date,
    equipmentTypeUpdatedAt: Date
}
interface EditEquipmentDistributionModalProps {
    readonly data: EquipmentDistribution;
    readonly showEdit: boolean;
    readonly setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas?: React.Dispatch<React.SetStateAction<EquipmentDistribution[]>>;
    readonly setData?: React.Dispatch<React.SetStateAction<any>>;
}

function EditEquipmentDistribution({
    data,
    showEdit,
    setShowEdit,
    setDatas,
    setData
}: EditEquipmentDistributionModalProps) {
    const searchRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState<string>(data.equipmentTypeName);
    const [dataFetch, setDataFetch] = useState<EquipmentType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[] | undefined>(undefined);
    const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>({
        id: data.equipmentTypeId,
        name: data.equipmentTypeName,
        description: data.equipmentTypeDescription,
        createdAt: data.equipmentTypeCreatedAt,
        updatedAt: data.equipmentTypeUpdatedAt
    } as EquipmentType);
    const debouncedQuery = useDebounce<string>(search, 100, setLoading);

    // Form values
    const [year, setYear] = useState<string>(data.year.toString());
    const [errorYear, setErrorYear] = useState<string>('');
    const [quantity, setQuantity] = useState<string>(data.quantity.toString());
    const [errorQuantity, setErrorQuantity] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSelectedEquipment(null);
        if (e.target.value === '') {
            setEquipmentTypes(undefined);
        }
    }

    const handleOnChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorQuantity("");
            setQuantity(value);
            return;
        }
        if (isNaN(Number(value)) || Number(value) < 1) {
            setErrorQuantity("Số lượng không hợp lệ");
            return;
        }
        setErrorQuantity("");
        setQuantity(value);
    }

    const handleOnChangeYear = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setErrorYear("");
            setYear(value);
            return;
        }

        if (isNaN(Number(e.target.value))) {
            setErrorYear("Năm không hợp lệ");
            return;
        }
        if (value.length > 4 || (value.length === 4 && Number(value) < 1900)) {
            setErrorYear("Năm không hợp lệ");
            return;
        }
        setErrorYear("");
        setYear(value);
    };

    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedEquipment) {
            setError("Vui lòng chọn loại quân tư trang");
            return;
        }
        toast.promise(
            put(adminEquipmentDistribution + '/' + data.id, {
                equipment_type_id: selectedEquipment?.id,
                year: Number(year),
                quantity: Number(quantity),
            }),
            {
                pending: 'Đang cập nhật đợt cấp phát',
                success: 'Cập nhật đợt cấp phát thành công',
                error: 'Cập nhật đợt cấp phát thất bại',
            }
        ).then(() => {
            setDatas?.((prev) => prev.map((item) =>
                item.id === data.id
                    ? {
                        ...item,
                        year: Number(year),
                        quantity: Number(quantity),
                        createdAt: item.createdAt,
                        updatedAt: new Date(),
                        equipmentTypeId: selectedEquipment?.id ?? item.equipmentTypeId,
                        equipmentTypeName: selectedEquipment?.name ?? item.equipmentTypeName,
                        equipmentTypeDescription: selectedEquipment?.description ?? item.equipmentTypeDescription,
                        equipmentTypeCreatedAt: selectedEquipment?.createdAt ?? item.equipmentTypeCreatedAt,
                        equipmentTypeUpdatedAt: selectedEquipment?.updatedAt ?? item.equipmentTypeUpdatedAt,
                    }
                    : item
            ));

            setData?.((prev: any) => {
                return {
                    ...prev,
                    distribution: {
                        ...prev.distribution,
                        year: Number(year),
                        quantity: Number(quantity),
                        updatedAt: new Date(),
                        equipmentTypeId: selectedEquipment?.id ?? prev.equipmentTypeId,
                        equipmentTypeName: selectedEquipment?.name ?? prev.equipmentTypeName,
                        equipmentTypeDescription: selectedEquipment?.description ?? prev.equipmentTypeDescription,
                        equipmentTypeCreatedAt: selectedEquipment?.createdAt ?? prev.equipmentTypeCreatedAt,
                        equipmentTypeUpdatedAt: selectedEquipment?.updatedAt ?? prev.equipmentTypeUpdatedAt,
                    },
                }
            });

            setShowEdit(false);
        }).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        });
    }

    useEffect(() => {
        if (selectedEquipment) {
            setLoading(false);
            return;
        }
        if (debouncedQuery && loading) {
            setEquipmentTypes(dataFetch.filter(equipment => equipment.name.toLowerCase().includes(debouncedQuery.toLowerCase())));
            setLoading(false);
        }
    }, [debouncedQuery, selectedEquipment, dataFetch])

    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setLoading(false);
                setEquipmentTypes(undefined);
                if (!selectedEquipment) {
                    setSearch('');
                }
            }
        }
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        }
    }, [searchRef, selectedEquipment])

    useEffect(() => {
        get(adminEquipmentType)
            .then((res) => {
                setDataFetch(res.data.data);
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            })
    }, [])

    return (
        <Modal
            open={showEdit}
            onClose={() => setShowEdit(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] w-[95%] max-h-[95%] bg-white rounded-2xl shadow-2xl overflow-hidden'>
                <div className='bg-[color:var(--background-button)] p-4 relative'>
                    <button
                        className='absolute right-5 top-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-all duration-200'
                        onClick={() => setShowEdit(false)}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                    <h2 className='text-center text-2xl font-bold text-white'>Chỉnh sửa đợt cấp phát quân tư trang</h2>
                </div>

                <div className="p-4 m-2 overflow-y-auto max-h-[80vh]">
                    {/* Search Equipment Section */}
                    <div className='mb-6 relative'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tìm kiếm quân tư trang <span className="text-red-500">*</span>
                        </label>
                        <div
                            className="relative"
                            ref={searchRef}
                        >
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    onFocus={() => setEquipmentTypes(dataFetch)}
                                    placeholder="Nhập tên loại quân tư trang..."
                                    type="text"
                                    className="appearance-none block w-full pl-10 py-3 border border-[color:var(--border-color)] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--border-color-focus)] focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]"
                                    value={search}
                                    onChange={handleOnChangeSearch}
                                />
                                {search && (
                                    <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => {
                                            setSearch('');
                                            setEquipmentTypes(undefined);
                                            setSelectedEquipment(null);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faXmark} className="text-gray-400 hover:text-gray-600" />
                                    </button>
                                )}
                            </div>

                            {/* Search Results */}
                            {(() => {
                                if (loading) {
                                    return (
                                        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                            <div className="p-4 flex justify-center">
                                                <LoaderSpinner />
                                            </div>
                                        </div>
                                    );
                                } else if (equipmentTypes) {
                                    return equipmentTypes.length > 0 ? (
                                        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg">
                                            <ul className='max-h-60 overflow-y-auto divide-y divide-gray-100'>
                                                {equipmentTypes.map(equipment => (
                                                    <li key={equipment.id} className='w-full'>
                                                        <button
                                                            className="w-full flex items-center p-3 hover:bg-gray-50 transition-colors"
                                                            onClick={() => {
                                                                setSelectedEquipment(equipment);
                                                                setSearch(equipment.name);
                                                                setEquipmentTypes(undefined);
                                                            }}
                                                        >
                                                            <div className="text-left">
                                                                <h3 className="font-medium text-gray-800">{equipment.name}</h3>
                                                                {equipment.description && (
                                                                    <p className="text-gray-500 text-sm">{equipment.description}</p>
                                                                )}
                                                            </div>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="absolute z-10 w-full bg-white mt-1 rounded-lg border border-gray-200 shadow-lg p-4 text-center text-gray-500 flex flex-col items-center">
                                            <FontAwesomeIcon icon={faSearch} className="text-gray-400 mb-2 text-xl" />
                                            Không tìm thấy loại quân tư trang
                                        </div>
                                    );
                                }
                                return null;
                            })()}
                        </div>
                    </div>

                    {/* Selected Equipment Info */}
                    <div className={`rounded-xl p-4 mb-6 ${selectedEquipment ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'} transition-all duration-300`}>
                        <h3 className='text-lg font-semibold text-[color:var(--color-text)] flex items-center mb-3'>
                            <FontAwesomeIcon icon={faBoxes} className={`mr-2 ${selectedEquipment ? 'text-green-600' : 'text-gray-400'}`} />
                            Thông tin loại quân tư trang {selectedEquipment && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Đã chọn</span>}
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">Tên loại quân tư trang</span>
                                <span className={`font-medium ${selectedEquipment ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                    {selectedEquipment?.name ?? 'Chưa chọn quân tư trang'}
                                </span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-sm text-gray-500">Mô tả</span>
                                <span className={`font-medium ${selectedEquipment ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                                    {selectedEquipment?.description || (selectedEquipment ? '(Không có mô tả)' : 'Chưa chọn quân tư trang')}
                                </span>
                            </div>

                            {!selectedEquipment && (
                                <div className="mt-1 text-sm text-red-600 flex items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-1" />
                                    Vui lòng tìm kiếm và chọn loại quân tư trang ở trên
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form */}
                    <form className="space-y-2">
                        {/* Year Field */}
                        <div className="form-group">
                            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                                Năm <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
                                </div>
                                <input
                                    placeholder="YYYY"
                                    type="text"
                                    id="year"
                                    value={year}
                                    onChange={handleOnChangeYear}
                                    className={`appearance-none block w-full pl-10 py-3 border ${errorYear ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorYear ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                />
                            </div>
                            <p className='h-5 text-red-500 text-sm mt-1'>{errorYear}</p>
                        </div>

                        {/* Quantity Field */}
                        <div className="form-group">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faBoxes} className="text-gray-400" />
                                </div>
                                <input
                                    placeholder="Nhập số lượng"
                                    type="text"
                                    id="quantity"
                                    value={quantity}
                                    onChange={handleOnChangeQuantity}
                                    className={`appearance-none block w-full pl-10 py-3 border ${errorQuantity ? 'border-red-300' : 'border-[color:var(--border-color)]'} rounded-lg shadow-sm focus:outline-none focus:ring-2 ${errorQuantity ? 'focus:ring-red-500' : 'focus:ring-[color:var(--border-color-focus)]'} focus:border-transparent transition-all duration-200 hover:border-[color:var(--border-color-hover)]`}
                                />
                            </div>
                            <p className='h-5 text-red-500 text-sm mt-1'>{errorQuantity}</p>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 mt-6 items-center justify-center">
                            <button
                                type="submit"
                                disabled={!selectedEquipment || year === '' || quantity === '' || errorYear !== '' || errorQuantity !== '' || year.length < 4}
                                className={`inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white transition-all duration-200 ${!selectedEquipment || year === '' || quantity === '' || errorYear !== '' || errorQuantity !== '' || year.length < 4
                                    ? 'bg-gray-400 cursor-not-allowed opacity-70'
                                    : 'bg-[color:var(--background-button)] hover:bg-[color:var(--background-button-hover)] active:bg-[color:var(--background-button-active)] shadow-md hover:shadow-lg'}`}
                                onClick={handleOnSubmit}
                            >
                                <FontAwesomeIcon icon={faSave} className="mr-2" />
                                Cập nhật
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowEdit(false)}
                                className="inline-flex justify-center items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-700 hover:bg-red-800 active:bg-red-900 transition-all duration-200 shadow-md hover:shadow-lg"
                            >
                                <FontAwesomeIcon icon={faXmark} className="mr-2" />
                                Hủy
                            </button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}

export default EditEquipmentDistribution;