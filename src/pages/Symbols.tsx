import React, { useState } from 'react';
import { Box, Table, TableContainer, TablePagination } from '@mui/material';
import { IBinanceSymbolTicker } from '../api/interface';
import EnhancedTableHead from '../components/EnhancedTableHead';
import SortTableBody from '../components/SortTableBody';
import useRealtimeSymbols from '../hooks/useRealtimeSymbols';

export type Order = 'asc' | 'desc';

const rootStyles = {
  width: '100%',
};

const tableStyles = {
  minWidth: 350,
};

const Symbols = function () {
  const { symbolTickerRecord, shouldDisplayIds, isLoading, error } =
    useRealtimeSymbols();
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof IBinanceSymbolTicker>('symbol');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof IBinanceSymbolTicker
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Box>{error.message}</Box>;

  return (
    <Box sx={rootStyles}>
      <TableContainer>
        <Table sx={tableStyles} aria-labelledby="symbolsTable">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <SortTableBody
            records={symbolTickerRecord}
            shouldDisplayIds={shouldDisplayIds}
            order={order}
            orderBy={orderBy}
            page={page}
            rowsPerPage={rowsPerPage}
          />
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={shouldDisplayIds.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default Symbols;
