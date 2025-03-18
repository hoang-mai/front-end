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

interface HeadCell<T> {
    id: keyof T & (number | string);
    label: string;
}

interface TableComponentProps<T> {
    headCells: HeadCell<T>[]
    dataCells: T[];
    onRowClick: (id: number) => void;
    search?: string
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
    ':hover': {
        
        boxShadow: 'inset 0px 0px 5px 1px rgba(0, 255, 0, 0.8)',
        transition: 'all 0.3s ease-in-out',
    }
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

    if (value instanceof Date) return value.toLocaleDateString("vi-VN"); // Xử lý Date
    if (value === null || value === undefined) return "-"; // Xử lý null, undefined
    return String(value); // Chuyển thành string
};

const TableComponent = <T extends { id: number } & Record<string, unknown>>({
    headCells,
    dataCells,
    onRowClick,
    search,
}: TableComponentProps<T>) => {


    const [order, setOrder] = useState<Order | null>(null);
    const [orderBy, setOrderBy] = useState<keyof T | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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
                            {visibleAndFilterRows.map((dataCell) => (
                                <StyledTableRow
                                    hover
                                    tabIndex={-1}
                                    key={dataCell.id}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => onRowClick(dataCell.id)}
                                >
                                    {headCells.map((headCell) => (
                                        <TableCell key={headCell.id} align="center">
                                            {renderCellValue(dataCell, headCell.id)}
                                        </TableCell>
                                    ))}

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

    );
}

export default TableComponent;
