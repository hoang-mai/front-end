'use client';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import { styled } from '@mui/material/styles';
import { put } from '@/app/Services/callApi';
import { course } from '@/app/Services/api';
import { toast } from 'react-toastify';

// Import MUI icons
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import GradeIcon from '@mui/icons-material/Grade';
import SchoolIcon from '@mui/icons-material/School';

interface HeadCell {
    id: keyof Student;
    label: string;
}
const headCells: HeadCell[] = [
    { id: 'name', label: 'Họ và tên', },
    { id: 'email', label: 'Email', },
    { id: 'midtermGrade', label: 'Điểm giữa kỳ', },
    { id: 'finalGrade', label: 'Điểm cuối kỳ', },
    { id: 'totalGrade', label: 'Điểm tổng kết', },
];
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
    '&:nth-of-type(even)': {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator<T>(
    order: Order | null,
    orderBy: keyof T | null,
): (a: T, b: T) => number {
    if (order === null || orderBy === null) {
        return () => 0;
    }
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface Student extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    midtermGrade: string;
    finalGrade: string;
    totalGrade: string;
    status: string;
    notes: string;
    image: string | null;
}
interface EnterGradeModalProps {
    classId: number;
    midtermWeight: string;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    dataCells: Student[];
    setStudents: Dispatch<SetStateAction<Student[]>>;
}

const EnterGradeModal: React.FC<EnterGradeModalProps> = ({
    setStudents,
    classId,
    showModal,
    midtermWeight,
    setShowModal,
    dataCells,
}) => {

    const [midtermGrades, setMidtermGrades] = useState<string[]>(dataCells.map(s => (s.midtermGrade)));
    const [finalGrades, setFinalGrades] = useState<string[]>(dataCells.map(s => (s.finalGrade)));
    const [error, setError] = useState<string>('');

    const handleMidtermChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        const index = Number(e.target.id);
        const validFormat = /^(10(\.0{0,2})?|\d{0,1}(\.\d{0,2})?)?$/;
        if (validFormat.test(value) || value === '') {
            const newMidtermGrades = [...midtermGrades];
            newMidtermGrades[index] = value;
            setMidtermGrades(newMidtermGrades);
        }

    };

    const handleFinalChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const value = e.target.value;
        const index = Number(e.target.id);
        const validFormat = /^(10(\.0{0,2})?|\d{0,1}(\.\d{0,2})?)?$/;
        if (validFormat.test(value) || value === '') {
            const newFinalGrades = [...finalGrades];
            newFinalGrades[index] = value;
            setFinalGrades(newFinalGrades);
        }
    };
    const [order, setOrder] = useState<Order | null>(null);
    const [orderBy, setOrderBy] = useState<keyof Student | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleRequestSort = (property: keyof Student) => {
        if (orderBy !== property) {
            setOrder('asc');
            setOrderBy(property);
        } else if (orderBy === property && order === 'asc') {
            setOrder('desc');
        } else {
            setOrder(null);
            setOrderBy(null);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - dataCells.length) : 0;

    const visibleAndFilterRows = useMemo(() => {
        return dataCells.toSorted(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [order, orderBy, page, rowsPerPage, dataCells]);


    const handleOnSubmit = () => {
        toast.promise(
            put(course + '/' + classId + '/grades/bulk', {
                grades:
                    dataCells.map((s, index) => ({
                        user_id: s.id,
                        midterm_grade: midtermGrades[index],
                        final_grade: finalGrades[index],

                    }))
            }),
            {
                pending: 'Đang lưu điểm',
                success: {
                    render({ data }) {
                        return data.data.message;
                    },
                },
                error: 'Lưu điểm thất bại'
            }
        ).then(() => {
            setShowModal(false);
            setStudents((prev) => prev.map((student, index) => ({
                ...student,
                midtermGrade: midtermGrades[index],
                finalGrade: finalGrades[index],
                totalGrade: (Number(midtermGrades[index]) * Number(midtermWeight) + Number(finalGrades[index]) * (1 - Number(midtermWeight))).toFixed(2),
                status: (Number(midtermGrades[index]) * Number(midtermWeight) + Number(finalGrades[index]) * (1 - Number(midtermWeight))) >= 4 ? 'Hoàn thành' : 'Trượt',
            })));
        }).catch((err) => {

            setError(err.message);
        });
    };

    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            className="flex items-center justify-center"
        >
            <Box className=' lg:w-[70%] md:w-[90%]  h-[85%] w-[99%] flex flex-col bg-gray-100 p-4 md:p-7 rounded-lg shadow-lg overflow-y-auto custom-scrollbar'>
                <div className='relative w-full'>
                    <h2 className='text-2xl font-semibold text-(--color-text) text-center'>Nhập điểm học viên</h2>
                    <button className='w-7 h-7 rounded-full absolute md:top-1/2 md:right-0 md:transform md:-translate-y-3/4 -top-5 -right-5 text-xl active:scale-90 transition-transform duration-200'
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        <CloseIcon className="text-(--color-text)" />
                    </button>
                    <hr className='my-2' />
                </div>
                <div className='flex flex-col gap-4 overflow-y-auto flex-1'>
                    <Box sx={{ width: '100%' }}>
                        <Paper sx={{ width: '100%', mb: 2 }}>
                            <div className="text-xl font-bold text-black p-4 text-center flex justify-center items-center">
                                <SchoolIcon className="mr-2" />
                                Điểm tổng kết = {midtermWeight} × Điểm giữa kỳ + {(1 - Number(midtermWeight)).toFixed(2)} × Điểm cuối kỳ
                            </div>
                            <TableContainer>
                                <Table aria-labelledby="tableTitle" size='medium'>
                                    <TableHead>
                                        <TableRow className='bg-green-100'>
                                            {headCells.map((headCell) => (
                                                <TableCell
                                                    key={headCell.id}
                                                    align='center'
                                                    padding='normal'
                                                    sortDirection={orderBy === headCell.id ? order ?? undefined : undefined}
                                                    sx={{
                                                        paddingX: {
                                                            lg: '16px',
                                                            md: '4px',
                                                            sm: '0px',
                                                        }
                                                    }}
                                                >
                                                    <TableSortLabel
                                                        active={orderBy === headCell.id}
                                                        direction={orderBy === headCell.id ? order ?? undefined : undefined}
                                                        onClick={() => handleRequestSort(headCell.id)}
                                                        sx={{ "&:focus": { color: 'inherit' } }}
                                                    >
                                                        {headCell.label}
                                                        {orderBy === headCell.id ? (
                                                            <Box component="span" sx={visuallyHidden}>
                                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                            </Box>
                                                        ) : null}
                                                    </TableSortLabel>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {visibleAndFilterRows.map((dataCell, index) => (
                                            <StyledTableRow

                                                tabIndex={-1}
                                                key={index}
                                            >
                                                <TableCell align="center">
                                                    {dataCell.name}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {dataCell.email}
                                                </TableCell>
                                                <TableCell align="center" className='w-1/7'>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            title="Chỉ nhập số từ 0-10, tối đa 2 chữ số thập phân"
                                                            className="w-full shadow appearance-none border rounded-2xl py-2 pl-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                                            value={midtermGrades[index]}
                                                            onChange={handleMidtermChange}
                                                            id={index.toString()}
                                                        />
                                                        <GradeIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center" className='w-1/7'>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            title="Chỉ nhập số từ 0-10, tối đa 2 chữ số thập phân"
                                                            className="w-full shadow appearance-none border rounded-2xl py-2 pl-2 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)"
                                                            value={finalGrades[index]}
                                                            onChange={handleFinalChange}
                                                            id={index.toString()}
                                                        />
                                                        <GradeIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" fontSize="small" />
                                                    </div>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {
                                                        midtermGrades[index] && finalGrades[index] ?
                                                            (Number(midtermGrades[index]) * Number(midtermWeight) + Number(finalGrades[index]) * (1 - Number(midtermWeight))).toFixed(2)
                                                            : "-"
                                                    }
                                                </TableCell>

                                            </StyledTableRow>
                                        ))}
                                        {emptyRows > 0 && (
                                            <StyledTableRow
                                                style={{
                                                    height: 53 * emptyRows,
                                                }}
                                            >
                                                <TableCell colSpan={dataCells.length} />
                                            </StyledTableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 15, 25]}
                                component="div"
                                count={dataCells.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage='Số dòng trên trang:'
                            />
                        </Paper>
                    </Box>

                </div>
                {error &&
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg relative mb-2" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
                }
                <div className='flex justify-center gap-4 w-full '>
                    <button className='btn-text text-white px-4 h-10 rounded-lg flex items-center' onClick={handleOnSubmit}>
                        <SaveIcon className="mr-2" fontSize="small" />
                        Lưu
                    </button>
                    <button className='bg-red-700 text-white px-4 h-10 rounded-lg hover:bg-red-800 active:bg-red-900 flex items-center' onClick={() => setShowModal(false)}>
                        <CancelIcon className="mr-2" fontSize="small" />
                        Hủy
                    </button>
                </div>
            </Box>
        </Modal>
    );
};

export default EnterGradeModal;


