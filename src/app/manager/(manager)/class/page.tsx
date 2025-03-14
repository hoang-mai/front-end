'use client';

import React, { useState, useEffect } from 'react';
import DatePickerComponent from '@/app/Components/datePicker';
import SelectComponent from '@/app/Components/select';

const performanceData = [
    { name: 'Chạy 3000m', levels: { "Giỏi": 750, "Khá": 790, "Đạt": 830 } }, // Đơn vị: giây
    { name: 'Chạy 100m', levels: { "Giỏi": 12, "Khá": 13, "Đạt": 14 } },
    { name: 'Bơi', levels: { "Giỏi": 50, "Khá": 55, "Đạt": 60 } },
    { name: 'Xà đơn', levels: { "Giỏi": 15, "Khá": 12, "Đạt": 10 } },
    { name: 'Xà kép', levels: { "Giỏi": 20, "Khá": 15, "Đạt": 12 } }
];

const evaluatePerformance = (event: { name: string; levels: { [key: string]: number } }, value: number) => {
    const { levels } = event;
    if (value <= levels["Giỏi"]) return "Giỏi";
    if (value <= levels["Khá"]) return "Khá";
    if (value <= levels["Đạt"]) return "Đạt";
    return "Không đạt";
};

const PracticePage: React.FC = () => {

    const [results, setResults] = useState<{ [key: string]: number }>({});
    const [selected, setSelected] = useState<string>('5');
    useEffect(() => {
        // Fetch data from server
        const data = {
            "Chạy 3000m": 800,
            "Chạy 100m": 13,
            "Bơi": 60,
            "Xà đơn": 12,
            "Xà kép": 15
        };
        setResults(data);
    }
        , []);
    return (
                <>
                <h1 className=' font-bold text-2xl text-center text-(--color-text)'>Kết quả rèn luyện</h1>
                <div className='flex w-full justify-between gap-4'>
                    <SelectComponent width='w-[70px]' options={['5', '10', '20']} defaultOption='5' opacity={false} selected={selected} setSelected={setSelected} />
                    <DatePickerComponent lgWidth={"200px"} mdWidth={"180px"} smWidth={"170px"} xsWidth={"150px"} value={null} onChange={(e) => { console.log(e) }} />
                </div>
                <table className=' w-full border border-(--border-color) border-separate border-spacing-0 rounded-lg'>
                    <thead>
                        <tr >
                            <th className='rounded-tl-lg border-(--border-color)   lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>STT</th>
                            <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Bài tập</th>
                            <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Kết quả</th>
                            <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Đánh giá</th>
                            <th className='border-l border-(--border-color) rounded-tr-lg  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Ngày thực hiện</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performanceData.map((event) => (
                            <tr key={event.name} className='text-center'>
                                <td className='border-t border-(--border-color) lg:p-4 md:p-2 '>{event.name}</td>
                                <td className='border-t border-l border-(--border-color) lg:p-4 md:p-2 '>{event.name}</td>
                                <td className='border-t border-l border-(--border-color) lg:p-4 md:p-2 '>
                                    <p>{event.name}</p>
                                </td>
                                <td className='border-t border-l border-(--border-color) lg:p-4 md:p-2  font-bold'>
                                    {results[event.name] !== undefined ? evaluatePerformance(event, results[event.name]) : '-'}
                                </td>
                                <td className='border-t border-l border-(--border-color) lg:p-4 md:p-2   font-bold'>
                                    {results[event.name] !== undefined ? evaluatePerformance(event, results[event.name]) : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                            </>
    );
};

export default PracticePage;