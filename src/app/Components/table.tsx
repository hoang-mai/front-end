'use client';
import React, { useState, useMemo } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from '@mui/material/Modal';
import { toast } from 'react-toastify';
import { del } from '../Services/callApi';

interface HeadCell<T> {
    id: keyof T & (number | string);
    label: string;
}
interface EditComponentProps {
    midTermWeight?: string;
    data: any;
    showEdit: boolean;
    setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
    setDatas: React.Dispatch<React.SetStateAction<any[]>>;
}

interface ModalProps {
    headTitle: string;
    successMessage: string;
    errorMessage: string;
    url: string;
}
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
const renderCellValue = <T extends Record<string, unknown>>(row: T, id: keyof T) => {
    const value = row[id];

    if (value instanceof Date) return value.toLocaleDateString("vi-VN");
    if (value === null || value === undefined || value === '') return "-";

    const stringValue = String(value);
    return stringValue.length > 20 ? stringValue.slice(0, 17) + "..." : stringValue;
};
interface TableComponentProps<T> {
    index?: boolean;
    headCells: HeadCell<T>[]
    dataCells: T[];
    onRowClick: (id: number) => void;
    search?: string
    modal?: ModalProps;
    EditComponent?: React.FC<EditComponentProps>;
    setDatas?: React.Dispatch<React.SetStateAction<T[]>>;
    deleteCell?: boolean;
    actionCell?: boolean;
    midTermWeight?: string;
}
const TableComponent = <T extends { id: number } & Record<string, unknown>>({
    index,
    headCells,
    dataCells,
    onRowClick,
    search,
    modal,
    EditComponent,
    setDatas,
    actionCell = true,
    deleteCell = true,
    midTermWeight,
}: TableComponentProps<T>) => {

    console.log(midTermWeight);
    const [order, setOrder] = useState<Order | null>(null);
    const [orderBy, setOrderBy] = useState<keyof T | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState<number>(0);
    const [edit, setEdit] = useState<boolean>(false);
    const [editId, setEditId] = useState<number>(0);
    const handleRequestSort = (property: keyof T) => {
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
        return dataCells
            .filter((dataCell) => {
                if (!search) return true;

                return Object.values(dataCell).some(value => {
                    if (value == null) return false;
                    if (value instanceof Date) return value.toLocaleDateString("vi-VN").toLowerCase().includes(search.toLowerCase());
                    if (typeof value === "object") return false;
                    return String(value).toLowerCase().includes(search.toLowerCase());
                });

            })
            .sort(getComparator(order, orderBy))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [order, orderBy, page, rowsPerPage, dataCells, search]);

    return (

        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table aria-labelledby="tableTitle" size='medium'>
                        <TableHead>
                            <TableRow className='bg-green-100'>
                                {index && <TableCell align='center' padding='normal' sx={{
                                    paddingX: {
                                        lg: '16px',
                                        md: '4px',
                                        sm: '0px',
                                    }
                                }}>
                                    STT
                                </TableCell>
                                }
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
                                {actionCell && <TableCell align='center' padding='normal' sx={{
                                    paddingX: {
                                        lg: '16px',
                                        md: '4px',
                                        sm: '0px',
                                    }
                                }}>
                                    Hành động
                                </TableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleAndFilterRows.map((dataCell) => (
                                <StyledTableRow
                                    tabIndex={-1}
                                    key={dataCell.id}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onRowClick(dataCell.id)}
                                >
                                    {index && <TableCell align='center'>
                                        {dataCells.indexOf(dataCell) + 1}
                                    </TableCell>}
                                    {headCells.map((headCell) => (
                                        <TableCell key={headCell.id} align="center">
                                            {renderCellValue(dataCell, headCell.id)}
                                        </TableCell>
                                    ))}
                                    {actionCell && <TableCell onClick={(e) => e.stopPropagation()} align='center'>
                                        <div className='flex gap-2'>
                                            <button className=' flex-1 rounded-lg'
                                                onClick={(e) => {

                                                    setEdit(true);
                                                    setEditId(dataCell.id);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faPencil} />
                                            </button>
                                            {deleteCell && <button className=' flex-1 rounded-lg'
                                                onClick={(e) => {

                                                    setConfirmDelete(true);
                                                    setConfirmDeleteId(dataCell.id);
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>}
                                        </div>
                                    </TableCell>}
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
                {deleteCell && <Modal open={confirmDelete} onClose={() => setConfirmDelete(false)}
                    className='flex items-center justify-center'
                >
                    <Box className="p-8 bg-white rounded-md shadow-md">
                        <h1 className="text-lg font-bold mb-4">{modal?.headTitle}</h1>
                        <div className="flex justify-center gap-10">
                            <button
                                className='bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 active:bg-red-700 transition-colors'
                                onClick={() => {
                                    toast.promise(del(modal?.url + '/' + confirmDeleteId),
                                        {
                                            pending: "Đang xử lý...",
                                            success: modal?.successMessage,
                                            error: modal?.errorMessage,
                                        }
                                    ).then(() => {
                                        setConfirmDelete(false);
                                        setDatas?.((prev) => prev.filter((dataCell) => dataCell.id !== confirmDeleteId));
                                    }).catch((err) => {
                                        const firstValue = Object.values(err.errors as ErrorResponse)[0][0] ?? "Có lỗi xảy ra!";
                                        toast.error(firstValue);
                                    })
                                }
                                }
                            >
                                Đồng ý
                            </button>
                            <button
                                className=' bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 active:bg-gray-500 transition-colors'
                                onClick={() => setConfirmDelete(false)}
                            >
                                Không
                            </button>
                        </div>
                    </Box>
                </Modal>}
                {edit && EditComponent && setDatas &&
                    <EditComponent
                        data={dataCells.find((dataCell) => dataCell.id === editId)}
                        showEdit={edit}
                        setShowEdit={setEdit}
                        setDatas={setDatas}
                        midTermWeight={midTermWeight}
                    />}

            </Paper>
        </Box>

    );
}

export default TableComponent;
