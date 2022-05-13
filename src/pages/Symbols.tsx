import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { fetchSymbolTickers } from '../api';
import { IBinanceSymbolTicker } from '../api/interface';
import SymbolItem from '../components/SymbolItem';
import { supportTokens } from '../data/supportToken';

export interface IStreamTicker {
  e: string;
  E: number;
  s: string;
  p: string;
  P: string;
  w: string;
  x: string;
  c: string;
  Q: string;
  b: string;
  B: string;
  a: string;
  A: string;
  o: string;
  h: string;
  l: string;
  v: string;
  q: string;
  O: number;
  C: number;
  F: number;
  L: number;
  n: number;
}
interface IBinanceSymbolTickerRecord {
  symbolTickerRecord: Record<string, IBinanceSymbolTicker>;
  ids: string[];
}


const SOCKET_END_POINT = 'wss://stream.binance.com:9443/ws';

const Symbols = function () {
  const [symbolTickerRecord, setSymbolTickerRecord] = useState<
    Record<string, IBinanceSymbolTicker>
  >({});
  const [shouldDisplayIds, setShouldDisplayIds] = useState<string[]>([]);
  // const [didDisplayIds, setDidDisplayIds] = useState<string[]>([]);
  // const [nextIndex, setNextIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_END_POINT, {
    onOpen() {
      if (process.env.NODE_ENV === 'development') {
        console.log('WebSocket connected');
      }
    },
    onClose() {
      if (process.env.NODE_ENV === 'development') {
        console.log('WebSocket disconnected');
      }
    },
    shouldReconnect() {
      return true;
    },
  });

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
        // setDidDisplayIds(records.ids);
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
    <Box>
      {shouldDisplayIds.map(function (id) {
        const symbolTicker = symbolTickerRecord[id];
        return (
          <SymbolItem key={symbolTicker.symbol} symbolTicker={symbolTicker} />
        );
      })}
    </Box>
  );
};

export default Symbols;
