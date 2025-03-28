'use client';
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function violation() {
    const [search, setSearch] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    return ( 
        <div className='xl:w-[90%] md:w-full bg-white rounded-lg shadow-md lg:p-6 md:p-4 flex flex-col gap-4'>
              <h1 className='font-bold text-2xl text-center text-(--color-text)'>Quản lý học kỳ</h1>
              <div className='w-full flex justify-between items-center relative px-6'>
                <div className='relative'>
                  <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
                  <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
                <button className='btn-text text-white py-2 px-4 w-40 rounded-md'
                
                  onClick={() => setShowModal(true)}>
                  <FontAwesomeIcon icon={faPlus} className='mr-2' />
                  Thêm học kỳ
                </button>
              </div>

        </div>
     );
}

export default violation;