import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import LoaderSpinner from '@/app/Components/Loader/loaderSpinner';
import useDebounce from '@/app/hooks/useDebounce';
import { toast } from 'react-toastify';
import { post } from '@/app/Services/callApi';
import { adminClasses } from '@/app/Services/api';
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
function convertDataToClassManager(data: any,manager:Manager | null) {
    return {
        id: data.id,
        name: data.name,
        managerId: manager?.id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        studentCount: 0,
        managerName: manager?.name,
        managerEmail: manager?.email,
    }
}
const data: Manager[] = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        email: ''
    },
    {
        id: 2,
        name: 'Nguyễn Văn B',
        email: ''
    },
    {
        id: 3,
        name: 'Nguyễn Văn C',
        email: ''
    },
    {
        id: 4,
        name: 'Nguyễn Văn D',
        email: ''
    },
    {
        id: 5,
        name: 'Nguyễn Văn E',
        email: ''
    },
    {
        id: 6,
        name: 'Nguyễn Văn F',
        email: ''
    },
]   
function AddClassManager({
    showModal,
    setShowModal,
    setDatas,
}: AddClassManagerProps
) {

    const searchRef = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState<Manager[]>();
    const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
    const debouncedQuery = useDebounce(search, 500, setLoading);
    const [error, setError] = useState<string>('');
    const [classManagerName, setClassManagerName] = useState<string>('');
    const handleOnSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast.promise(
            post(adminClasses,{
                name:classManagerName,
                manager_id:selectedManager?.id
            }),
            {
                pending:'Đang tạo lớp quản lý',
                success: 'Tạo lớp quản lý thành công',
                error: 'Tạo lớp quản lý thất bại',
            }
        ).then((res) => {
            setDatas((prev: any) => {
                return [convertDataToClassManager(res.data.data,selectedManager), ...prev];
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
        if(e.target.value === ''){
            setManagers(undefined);
        }
    }
    useEffect(() => {
        if(selectedManager){
            setLoading(false);
            return;
        }
        if (debouncedQuery && loading) {
            setManagers(data.filter(manager => manager.name.toLowerCase().includes(debouncedQuery.toLowerCase())));
            setLoading(false);  
        }
    }, [debouncedQuery,selectedManager])
    useEffect(() => {
        const handleOnClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {

                setLoading(false);
                setManagers(undefined);
                if(!selectedManager){
                    setSearch('');
                }
            }
        }
        document.addEventListener('mousedown', handleOnClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleOnClickOutside);
        }
    }, [searchRef, selectedManager])
    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center "
        >
            <Box className='xl:w-[50%] lg:w-[60%] md:w-[80%] h-[60%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg '>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Thêm lớp quản lý</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <FontAwesomeIcon icon={faXmark} className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className="w-full flex justify-center flex-1">
                    <form action="" className="lg:w-150 w-120 lg:px-16 md:px-8 flex flex-col flex-1" >
                        <div className="flex flex-col relative mb-4">
                            <label htmlFor="name" className="mr-2">Tên lớp quản lý (<span className='text-red-500'>*</span>)</label>
                            <input 
                                placeholder='Tên lớp quản lý'
                                value={classManagerName}
                                onChange={(e) => setClassManagerName(e.target.value)}
                            type="text" id="name" className="shadow appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none  border-(--border-color) hover:border-(--border-color-hover)" />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor="manager" className="mr-2">Quản lý</label>
                            <div className='relative w-full h-10 max-h-10 '>
                                <div className={`absolute w-full z-10001 flex flex-col rounded-lg h-fit  ${(loading || managers) && 'bg-white shadow-md '}`}
                                    ref={searchRef}
                                >
                                    <input
                                        placeholder="Quản lý"
                                        type="text"
                                        className="appearance-none border rounded-lg w-full py-2 px-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                        value={search}
                                        onChange={handleOnChangeSearch}
                                    />
                                    {(() => {
                                        let content;
                                        if (loading) {
                                            content = <LoaderSpinner />;
                                        } else if (managers) {
                                            content = managers.length > 0 ? (
                                                <ul className='max-h-40 overflow-y-auto'>
                                                    {
                                                        managers.map(manager => (
                                                            <li key={manager.id} className='w-full'>
                                                                <button className="w-full flex items-center justify-between bg-white p-2 rounded-lg hover:bg-gray-100 "
                                                                    onClick={() => {
                                                                        setSelectedManager(manager);
                                                                        setSearch(manager.name);
                                                                        setManagers(undefined);
                                                                    }}
                                                                >
                                                                    <div className="text-left">
                                                                        <h3>{manager.name}</h3>
                                                                        <p className="text-gray-500 text-sm">{manager.email}</p>
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        ))}
                                                </ul>
                                            ) : (
                                                <p className="text-center my-2">Không tìm thấy quản lý</p>
                                            );
                                        } else {
                                            content = null;
                                        }
                                        return content;
                                    })()}
                                </div>
                            </div>
                        </div>
                        <p className='h-5 text-red-500 text-sm my-2 '>{error}</p>
                        <div className='flex items-center justify-center'>
                            <button
                                onClick={handleOnSubmit}
                                disabled={!classManagerName}
                                type="submit"
                                className="btn-text bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                Tạo lớp quản lý
                            </button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
}

export default AddClassManager;


