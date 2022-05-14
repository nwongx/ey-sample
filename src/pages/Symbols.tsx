import React, { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import useWebSocket from 'react-use-websocket';
import { fetchSymbolTickers } from '../api';
import { IBinanceSymbolTicker } from '../api/interface';
import { supportTokens } from '../data/supportToken';
import SymbolRow from '../components/SymbolRow';
import type { IStreamTicker } from '../api/interface';

interface IBinanceSymbolTickerRecord {
  symbolTickerRecord: Record<string, IBinanceSymbolTicker>;
  ids: string[];
}

const SOCKET_END_POINT = 'wss://stream.binance.com:9443/ws';
interface HeadCell {
  id: keyof IBinanceSymbolTicker;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
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
interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof IBinanceSymbolTicker
  ) => void;
  order: Order;
  orderBy: string;
}

type Order = 'asc' | 'desc';

function EnhancedTableHead(props: EnhancedTableProps) {
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
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

const Symbols = function () {
  const [symbolTickerRecord, setSymbolTickerRecord] = useState<
    Record<string, IBinanceSymbolTicker>
  >({});
  const [shouldDisplayIds, setShouldDisplayIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_END_POINT, {
    shouldReconnect() {
      return true;
    },
  });

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] =
    React.useState<keyof IBinanceSymbolTicker>('symbol');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - shouldDisplayIds.length)
      : 0;

  useEffect(
    function () {
      const streams = supportTokens.map((token) => `${token.id}@ticker@3000ms`);
      sendJsonMessage({
        method: 'SUBSCRIBE',
        id: 1,
        params: streams,
      });

      return function () {
        sendJsonMessage({
          method: 'UNSUBSCRIBE',
          id: 1,
          params: streams,
        });
      };
    },
    [sendJsonMessage]
  );

  useEffect(
    function () {
      if (!lastJsonMessage) return;
      setSymbolTickerRecord(function (prev) {
        const ticker = lastJsonMessage as IStreamTicker;
        const record = {
          ...prev[ticker.s],
          priceChangePercent: ticker.P,
          lastPrice: ticker.c,
        };
        return { ...prev, [ticker.s]: record };
      });
    },
    [lastJsonMessage]
  );

  useEffect(function () {
    async function fetchTransactionsHelper() {
      try {
        setIsLoading(true);
        const binanceSymbolTickerRecord: IBinanceSymbolTickerRecord = {
          symbolTickerRecord: {},
          ids: [],
        };
        const responds = await fetchSymbolTickers(supportTokens);
        const records = responds.reduce<IBinanceSymbolTickerRecord>(function (
          record,
          respond
        ) {
          if (!respond.data.symbol) return record;
          // eslint-disable-next-line no-param-reassign
          record.symbolTickerRecord[respond.data.symbol] = respond.data;
          record.ids.push(respond.data.symbol);
          return record;
        },
        binanceSymbolTickerRecord);
        setSymbolTickerRecord(records.symbolTickerRecord);
        setShouldDisplayIds(records.ids);
      } catch (e) {
        if (e instanceof Error) {
          setError(e);
        }
      } finally {
        setIsLoading(false);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchTransactionsHelper();
  }, []);

  if (isLoading) return <Box>Loading...</Box>;
  if (error) return <Box>{error.message}</Box>;

  return (
    <Box sx={{ width: '100%' }}>
      <TableContainer>
        <Table sx={{ minWidth: 350 }} aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {shouldDisplayIds
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .sort(function (a, b) {
                return getComparator(order, orderBy)(
                  symbolTickerRecord[a],
                  symbolTickerRecord[b]
                );
              })
              .map(function (id) {
                return (
                  <SymbolRow
                    key={symbolTickerRecord[id].symbol}
                    symbolTicker={symbolTickerRecord[id]}
                  />
                );
              })}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
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
