import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import type { IBinanceSymbolTicker, IStreamTicker } from '../api/interface';
import { supportTokens, streams } from '../data/supportToken';
import { fetchSymbolTickerRecords } from '../api';

const SOCKET_END_POINT = 'wss://stream.binance.com:9443/ws';

function useRealtimeSymbols() {
  const [symbolTickerRecord, setSymbolTickerRecord] = useState<
    Record<string, IBinanceSymbolTicker>
  >({});
  const [shouldDisplayIds, setShouldDisplayIds] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(SOCKET_END_POINT, {
    shouldReconnect() {
      return true;
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(
    function () {
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
        const records = await fetchSymbolTickerRecords(supportTokens);
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

  return { symbolTickerRecord, shouldDisplayIds, isLoading, error };
}

export default useRealtimeSymbols;
