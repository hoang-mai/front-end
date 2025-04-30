import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faUsers, faUserTie, faPlus, faSearch, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import LoaderSpinner from '@/app/Components/Loader/loaderSpinner';
import useDebounce from '@/app/hooks/useDebounce';
import { toast } from 'react-toastify';
import { get, post } from '@/app/Services/callApi';
import { adminAdminManager, adminClasses } from '@/app/Services/api';
interface AddClassManagerProps {
    readonly showModal: boolean;
    readonly setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    readonly setDatas: any;
}
interface Manager {
    readonly id: number;
    readonly name: string;
    readonly email: string;
}
function convertDataToClassManager(data: any, manager: Manager | null) {
    return {
        id: data.id,
        name: data.name,
        managerId: manager?.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        studentCount: 0,
        manager: {
            id: manager?.id,
            name: manager?.name,
            email: manager?.email,
        }
    }
}

function AddClassManager({
    showModal,
    setShowModal,
    setDatas,
}: AddClassManagerProps
) {

    const searchRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Manager[]>([]);
    const [managers, setManagers] = useState<Manager[]>();
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
    const debouncedQuery = useDebounce(search, 100, setLoading);
    const [error, setError] = useState<string>('');
    const [classManagerName, setClassManagerName] = useState<string>('');
    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            post(adminClasses, {
                name: classManagerName,
                manager_id: selectedManager?.id
            }),
            {
                pending: 'Đang tạo lớp quản lý',
                success: 'Tạo lớp quản lý thành công',
                error: 'Tạo lớp quản lý thất bại',
            }
        ).then((res) => {
            setDatas((prev: any) => {
                return [convertDataToClassManager(res.data.data, selectedManager), ...prev];
            });
            setShowModal(false);
        }
        ).catch((err) => {
            const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
            setError(firstValue);
        })
    }
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setSelectedManager(null);
        if (e.target.value === '') {
            setManagers(undefined);
        }
    }
    useEffect(() => {
        if (selectedManager) {
            setLoading(false);
            return;
        }
        if (debouncedQuery && loading) {
            setManagers(data.filter(manager => manager.name.toLowerCase().includes(debouncedQuery.toLowerCase())));
            setLoading(false);
        }
    }, [debouncedQuery, selectedManager])
    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {

                setLoading(false);
                setManagers(undefined);
                if (!selectedManager) {
                    setSearch('');
                }
            }
        }
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        }
    }, [searchRef, selectedManager])
    useEffect(() => {
        get(adminAdminManager)
            .then((res) => {
                setData(res.data.data);
            })
            .catch((res) => {
                toast.error(res.data.message);
                setError(res.data.message);
            })
    }, [])
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center"
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] h-[70%] w-[99%] flex flex-col bg-white rounded-xl shadow-2xl border border-(--border-color) overflow-hidden'>
                <div className='bg-[var(--color-text)] text-white p-5 relative'>
                    <h2 className='text-2xl font-semibold text-center'>Thêm lớp quản lý</h2>
                    <button className='absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-[var(--color-text-hover)] p-1 rounded-full transition-all duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                

                <div className="p-6  flex flex-col flex-1 items-center justify-center">
                    <form action="" className="lg:w-150 w-120 lg:px-16 md:px-8 flex flex-col flex-1">
                        <div className="flex flex-col relative mb-5">
                            <div className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faInfoCircle} className="text-(--color-text) mr-2" />
                                <label htmlFor="name" className="text-(--color-text) font-medium">Tên lớp quản lý <span className='text-red-500'>*</span></label>
                            </div>
                            <div className="relative">
                                <input
                                    placeholder='Tên lớp quản lý'
                                    value={classManagerName}
                                    onChange={(e) => setClassManagerName(e.target.value)}
                                    type="text"
                                    id="name"
                                    className="shadow appearance-none border rounded-lg w-full py-2.5 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--border-color-focus) border-(--border-color) hover:border-(--border-color-hover)"
                                />
                                <FontAwesomeIcon
                                    icon={faUsers}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                />
                            </div>
                        </div>

                        <div className='flex-1 mb-6'>
                            <div className="flex items-center mb-1">
                                <FontAwesomeIcon icon={faUserTie} className="text-(--color-text) mr-2" />
                                <label htmlFor="manager" className="text-(--color-text) font-medium">Quản lý</label>
                            </div>
                            <div className='relative w-full'>
                                <div className={`w-full flex flex-col rounded-lg h-fit`}
                                    ref={searchRef}
                                >
                                    <div className="relative">
                                        <input
                                            placeholder="Tìm kiếm quản lý"
                                            type="text"
                                            className="appearance-none border rounded-lg w-full py-2.5 pl-10 pr-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-(--border-color-focus) border-(--border-color) hover:border-(--border-color-hover)"
                                            value={search}
                                            onChange={handleOnChangeSearch}
                                        />
                                        <FontAwesomeIcon
                                            icon={faSearch}
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        />
                                    </div>
                                    {(() => {
                                        let content;
                                        if (loading) {
                                            content = <div className="py-4 flex justify-center"><LoaderSpinner /></div>;
                                        } else if (managers) {
                                            content = managers.length > 0 ? (
                                                <ul className='w-full absolute top-12 max-h-40 overflow-y-auto custom-scrollbar mt-1 border border-(--border-color) bg-white rounded-lg shadow-md'>
                                                    {
                                                        managers.map(manager => (
                                                            <li key={manager.id} className='w-full'>
                                                                <button className="w-full flex items-center justify-between p-2.5 hover:bg-gray-100 border-b border-(--border-color) last:border-b-0"
                                                                    onClick={() => {
                                                                        setSelectedManager(manager);
                                                                        setSearch(manager.name);
                                                                        setManagers(undefined);
                                                                    }}
                                                                >
                                                                    <div className="text-left flex items-center">
                                                                        <FontAwesomeIcon icon={faUserTie} className="text-(--color-text) mr-3" />
                                                                        <div>
                                                                            <h3 className="text-(--color-text) font-medium">{manager.name}</h3>
                                                                            <p className="text-gray-500 text-sm">{manager.email}</p>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        ))}
                                                </ul>
                                            ) : (
                                                <p className="text-center my-3 text-(--color-text) bg-white p-3 border border-(--border-color) rounded-lg mt-1">Không tìm thấy quản lý</p>
                                            );
                                        } else {
                                            content = null;
                                        }
                                        return content;
                                    })()}
                                </div>
                            </div>
                            {selectedManager && (
                                <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-(--border-color) flex items-center">
                                    <FontAwesomeIcon icon={faUserTie} className="text-(--color-text) mr-3" />
                                    <div>
                                        <p className="font-medium text-(--color-text)">{selectedManager.name}</p>
                                        <p className="text-sm text-gray-500">{selectedManager.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {error && (
                            <p className='text-red-500 text-sm mb-4 flex items-center'>
                                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                                {error}
                            </p>
                        )}

                        <div className='flex items-center justify-center mt-auto gap-4'>
                            <button
                                onClick={handleOnSubmit}
                                disabled={!classManagerName}
                                type="submit"
                                className="btn-text text-white py-2.5 px-8 rounded-lg focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                Tạo lớp quản lý
                            </button>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="bg-red-700 text-white py-2.5 px-8 rounded-lg hover:bg-red-800 active:bg-red-900 focus:outline-none focus:shadow-outline font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center">
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

export default AddClassManager;


