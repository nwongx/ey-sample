import { Grid } from '@mui/material';
import React, { FC } from 'react';
import { IBinanceSymbolTicker } from '../api/interface';


export interface ISymbol {
  id: string;
  token: string;
  symbol: string;
  address: string;
}

type Props = {
  symbolTicker: IBinanceSymbolTicker;
};

const SymbolItem: FC<Props> = function ({ symbolTicker }) {

  return (
    <Grid
      sx={(theme) => ({
        p: 1,
        width: '100%',
        height: 70,
        borderBottom: 1,
        borderColor: theme.palette.grey[400],
      })}
      container
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid>{symbolTicker.symbol}</Grid>
      <Grid>{symbolTicker.lastPrice}</Grid>
      <Grid>{symbolTicker.priceChangePercent}</Grid>
    </Grid>
  );
};

export default SymbolItem;
