import React, { useEffect, useState } from 'react';
import { TableBody, TableCell, TableRow } from '@mui/material';
import type { IBinanceSymbolTicker } from '../api/interface';
import type { Order } from '../pages/Symbols';
import SymbolRow from './SymbolRow';

function descendingComparator<T, Key extends keyof T>(
  a: T,
  b: T,
  orderBy: Key
) {
  // eslint-disable-next-line
  const first = a[orderBy] as any;
  // eslint-disable-next-line
  const next = b[orderBy] as any;
  const res = first - next;
  if (!Number.isNaN(res)) return res;
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof IBinanceSymbolTicker>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface ISortTableBodyProps {
  records: Record<string, IBinanceSymbolTicker>;
  shouldDisplayIds: string[];
  order: Order;
  orderBy: keyof IBinanceSymbolTicker;
  page: number;
  rowsPerPage: number;
}

const SortTableBody: React.FC<ISortTableBodyProps> = function ({
  records,
  shouldDisplayIds,
  order,
  orderBy,
  page,
  rowsPerPage,
}) {
  const [didDisplayIds, setDidDisplayIds] = useState<string[]>([]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - didDisplayIds.length) : 0;

  useEffect(
    function () {
      const ids = shouldDisplayIds
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .sort(function (a, b) {
          return getComparator(order, orderBy)(records[a], records[b]);
        });
      setDidDisplayIds(ids);
    },
    [order, orderBy, page, rowsPerPage, shouldDisplayIds, records]
  );

  return (
    <TableBody>
      {didDisplayIds.map(function (id) {
        return (
          <SymbolRow key={records[id].symbol} symbolTicker={records[id]} />
        );
      })}
      {emptyRows > 0 && (
        <TableRow>
          <TableCell colSpan={6} />
        </TableRow>
      )}
    </TableBody>
  );
};

export default SortTableBody;
