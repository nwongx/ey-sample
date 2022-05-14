import axios, { AxiosResponse } from 'axios';
import { ISupportToken } from '../data/interface';
import { IBinanceSymbolTicker } from './interface';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v1';
const BINANCE_SYMBOL_TICKER_END_POINT = '/ticker/24hr';

export async function fetchSymbolTickers(
  tokens: ISupportToken[]
): Promise<AxiosResponse<IBinanceSymbolTicker>[]> {
  return Promise.all(
    tokens.map(async function (token) {
      return axios.get<IBinanceSymbolTicker>(
        `${BINANCE_BASE_URL}${BINANCE_SYMBOL_TICKER_END_POINT}`,
        {
          params: { symbol: token.symbol },
        }
      );
    })
  );
}
