'use client';
import React, { useState, useEffect, useMemo } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { get } from '@/app/Services/callApi';
import { term } from '@/app/Services/api';
interface Term {
  id: number;
  nameTerm: string;
  startDate: Date;
  endDate: Date;
  rosterDeadline: Date;
  gradeEntryDate: Date;
}
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order | null,
  orderBy: Key | null,
): (
  a: { [key in Key]: number | string | Date },
  b: { [key in Key]: number | string | Date },
) => number {
  if (order === null || orderBy === null) {
    return () => 0;
  }
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof Term;
  label: string;
}

const headCells: readonly HeadCell[] = [
  { id: 'nameTerm', label: 'Tên kỳ học', },
  { id: 'startDate', label: 'Ngày bắt đầu', },
  { id: 'endDate', label: 'Ngày kết thúc', },
  { id: 'rosterDeadline', label: 'Hạn đăng ký lớp', },
  { id: 'gradeEntryDate', label: 'Ngày nhập điểm', },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Term) => void;
  order: Order | null;
  orderBy: string | null;
}

function EnhancedTableHead(props: Readonly<EnhancedTableProps>) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Term) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='left'
            padding='normal'
            sortDirection={orderBy === headCell.id ? order ?? undefined : undefined}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order ?? undefined : undefined}
              onClick={createSortHandler(headCell.id)}
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
    </TableHead >
  );
}
export default function HomePage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderBy, setOrderBy] = useState<keyof Term | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState<string>('');
  useEffect(() => {
    get(term, {}).then((res) => {
      console.log(res.data);
      setTerms(res.data.data);
    }
    )
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Term,
  ) => {
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
  const handleOnChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    
  }
  const filteredTerms = useMemo(() => {
    return terms.filter(term => term.nameTerm.toLowerCase().includes(search.toLowerCase()));
  }, [search, terms]);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - terms.length) : 0;

  const visibleRows = useMemo(
    () =>
      [...terms]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <>
      <h1 className='font-bold text-2xl text-center text-(--color-text)'>Kỳ học</h1>
      <div className='flex justify-between items-center relative'>
        <div className='relative'>
          <FontAwesomeIcon icon={faSearch} className='absolute opacity-50 top-3 left-2 cursor-pointer' />
          <input value={search} onChange={handleOnChangeSearch} type='text' placeholder='Tìm kiếm' className='shadow appearance-none border rounded-2xl py-2 pl-8 text-gray-700 focus:outline-none border-(--border-color) hover:border-(--border-color-hover)' /></div>
        <Link href={'/manager/create-term'} className='btn-text text-white py-2 px-4 w-40 rounded-md'>
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Thêm kỳ học
        </Link>
      </div>
      <Box sx={{ width: '100%' }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size='medium'
            >
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {visibleRows.map((term, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={term.id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="term"
                        padding="none"
                      >
                        {term.nameTerm}
                      </TableCell>
                      <TableCell align="left">{term.startDate.toLocaleDateString()}</TableCell>
                      <TableCell align="right">{term.endDate.toLocaleDateString()}</TableCell>
                      <TableCell align="right">{term.rosterDeadline.toLocaleDateString()}</TableCell>
                      <TableCell align="right">{term.gradeEntryDate.toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 15, 25]}
            component="div"
            count={terms.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

      </Box>
    </>
  );
}
