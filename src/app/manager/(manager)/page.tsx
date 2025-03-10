'use client';
import React, { useState } from 'react';
import SelectComponent from '@/app/Components/select';
interface PerformanceEvent {
  name: string;
  term: string;
  code: string;
  subject: string;
  credits: number;
  time: string;
  room: string;
  score: string;
}

const performanceData: PerformanceEvent[] = [
  { name: '1', term: '2024A', code: 'CS101', subject: 'Math', credits: 3, time: '10:00', room: '101', score: 'A' },
  // Add more data as needed
];

const results: { [key: string]: string } = {
  '1': 'A',
  // Add more results as needed
};

const evaluatePerformance = (event: PerformanceEvent, result: string): string => {
  // Implement your evaluation logic here
  return result;
};

const HomePage = () => {
  const [selectedCount, setSelectedCount] = useState<string>('5')
  const [selectedTerm, setSelectedTerm] = useState<string>('Tất cả')
  return (
        <>
        <h1 className=' font-bold text-2xl text-center text-(--color-text)'>Kết quả học tập</h1>
        <div className='flex w-full justify-between gap-4'>
          <SelectComponent width='w-[70px]' options={['5', '10', '20']} defaultOption='5' opacity={false} selected={selectedCount} setSelected={setSelectedCount} />
          <SelectComponent width='w-[90px]' options={['Tất cả', '2024A', '2024B', '2025A']} defaultOption='Tất cả' opacity={false} selected={selectedTerm} setSelected={setSelectedTerm} />
        </div>
        <table className=' w-full border border-(--border-color) border-separate border-spacing-0 rounded-lg'>
          <thead>
            <tr >
              <th className='rounded-tl-lg border-(--border-color)   lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>STT</th>
              <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Học kỳ</th>
              <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Mã học phần</th>
              <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Tên học phần</th>
              <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Số tín chỉ</th>
              <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Thời gian</th>
              <th className='border-l border-(--border-color)  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Phòng học</th>
              <th className='border-l border-(--border-color) rounded-tr-lg  lg:p-4 md:p-2 bg-gradient-to-r from-green-100 to-gray-100 '>Điểm số</th>
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
                <td className='border-t border-l border-(--border-color) lg:p-4 md:p-2  font-bold'>
                  {results[event.name] !== undefined ? evaluatePerformance(event, results[event.name]) : '-'}
                </td>
                <td className='border-t border-l border-(--border-color) lg:p-4 md:p-2  font-bold'>
                  {results[event.name] !== undefined ? evaluatePerformance(event, results[event.name]) : '-'}
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

export default HomePage;
