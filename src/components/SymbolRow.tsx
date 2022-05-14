import React, { FC } from 'react';
import { TableCell, TableRow } from '@mui/material';
import { IBinanceSymbolTicker } from '../api/interface';

type Props = {
  symbolTicker: IBinanceSymbolTicker;
};

const SymbolRow: FC<Props> = function ({ symbolTicker }) {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {symbolTicker.symbol}
      </TableCell>
      <TableCell align="right">{symbolTicker.lastPrice}</TableCell>
      <TableCell align="right">{symbolTicker.priceChangePercent}</TableCell>
    </TableRow>
  );
};

export default SymbolRow;
