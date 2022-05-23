import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { IBinanceSymbolTicker } from '../api/interface';
import type { Order } from '../pages/Symbols';

interface IHeadCell {
  id: keyof IBinanceSymbolTicker;
  label: string;
  numeric: boolean;
}

const headCells: readonly IHeadCell[] = [
  {
    id: 'symbol',
    numeric: false,
    label: 'Symbol',
  },
  {
    id: 'lastPrice',
    numeric: true,
    label: 'Price',
  },
  {
    id: 'priceChangePercent',
    numeric: true,
    label: '24H Change rate',
  },
];

interface IEnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IBinanceSymbolTicker
  ) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: IEnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof IBinanceSymbolTicker) =>
    (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default EnhancedTableHead;
