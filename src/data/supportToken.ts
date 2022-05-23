export const supportTokens = [
  {
    id: 'binanceBnbusdt',
    symbol: 'BNBUSDT',
    token: 'BNB',
    address: 'native',
    isNativeToken: true,
    isTransferable: true,
  },
  {
    id: 'binanceBtcusdt',
    symbol: 'BTCUSDT',
    token: 'BTC',
    address: null,
    isNativeToken: false,
    isTransferable: false,
  },
  {
    id: 'binanceEthusdt',
    symbol: 'ETHUSDT',
    token: 'ETH',
    address: '0x8BaBbB98678facC7342735486C851ABD7A0d17Ca',
    isNativeToken: false,
    isTransferable: true,
  },
  {
    id: 'binanceDai',
    symbol: null,
    token: 'DAI',
    address: '0x8a9424745056Eb399FD19a0EC26A14316684e274',
    isNativeToken: false,
    isTransferable: true,
  },
  {
    id: 'binanceUsdt',
    symbol: null,
    token: 'USDT',
    address: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684',
    isNativeToken: false,
    isTransferable: true,
  },
];

export const streams = supportTokens.reduce<string[]>(function (
  tickerStreams,
  token
) {
  if (!token.symbol) return tickerStreams;
  tickerStreams.push(`${token.symbol.toLocaleLowerCase()}@ticker@3000ms`);
  return tickerStreams;
},
[]);
