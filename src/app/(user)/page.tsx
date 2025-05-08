'use client';
import React, { useEffect, useState } from 'react';
import { get } from '../Services/callApi';
import { studentCoursesGrades } from '../Services/api';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import TableComponent from '../Components/table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import LoaderLine from '../Components/Loader/loaderLine';
import GradeDetail from './gradeDetail';
import NoContent from '../Components/noContent';

interface Grade extends Record<string, any> {
  courseId: string;
  courseName: string;
  midtermGrade: number | null;
  finalGrade: number | null;
  totalGrade: number | null;
  status: string;
  note: string;
  termId: string;
  termName: string;
  id: number;
}

type GradeDistribution = {
  'A+': number;
  'A': number;
  'B+': number;
  'B': number;
  'C+': number;
  'C': number;
  'D+': number;
  'D': number;
  'F': number;
  'W': number;
};

function convertDataToGrades(data: any[]): Grade[] {
  return data.map((item, index) => ({
    id: index,
    courseId: item.course_id,
    courseName: item.course_name,
    midtermGrade: item.midterm_grade !== null ? Number(item.midterm_grade) : null,
    finalGrade: item.final_grade !== null ? Number(item.final_grade) : null,
    totalGrade: item.total_grade !== null ? Number(item.total_grade) : null,
    status: convertStatus(item.status),
    note: item.note,
    termId: item.term_id,
    termName: item.term_name,
  }));
}

// Function to convert numeric grade to letter grade
function getLetterGrade(score: number | null): keyof GradeDistribution {
  if (score === null) return 'W';
  if (score >= 9.5) return 'A+';
  if (score >= 8.6) return 'A';
  if (score >= 8.0) return 'B+';
  if (score >= 7.0) return 'B';
  if (score >= 6.5) return 'C+';
  if (score >= 5.5) return 'C';
  if (score >= 5.0) return 'D+';
  if (score >= 4.0) return 'D';
  return 'F';
}

// Convert 10-point scale to 4-point scale
function convertTo4PointScale(score: number | null): number {
  if (score === null) return 0;

  // Convert based on letter grade ranges
  if (score >= 9.5) return 4.0;      // A+
  if (score >= 8.6) return 4.0;      // A
  if (score >= 8.0) return 3.5;      // B+
  if (score >= 7.0) return 3.0;      // B
  if (score >= 6.5) return 2.5;      // C+
  if (score >= 5.5) return 2.0;      // C
  if (score >= 5.0) return 1.5;      // D+
  if (score >= 4.0) return 1.0;      // D
  return 0.0;                         // F
}

// Calculate GPA for a single term using the 4-point scale
function calculateTermGPA(grades: Grade[], termId: string): number {
  const termGrades = grades.filter(grade => grade.termId === termId && grade.totalGrade !== null);
  if (termGrades.length === 0) return 0;

  // Calculate total credit hours and quality points
  let totalCredits = 0;
  let totalQualityPoints = 0;

  termGrades.forEach(grade => {
    // Assuming each course has equal credit hours (e.g., 3 credits)
    // You can modify this if you have actual credit hours data
    const creditHours = 1;
    const gradePoint = convertTo4PointScale(grade.totalGrade);

    totalCredits += creditHours;
    totalQualityPoints += gradePoint * creditHours;
  });

  // Calculate GPA: Total Quality Points / Total Credit Hours
  return totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
}

function getNoteColor(score: number | null): string {
  if (score === null) return '#9e9e9e'; // Gray for null values
  if (score >= 9.5) return '#4caf50';  // Green for A+
  if (score >= 8.6) return '#66bb6a';  // Light Green for A
  if (score >= 8.0) return '#2196f3';  // Blue for B+
  if (score >= 7.0) return '#42a5f5';  // Light Blue for B
  if (score >= 6.5) return '#ff9800';  // Orange for C+
  if (score >= 5.5) return '#ffa726';  // Light Orange for C
  if (score >= 5.0) return '#f44336';  // Red for D+
  if (score >= 4.0) return '#ef5350';  // Light Red for D
  return '#d32f2f';                    // Dark Red for F
}
interface HeadCell {
  id: keyof Grade;
  label: string;
}
function convertStatus(status: string): string {
  switch (status) {
    case 'enrolled':
      return 'Chưa có điểm';
    case 'failed':
      return 'Trượt môn';
    case 'completed':
      return 'Qua môn';
    default:
      return status;
  }
}
const headCells: HeadCell[] = [
  { id: 'courseName', label: 'Tên Môn Học' },
  { id: 'termName', label: 'Học Kỳ' },
  { id: 'midtermGrade', label: 'Điểm Giữa Kỳ' },
  { id: 'finalGrade', label: 'Điểm Cuối Kỳ' },
  { id: 'totalGrade', label: 'Điểm Tổng Kết' },
  { id: 'status', label: 'Trạng Thái' },
  { id: 'note', label: 'Ghi Chú' }
];

function HomePage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [detail, setDetail] = useState<Grade | null>(null);
  const [open, setOpen] = useState(false);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }

  const [terms, setTerms] = useState<string[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution>({
    'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0, 'W': 0
  });
  const [gpaData, setGpaData] = useState<number[]>([]);
  const [cpaData, setCpaData] = useState<number[]>([]);

  // Grade colors for the bar chart
  const gradeColors = {
    'A+': '#4caf50', // Green
    'A': '#66bb6a',
    'B+': '#2196f3', // Blue
    'B': '#42a5f5',
    'C+': '#ff9800', // Orange
    'C': '#ffa726',
    'D+': '#f44336', // Red
    'D': '#ef5350',
    'F': '#d32f2f',  // Dark Red
    'W': '#9e9e9e'   // Gray for withdrawal
  };

  useEffect(() => {
    get(studentCoursesGrades).then((res) => {
      const gradesData = convertDataToGrades(res.data.data);
      setGrades(gradesData);

      // Extract unique terms
      const uniqueTerms = [...new Set(gradesData.map(grade => grade.termId))];
      setTerms(uniqueTerms);

      // Calculate grade distribution
      const distribution: GradeDistribution = {
        'A+': 0, 'A': 0, 'B+': 0, 'B': 0, 'C+': 0, 'C': 0, 'D+': 0, 'D': 0, 'F': 0, 'W': 0
      };

      gradesData.forEach(grade => {
        const letterGrade = getLetterGrade(grade.totalGrade);
        distribution[letterGrade] += 1;
      });
      setGradeDistribution(distribution);

      // Calculate GPA for each term using the 4-point scale
      const termGPAs = uniqueTerms.map(termId => calculateTermGPA(gradesData, termId));
      setGpaData(termGPAs);

      // Calculate cumulative GPA (CPA) on 4-point scale
      const cumulativeGPAs = [];
      let totalCumulativeCredits = 0;
      let totalCumulativeQualityPoints = 0;

      for (let i = 0; i < uniqueTerms.length; i++) {
        const termGrades = gradesData.filter(grade =>
          grade.termId === uniqueTerms[i] && grade.totalGrade !== null);

        // Calculate credit hours and quality points for this term
        termGrades.forEach(grade => {
          const creditHours = 1; // Assuming each course has 1 credit hour
          const gradePoint = convertTo4PointScale(grade.totalGrade);

          totalCumulativeCredits += creditHours;
          totalCumulativeQualityPoints += gradePoint * creditHours;
        });

        // Add the cumulative GPA for this term
        const currentCumulativeGPA = totalCumulativeCredits > 0 ?
          totalCumulativeQualityPoints / totalCumulativeCredits : 0;

        cumulativeGPAs.push(currentCumulativeGPA);
      }
      setCpaData(cumulativeGPAs);

    }).catch((err) => {
      setError(err.data?.message ?? 'Có lỗi xảy ra trong quá trình tải dữ liệu');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Custom colors for the charts
  const chartColors = ['#1976d2', '#4caf50', '#ff9800'];

  // Calculate overall GPA
  const calculateOverallGPA = () => {
    if (cpaData.length === 0) return 0;
    return cpaData[cpaData.length - 1];
  };

  // Calculate % of courses with good grades (B or higher)
  const calculateGoodGradesPercentage = () => {
    const totalCourses = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);
    if (totalCourses === 0) return 0;
    const goodGrades = gradeDistribution['A+'] + gradeDistribution['A'] + gradeDistribution['B+'] + gradeDistribution['B'];
    return (goodGrades / totalCourses) * 100;
  };

  // Sort grades in descending order for the bar chart
  const sortedGrades = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F', 'W'];
  const sortedGradeValues = sortedGrades.map(grade => gradeDistribution[grade as keyof GradeDistribution]);
  const sortedGradeColors = sortedGrades.map(grade => gradeColors[grade as keyof typeof gradeColors]);

  // Create pie chart data
  const pieChartData = sortedGrades
    .map((grade, index) => ({
      name: grade,
      value: sortedGradeValues[index],
      fill: gradeColors[grade as keyof typeof gradeColors]
    }))
    .filter(item => item.value > 0); // Only show grades that have at least one course

  if (loading) {
    return (
      <div className='w-5/6'>
        <div className='w-full flex justify-center items-center mb-10 '>
          <LoaderLine height='h-7' width='w-50' />
        </div>
        <div className='w-full flex flex-row gap-20 mb-10'>
          <LoaderLine width='w-1/2' height='h-10' />
          <LoaderLine width='w-1/2' height='h-10' />
        </div>
        <div className='w-full flex flex-row gap-20 mb-10'>
          <LoaderLine width='w-1/2' height='h-10' />
          <LoaderLine width='w-1/2' height='h-10' />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
}

  // Get term names for x-axis labels
  const termNames = terms.map(termId => {
    const termGrade = grades.find(grade => grade.termId === termId);
    return termGrade ? termGrade.termName : termId;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-(--color-text) text-center">Kết Quả Học Tập</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">CPA</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{calculateOverallGPA().toFixed(2)}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Thang điểm 0-4.0</span>
              <span className="text-xs font-medium" style={{ color: getNoteColor(calculateOverallGPA() * 2.5) }}>
                {calculateOverallGPA() >= 3.0 ? 'Xuất sắc' : calculateOverallGPA() >= 2.0 ? 'Tốt' : 'Cần cải thiện'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className="h-1.5 rounded-full" style={{
                width: `${(calculateOverallGPA() / 4) * 100}%`,
                backgroundColor: getNoteColor(calculateOverallGPA() * 2.5)
              }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Số Môn Đã Hoàn Thành</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{grades.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Tổng số môn học</span>
              <span className="text-xs font-medium text-gray-700">{terms.length} kỳ học</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Điểm Tốt (B trở lên)</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{calculateGoodGradesPercentage().toFixed(0)}%</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976-2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Chỉ số hiệu suất</span>
              <span className="text-xs font-medium"
                style={{
                  color: calculateGoodGradesPercentage() >= 70 ? '#4caf50' :
                    calculateGoodGradesPercentage() >= 50 ? '#ff9800' : '#f44336'
                }}>
                {calculateGoodGradesPercentage() >= 70 ? 'Xuất sắc' :
                  calculateGoodGradesPercentage() >= 50 ? 'Tốt' : 'Cần cải thiện'}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className="h-1.5 rounded-full"
                style={{
                  width: `${calculateGoodGradesPercentage()}%`,
                  backgroundColor: calculateGoodGradesPercentage() >= 70 ? '#4caf50' :
                    calculateGoodGradesPercentage() >= 50 ? '#ff9800' : '#f44336'
                }}>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">GPA Kỳ Gần Nhất</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {gpaData.length > 0 ? gpaData[gpaData.length - 1].toFixed(2) : 'N/A'}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{termNames.length > 0 ? termNames[termNames.length - 1] : ''}</span>
              {gpaData.length > 1 && (
                <span className={`text-xs font-medium ${gpaData[gpaData.length - 1] >= gpaData[gpaData.length - 2] ? 'text-green-500' : 'text-red-500'}`}>
                  {gpaData[gpaData.length - 1] >= gpaData[gpaData.length - 2] ? '↑ Tăng' : '↓ Giảm'}
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className="h-1.5 rounded-full"
                style={{
                  width: gpaData.length > 0 ? `${(gpaData[gpaData.length - 1] / 4) * 100}%` : '0%',
                  backgroundColor: gpaData.length > 0 ? getNoteColor(gpaData[gpaData.length - 1] * 2.5) : '#9e9e9e'
                }}>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Grade Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
          <h2 className="text-xl font-semibold text-(--color-text) mb-4">Phân Bố Điểm</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedGrades.map((grade, index) => ({
                  grade,
                  value: sortedGradeValues[index]
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="grade"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                  cursor={{ fill: 'rgba(236, 236, 236, 0.6)' }}
                />
                <Bar dataKey="value" name="Số Môn Học">
                  {sortedGrades.map((grade) => (
                    <Cell
                      key={`cell-${grade}`}
                      fill={gradeColors[grade as keyof typeof gradeColors]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center mt-4 gap-3">
            {sortedGrades.map((grade) => (
              <div key={grade} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-sm mr-1"
                  style={{ backgroundColor: gradeColors[grade as keyof typeof gradeColors] }}
                ></div>
                <span className="text-xs text-gray-600">{grade}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grades Pie Chart */}
        <div className="bg-white rounded-xl shadow-md pt-6 pb-6 ">
          <h2 className="text-xl font-semibold text-(--color-text) mb-4 pl-6">Tổng Quan Điểm Số</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} Môn Học`, name]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-sm text-gray-600 mt-2">
            Phân bố điểm số tất cả các môn học
          </div>
        </div>
      </div>

      {/* GPA Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-(--color-text) mb-4">GPA</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={termNames.map((term, index) => ({
                  term,
                  gpa: gpaData[index].toFixed(2)
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="term"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gpa"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 8, fill: '#10b981', strokeWidth: 2, stroke: 'white' }}
                  name="GPA"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 transition-all hover:shadow-lg">
          <h2 className="text-xl font-semibold text-(--color-text) mb-4">CPA</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={termNames.map((term, index) => ({
                  term,
                  cpa: cpaData[index].toFixed(2)
                }))}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="term"
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis
                  domain={[0, 4]}
                  ticks={[0, 1, 2, 3, 4]}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cpa"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 8, fill: '#8b5cf6', strokeWidth: 2, stroke: 'white' }}
                  name="CPA"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grades Detail Table */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-(--color-text)">Chi tiết điểm các kỳ</h2>
          <div className="relative w-full md:w-64">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={handleSearchChange}
              type="text"
              placeholder="Tìm kiếm vi phạm"
              className="appearance-none border rounded-lg py-2 pl-10 pr-3 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 border-(--border-color)"
            />
          </div>
          <div className="text-sm text-gray-500">{grades.length} khoá học </div>
        </div>
        {grades.length === 0 ? (
          <NoContent title='Không có dữ liệu' description= 'Chưa có điểm cho các học kỳ' />
        ) : (
        <div className="overflow-x-auto">
          <TableComponent
            index={true}
            dataCells={grades}
            headCells={headCells}
            search={search}
            actionCell={false}
            onRowClick={
              (row) => {
                setDetail(grades[row]);
                setOpen(true);
              }
            }

          />
        </div>
        )}
      </div>
      {open && detail && (
        <GradeDetail
          grade={detail}
          showDetail={open}
          setShowDetail={setOpen}
        />
      )}
    </div>
  );
}

export default HomePage;


