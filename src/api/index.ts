import axios, { AxiosResponse } from 'axios';
import { ISupportToken } from '../data/interface';
import { IBinanceSymbolTicker } from './interface';

const BINANCE_BASE_URL = 'https://api.binance.com/api/v1';
const BINANCE_SYMBOL_TICKER_END_POINT = '/ticker/24hr';

interface IBinanceSymbolTickerRecord {
  symbolTickerRecord: Record<string, IBinanceSymbolTicker>;
  ids: string[];
}

async function fetchSymbolTickers(
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

export async function fetchSymbolTickerRecords(
  tokens: ISupportToken[]
): Promise<IBinanceSymbolTickerRecord> {
  const binanceSymbolTickerRecord: IBinanceSymbolTickerRecord = {
    symbolTickerRecord: {},
    ids: [],
  };
  const responds = await fetchSymbolTickers(tokens);
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
  return records;
}
