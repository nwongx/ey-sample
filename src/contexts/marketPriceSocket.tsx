import React, { createContext, useEffect, useState } from "react";
import useWebSocket from "react-use-websocket"
import type { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { ISymbol } from "../components/SymbolItem";

const socketURL = 'wss://stream.binance.com:9443/ws'

export interface IMarketPriceSocketContext {
  [key: string]: ISymbolMSG
}
export const MarketPriceSocketContext = createContext<IMarketPriceSocketContext>({});

type Props = {
  children: React.ReactNode,
}

export const testSymbols = [
  {
    id: 'btcusdt',
    symbol: 'BTCUSDT',
    token: 'BTC',
    address: ''
  },
  {
    id: 'ethusdt',
    symbol: "ETHUSDT",
    token: 'ETH',
    address: ''
  },
  {
    id: 'eosusdt',
    symbol: "EOSUSDT",
    token: 'EOS',
    address: ''
  }
]

export interface ISymbolMSG {
  s: string,
  p: string,
  E: number
  q: string,
}


const MarketPriceSocketProvider: React.FC<Props> = function ({ children }) {
  const [symbolRecords, setSymbolRecords] = useState<Record<string, ISymbolMSG>>({});
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(socketURL, {
    onOpen: () => console.log('WebSocket connected'),
    onClose: () => console.log('WebSocket disconnected'),
    shouldReconnect: (e) => {
      console.log('websocket reconnect ', e);
      return true;
    },
  })

  useEffect(() => {
    const streams = testSymbols.map(symbol => `${symbol.id}@trade`);
    sendJsonMessage({ method: "SUBSCRIBE", "id": 1, params: streams });
    return () => sendJsonMessage({ method: "UNSUBSCRIBE", "id": 1, params: streams })
  }, []);

  useEffect(() => {
    if (lastJsonMessage) {
      setSymbolRecords(prev => {
        return { ...prev, [lastJsonMessage.s]: lastJsonMessage };
      })
    }
  }, [setSymbolRecords, lastJsonMessage]);


  return (
    <MarketPriceSocketContext.Provider value={symbolRecords}>
      {children}
    </MarketPriceSocketContext.Provider>
  );
}

export default MarketPriceSocketProvider;